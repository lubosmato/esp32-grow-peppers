
#include "button.hpp"
#include "esp_log.h"
#include "esp_sleep.h"
#include "essentials/config.hpp"
#include "essentials/device_info.hpp"
#include "essentials/esp32_storage.hpp"
#include "essentials/mqtt.hpp"
#include "essentials/settings_server.hpp"
#include "essentials/wifi.hpp"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "temperature_sensor.hpp"
#include "time.hpp"
#include "water_sensor.hpp"

#include <chrono>

namespace es = essentials;
using namespace std::chrono_literals;

const char* TAG_APP = "app";

extern const uint8_t mqttCertBegin[] asm("_binary_cert_pem_start");
extern const uint8_t mqttCertEnd[] asm("_binary_cert_pem_end");

struct App {
  es::DeviceInfo deviceInfo{};

  es::Esp32Storage configStorage{"config"};
  es::Config config{configStorage};
  es::Config::Value<std::string> ssid = config.get<std::string>("ssid");
  es::Config::Value<std::string> wifiPass = config.get<std::string>("wifiPass");
  es::Config::Value<std::string> mqttUrl = config.get<std::string>("url", "");
  es::Config::Value<std::string> mqttUser = config.get<std::string>("user", "");
  es::Config::Value<std::string> mqttPass = config.get<std::string>("pass", "");

  es::Esp32Storage plantStorage{"plant"};
  es::Config plantConfig{plantStorage};
  es::Config::Value<float> waterCalibrationHigh = plantConfig.get<float>("high", 1.0f);
  es::Config::Value<float> waterCalibrationLow = plantConfig.get<float>("low", 2.0f);
  es::Config::Value<std::string> timeZone = plantConfig.get<std::string>("timeZone", "CET-1CEST,M3.5.0/2,M10.5.0/3");

  es::Wifi wifi{};
  std::unique_ptr<es::Mqtt> mqtt{};
  std::vector<std::unique_ptr<es::Mqtt::Subscription>> subs{};

  es::SettingsServer settingsServer{80,
    "My App",
    "1.0.1",
    {
      {"WiFi SSID", ssid},
      {"WiFi Password", wifiPass},
      {"MQTT URL", mqttUrl},
      {"MQTT Username", mqttUser},
      {"MQTT Password", mqttPass},
      {"Time Zone (TZ env string)", timeZone},
    }};

  WaterSensor::WaterValue waterAmount = WaterSensor::WaterValue::unknown();
  std::array<float, 2> temperatures{};
  std::array<int, 2> fanPowers{};
  WaterSensor waterSensor{*waterCalibrationHigh, *waterCalibrationLow};
  bool shouldRestart = false;

  TemperatureSensor temperatureSensor{};
  Time& time = Time::instance();

  Button button1{GPIO_NUM_18};
  Button button2{GPIO_NUM_19};

