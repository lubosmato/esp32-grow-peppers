#pragma once

#include "ds18b20.h"

struct TemperatureSensor {
  static constexpr int maxSensorCount{2};

private:
  owb_rmt_driver_info rmt_driver_info;
  OneWireBus* owb;

  std::array<DS18B20_Info, maxSensorCount> sensors;
  int foundDevicesCount{0};

public:
  TemperatureSensor() {
    owb = owb_rmt_initialize(&rmt_driver_info, GPIO_NUM_27, RMT_CHANNEL_1, RMT_CHANNEL_0);
    owb_use_crc(owb, true); // enable CRC check for ROM code

    std::array<OneWireBus_ROMCode, 2> romCodes{};
    OneWireBus_SearchState deviceIter{};
    bool hasMore = false;

    owb_search_first(owb, &deviceIter, &hasMore);

    while (hasMore) {
      romCodes[foundDevicesCount] = deviceIter.rom_code;
      ++foundDevicesCount;
      owb_search_next(owb, &deviceIter, &hasMore);
    }

    for (int i = 0; i < foundDevicesCount; ++i) {
      DS18B20_Info& deviceInfo = sensors[i];

      ds18b20_init(&deviceInfo, owb, romCodes[i]);
      ds18b20_use_crc(&deviceInfo, true);
      ds18b20_set_resolution(&deviceInfo, DS18B20_RESOLUTION_12_BIT);
    }
  }

  std::array<std::optional<float>, maxSensorCount> read() {
    std::array<std::optional<float>, maxSensorCount> result{};

    for (int i = 0; i < foundDevicesCount; ++i) {
      float temp = std::numeric_limits<float>::quiet_NaN();
      if (ds18b20_convert_and_read_temp(&sensors[i], &temp) != DS18B20_OK) {
        result[i] = std::nullopt;
      }

      result[i] = temp;
    }

    return result;
  }
};
