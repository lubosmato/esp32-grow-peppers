#pragma once

#include "driver/adc.h"
#include "esp_adc_cal.h"
#include "esp_log.h"

#include <algorithm>
#include <numeric>

const char* TAG_WATER = "water";

class WaterSensor {
  esp_adc_cal_characteristics_t adcChars{};

public:
  const float calibrationHigh;
  const float calibrationLow;

  struct WaterValue {
    float value;
    float voltage;

    static WaterValue unknown() {
      return {std::numeric_limits<float>::quiet_NaN(), std::numeric_limits<float>::quiet_NaN()};
    }
  };

private:
  const float k;
  const float q;

public:
  WaterSensor(const float calibrationHigh, const float calibrationLow) :
    calibrationHigh{calibrationHigh},
    calibrationLow{calibrationLow},
    k{100.0f / (calibrationHigh - calibrationLow)},
    q{100.0f / (1.0f - calibrationHigh / calibrationLow)}

  {
    ESP_LOGI(TAG_WATER, "calib: y = %f * x + %f", k, q);

    adc_set_data_width(ADC_UNIT_1, ADC_WIDTH_BIT_12);
    adc1_config_channel_atten(ADC1_CHANNEL_0, ADC_ATTEN_DB_11);
    constexpr uint32_t defaultVRef = 1100;
    esp_adc_cal_characterize(ADC_UNIT_1, ADC_ATTEN_DB_11, ADC_WIDTH_BIT_12, defaultVRef, &adcChars);
  }

  WaterValue read() {
    const float voltage = readVoltage();
    const float value = voltage * k + q;
    return {std::clamp(value, 0.0f, 100.0f), voltage};
  }

private:
  float readVoltage() {
    constexpr int numberOfSamples = 4086;

    int sum = 0;
    for (int i = 0; i < numberOfSamples; i++) {
      const int raw = adc1_get_raw(ADC1_CHANNEL_0);
      const int adcVoltage = esp_adc_cal_raw_to_voltage(raw, &adcChars);
      sum += adcVoltage;
    }

    const int average = sum / numberOfSamples;
    const float adcVoltage = average / 1000.0f; // average in [mV]
    constexpr float voltageMultiplier = 2; // NOTE resistor divider 1:1
    const float voltage = adcVoltage * voltageMultiplier;

    return voltage;
  }
};