  void run() {
    button1.onHold(2s, []() { printf("Button 1 hold!\n"); });
    button2.onHold(2s, []() { printf("Button 2 hold!\n"); });
    button1.onClick([]() { printf("Button 1 click!\n"); });
    button2.onClick([]() { printf("Button 2 click!\n"); });

    time.setTimeZone(*timeZone);
    resetTemperatures();

    wifi.connect(*ssid, *wifiPass);

    ESP_LOGI(TAG_APP, "Waiting for wifi connection...");
    int tryCount = 0;
    while (!wifi.isConnected() && tryCount < 1000) {
      tryCount++;
      vTaskDelay(pdMS_TO_TICKS(10));
    }

    settingsServer.start();

    if (!wifi.isConnected()) {
      ESP_LOGW(TAG_APP, "Couldn't connect to the wifi. Starting WiFi AP with settings server.");
      wifi.startAccessPoint("esp32", "12345678", es::Wifi::Channel::Channel5);
      while (true) {
        ESP_LOGI(TAG_APP, "Waiting for configuration...");
        vTaskDelay(pdMS_TO_TICKS(1000));
      }
    }

    auto mqttCert =
      std::string_view{reinterpret_cast<const char*>(mqttCertBegin), std::size_t(mqttCertEnd - mqttCertBegin)};
    std::string mqttPrefix = "plants/" + deviceInfo.uniqueId();

    std::string url = *mqttUrl;
    std::string user = *mqttUser;
    std::string pass = *mqttPass;
    es::Mqtt::ConnectionInfo mqttInfo{url, mqttCert, user, pass};
    es::Mqtt::LastWillMessage lastWill{"last/will", "Bye", es::Mqtt::Qos::Qos0, false};

    mqtt = std::make_unique<es::Mqtt>(
      mqttInfo,
      std::string_view{mqttPrefix},
      std::chrono::seconds{30},
      lastWill,
      [this]() {
        ESP_LOGI(TAG_APP, "MQTT is connected!");
        publishDeviceInfo();
      },
      []() { ESP_LOGW(TAG_APP, "MQTT is disconnected!"); },
      1024 * 30);

    subs.emplace_back(
      mqtt->subscribe<float>("water/calibration/high", es::Mqtt::Qos::Qos0, [this](std::optional<float> value) {
        if (!value || waterSensor.calibrationHigh == *value) return;
        waterCalibrationHigh = *value;
        doDelayedRestart();
      }));

    subs.emplace_back(
      mqtt->subscribe<float>("water/calibration/low", es::Mqtt::Qos::Qos0, [this](std::optional<float> value) {
        if (!value || waterSensor.calibrationLow == *value) return;
        waterCalibrationLow = *value;
        doDelayedRestart();
      }));

    subs.emplace_back(mqtt->subscribe<int>("light", es::Mqtt::Qos::Qos0, [](std::optional<int> value) {
      if (!value) return;
      // TODO finish him
      printf("Light %d\n", *value);
    }));

    int fanIndex = 0;
    for (auto& fanPower : fanPowers) {
      subs.emplace_back(
        mqtt->subscribe<int>("fan/0/power", es::Mqtt::Qos::Qos0, [fanIndex, &fanPower](std::optional<int> newfanPower) {
          if (!newfanPower) return;
          fanPower = *newfanPower;
          // TODO finish him
          printf("Fan %d power %d\n", fanIndex, fanPower);
        }));
    }

    mqtt->publish("water/calibration/high", waterSensor.calibrationHigh, es::Mqtt::Qos::Qos0, true);
    mqtt->publish("water/calibration/low", waterSensor.calibrationLow, es::Mqtt::Qos::Qos0, true);

    while (true) {
      readSensors();
      publishDeviceInfo();
      publishPlantInfo();
      vTaskDelay(pdMS_TO_TICKS(1000));
    }
  }

  void doDelayedRestart() {
    xTaskCreate(
      [](void*) {
        vTaskDelay(pdMS_TO_TICKS(2000));
        esp_restart();
      },
      "restartTask",
      1024,
      nullptr,
      tskIDLE_PRIORITY,
      nullptr);
  }

  void resetTemperatures() {
    for (auto& temp : temperatures) {
      temp = std::numeric_limits<float>::quiet_NaN();
    }
  }

  void readSensors() {
    waterAmount = waterSensor.read();

    const auto measuredTemps = temperatureSensor.read();
    resetTemperatures();

    for (int i = 0; i < temperatureSensor.maxSensorCount; i++) {
      if (measuredTemps[i]) {
        temperatures[i] = *measuredTemps[i];
      }
    }
  }

  void publishDeviceInfo() {
    mqtt->publish("info/freeHeap", deviceInfo.freeHeap(), es::Mqtt::Qos::Qos0, false);
    mqtt->publish("info/totalHeap", deviceInfo.totalHeap(), es::Mqtt::Qos::Qos0, false);
    mqtt->publish("info/uptime", deviceInfo.uptime(), es::Mqtt::Qos::Qos0, false);

    mqtt->publish("info/datetime", time.nowISO(), es::Mqtt::Qos::Qos0, false);
  }

  void publishPlantInfo() {
    mqtt->publish("water/amount", waterAmount.value, es::Mqtt::Qos::Qos0, true);
    mqtt->publish("water/voltage", waterAmount.voltage, es::Mqtt::Qos::Qos0, true);

    int tempIndex = 0;
    for (const auto temp : temperatures) {
      mqtt->publish("temp/" + std::to_string(tempIndex) + "/celsius", temp, es::Mqtt::Qos::Qos0, true);
      tempIndex++;
    }
  }
};

extern "C" void app_main() {
  try {
    App{}.run();
  } catch (const std::exception& e) {
    ESP_LOGE(TAG_APP, "EXCEPTION: %s", e.what());
  } catch (...) {
    ESP_LOGE(TAG_APP, "UNKNOWN EXCEPTION");
  }
  esp_restart();
}
