#include "button.hpp"
#include "camera.hpp"
#include "esp_log.h"
#include "essentials/config.hpp"
#include "essentials/device_info.hpp"
#include "essentials/esp32_storage.hpp"
#include "essentials/mqtt.hpp"
#include "essentials/settings_server.hpp"
#include "essentials/wifi.hpp"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "time.hpp"

namespace es = essentials;
using namespace std::chrono_literals;

const char* TAG_APP = "app";

extern const uint8_t mqttCertBegin[] asm("_binary_cert_pem_start");
extern const uint8_t mqttCertEnd[] asm("_binary_cert_pem_end");

struct App {
  es::DeviceInfo deviceInfo{};

  es::Esp32Storage configStorage{"config"};
  es::Config config{configStorage};
  es::Config::Value<std::string> ssid = config.get<std::string>("ssid", "");
  es::Config::Value<std::string> wifiPass = config.get<std::string>("wifiPass", "");
  es::Config::Value<std::string> mqttUrl = config.get<std::string>("url", "mqtt://127.0.0.1:1883");
  es::Config::Value<std::string> mqttUser = config.get<std::string>("user", "");
  es::Config::Value<std::string> mqttPass = config.get<std::string>("pass", "");
  es::Config::Value<std::string> timeZone = config.get<std::string>("timeZone", "CET-1CEST,M3.5.0/2,M10.5.0/3");
  es::Config::Value<bool> isFlashLightEnabled = config.get<bool>("flashlight", false);

  es::Wifi wifi{};
  std::unique_ptr<es::Mqtt> mqtt{};
  std::vector<std::unique_ptr<es::Mqtt::Subscription>> subs{};

  es::SettingsServer settingsServer{80,
    "Grow Plants Camera",
    "1.0.1",
    {
      {"WiFi SSID", ssid},
      {"WiFi Password", wifiPass},
      {"MQTT URL", mqttUrl},
      {"MQTT Username", mqttUser},
      {"MQTT Password", mqttPass},
      {"Time Zone (TZ env string)", timeZone},
    }};

  Button actionButton{GPIO_NUM_14};
  Time& time = Time::instance();
  bool isCameraTriggered = false;

  void run() {
    initialize();

    buildApi();

    constexpr int sleepTick = 100; // 100ms
    constexpr int captureInterval = 600; // 60s
    constexpr int deviceInfoInterval = 10; // 1s
    int captureCounter = 0;
    int publishDevInfoCounter = 0;

    while (true) {
      if (publishDevInfoCounter >= deviceInfoInterval) {
        publishDeviceInfo();
        publishDevInfoCounter = 0;
      }

      if (isCameraTriggered) {
        isCameraTriggered = false;
        captureAndPublish();
      }

      if (captureCounter >= captureInterval) {
        captureAndPublish();
        captureCounter = 0;
      }

      vTaskDelay(pdMS_TO_TICKS(sleepTick));
      captureCounter++;
      publishDevInfoCounter++;
    }
  }

  void initialize() {
    if (actionButton.get() == Button::State::Pressed) {
      goToSafeMode();
    }
    time.setTimeZone(*timeZone);
    cameraInitialize();
    wifi.connect(*ssid, *wifiPass);

    auto mqttCert =
      std::string_view{reinterpret_cast<const char*>(mqttCertBegin), std::size_t(mqttCertEnd - mqttCertBegin)};
    std::string mqttPrefix = "plantsCam/" + deviceInfo.uniqueId();

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
        mqtt->publish("connected", true, es::Mqtt::Qos::Qos0, false);
        publishDeviceInfo();
      },
      []() { ESP_LOGW(TAG_APP, "MQTT is disconnected!"); },
      1024 * 30);
  }

  void goToSafeMode() {
    ESP_LOGW(TAG_APP, "Safe mode enabled");
    ESP_LOGW(TAG_APP, "Starting WiFi AP with settings server.");

    wifi.startAccessPoint("GrowPlantsCam", "12345678", es::Wifi::Channel::Channel5);
    settingsServer.start();

    while (true) {
      ESP_LOGI(TAG_APP, "Waiting for configuration...");
      vTaskDelay(pdMS_TO_TICKS(1000));
    }
  }

  void buildApi() {
    actionButton.onHold(5s, [this]() {
      ESP_LOGW(TAG_APP, "Clearing WiFi and MQTT configuration");
      configStorage.clear();
      esp_restart();
    });

    actionButton.onClick([this]() { isCameraTriggered = true; });

    subs.emplace_back(
      mqtt->subscribe("camera/trigger", es::Mqtt::Qos::Qos0, [this](std::string_view) { isCameraTriggered = true; }));

    subs.emplace_back(
      mqtt->subscribe<bool>("camera/flashlight", es::Mqtt::Qos::Qos0, [this](std::optional<bool> value) {
        if (!value) return;
        isFlashLightEnabled = *value;
      }));
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

  void publishDeviceInfo() {
    if (mqtt->isConnected()) {
      mqtt->publish("info/freeHeap", deviceInfo.freeHeap(), es::Mqtt::Qos::Qos0, false);
      mqtt->publish("info/totalHeap", deviceInfo.totalHeap(), es::Mqtt::Qos::Qos0, false);
      mqtt->publish("info/uptime", deviceInfo.uptime(), es::Mqtt::Qos::Qos0, false);
    }
  }

  void captureAndPublish() {
    const bool shouldUseFlash = *isFlashLightEnabled;
    if (shouldUseFlash) {
      cameraSetFlashlight(true);
      vTaskDelay(pdMS_TO_TICKS(2000));
    }

    auto frame = cameraCapture();

    if (frame && mqtt->isConnected()) {
      ESP_LOGI(TAG_APP, "Sending image %dx%d with length %u", frame->width, frame->height, frame->len);

      mqtt->publish("image/data",
        std::string_view{reinterpret_cast<const char*>(frame->buf), frame->len},
        es::Mqtt::Qos::Qos0,
        true);
      mqtt->publish("image/datetime", time.nowISO(), es::Mqtt::Qos::Qos0, true);
    }

    if (shouldUseFlash) {
      cameraSetFlashlight(false);
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
