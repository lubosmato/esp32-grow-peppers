#pragma once

#include "esp_sntp.h"

#include <chrono>
#include <ctime>

const char* TAG = "time";

void timeSyncNotificationCallback(struct timeval* tv);

class Time {
  std::string _timeZone{};

  Time() {
    ESP_LOGI(TAG, "Initializing SNTP");
    sntp_setoperatingmode(SNTP_OPMODE_POLL);

    sntp_setservername(0, "pool.ntp.org");
    sntp_set_time_sync_notification_cb(timeSyncNotificationCallback);
    sntp_init();
  }

public:
  static Time& instance() {
    static Time time;
    return time;
  }

  void setTimeZone(std::string_view newTimeZone) {
    _timeZone = std::string{newTimeZone};
    setenv("TZ", _timeZone.c_str(), 1);
    tzset();
  }

  std::string timeZone() {
    return _timeZone;
  }

  std::optional<tm> now() {
    auto tt = std::chrono::system_clock::to_time_t(std::chrono::system_clock::now());
    auto local_tm = *localtime(&tt);

    if (local_tm.tm_year + 1900 == 1970) {
      return std::nullopt;
    }

    return local_tm;
  }

  std::string nowISO() {
    auto time = now();
    if (!time) {
      return "null";
    }

    char buf[32];
    strftime(buf, sizeof(buf), "%FT%TZ", &*time);

    return buf;
  }
};

void timeSyncNotificationCallback(struct timeval* tv) {
  ESP_LOGI(TAG, "Got time from NTP: %s", Time::instance().nowISO().c_str());
}
