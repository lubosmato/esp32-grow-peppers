#pragma once

#include "time.hpp"

#include <charconv>
#include <functional>
#include <string>
#include <string_view>

const char* TAG_SCHEDULER = "scheduler";

struct Scheduler {
  struct Rule {
    uint8_t hour;
    uint8_t minute;
    int value;
  };

  std::function<void(int)> action{};
  std::vector<Rule> rules{};

  void setAction(std::function<void(int)> action) {
    this->action = action;
  }

  void setSchedule(std::string_view schedule) {
    int offset = 0;
    int index = -1;

    std::vector<Rule> newRules;

    do {
      index = schedule.find(',', offset);
      std::string_view rulePart{};

      if (index != std::string::npos) {
        rulePart = schedule.substr(offset, index - offset);
      } else {
        rulePart = schedule.substr(offset, -1);
      }

      offset = index + 1;

      int colonIndex = rulePart.find(':');
      int nextColonIndex = rulePart.find(':', colonIndex + 1);
      Rule rule{};

      auto [_, ecHours] = std::from_chars(rulePart.data(), rulePart.data() + colonIndex, rule.hour);
      if (ecHours != std::errc{}) {
        continue;
      }

      auto [__, ecMinutes] =
        std::from_chars(rulePart.data() + colonIndex + 1, rulePart.data() + nextColonIndex, rule.minute);
      if (ecMinutes != std::errc{}) {
        continue;
      }

      auto [___, ecValue] =
        std::from_chars(rulePart.data() + nextColonIndex + 1, rulePart.data() + rulePart.size(), rule.value);
      if (ecValue != std::errc{}) {
        continue;
      }

      if (rule.hour >= 24 || rule.minute >= 60) continue;

      newRules.push_back(rule);
      ESP_LOGI(TAG_SCHEDULER, "got rule %d:%d value: %d", rule.hour, rule.minute, rule.value);

    } while (index != std::string::npos);

    ESP_LOGI(TAG_SCHEDULER, "updating rules, new rules count: %d", newRules.size());
    rules = newRules;
  }

  void tick() {
    ESP_LOGI(TAG_SCHEDULER, "tick %s", Time::instance().nowISO().c_str());
    // NOTE has to be called every minute
    auto now = Time::instance().now();

    if (now) {
      for (const auto& rule : rules) {
        if (rule.hour == now->tm_hour && rule.minute == now->tm_min) {
          if (action) {
            ESP_LOGI(TAG_SCHEDULER, "calling action. rule: %d:%d value %d", rule.hour, rule.minute, rule.value);
            action(rule.value);
          }
          return;
        }
      }
    }
  }
};
