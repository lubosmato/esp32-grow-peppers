#pragma once

#include "driver/gpio.h"
#include "driver/ledc.h"
#include "esp_log.h"

const char* TAG_PWM = "pwm";

const std::array<uint16_t, 100> luminanceToDutyLUT = {{
  0,
  5,
  9,
  14,
  18,
  23,
  27,
  32,
  34,
  38,
  43,
  48,
  54,
  60,
  67,
  73,
  81,
  89,
  97,
  106,
  115,
  125,
  136,
  147,
  158,
  171,
  183,
  197,
  211,
  226,
  241,
  257,
  274,
  292,
  310,
  329,
  349,
  370,
  391,
  413,
  436,
  460,
  485,
  510,
  537,
  564,
  592,
  622,
  652,
  683,
  715,
  748,
  782,
  817,
  853,
  891,
  929,
  968,
  1009,
  1050,
  1093,
  1137,
  1181,
  1228,
  1275,
  1323,
  1373,
  1424,
  1476,
  1530,
  1584,
  1640,
  1698,
  1756,
  1816,
  1878,
  1940,
  2005,
  2070,
  2137,
  2205,
  2275,
  2346,
  2419,
  2493,
  2569,
  2646,
  2725,
  2805,
  2887,
  2970,
  3055,
  3142,
  3230,
  3320,
  3411,
  3504,
  3599,
  3696,
  3794,
}};

class PwmDevice {
  int currentPercentage{};
  int prevPercentage{};
  gpio_num_t gpio{};
  ledc_channel_t ledcChannel{};

  int percentageToDuty(int percentage) {
    if (percentage >= luminanceToDutyLUT.size()) return *luminanceToDutyLUT.crbegin();
    if (percentage < 0) return *luminanceToDutyLUT.cbegin();

    return luminanceToDutyLUT[percentage];
  }

public:
  PwmDevice(gpio_num_t gpio) : gpio{gpio} {
    static ledc_channel_t channelCounter = LEDC_CHANNEL_0;

    ledcChannel = channelCounter;
    channelCounter = static_cast<ledc_channel_t>(static_cast<int>(channelCounter) + 1);

    gpio_config_t conf{};

    conf.pin_bit_mask = (1 << gpio);
    conf.mode = GPIO_MODE_OUTPUT;
    conf.pull_up_en = GPIO_PULLUP_ENABLE;
    conf.pull_down_en = GPIO_PULLDOWN_DISABLE;
    conf.intr_type = GPIO_INTR_DISABLE;

    gpio_config(&conf);
    gpio_set_level(gpio, 0);

    ledc_fade_func_install(0);

    ledc_timer_config_t ledcTimerConfig{};
    ledcTimerConfig.speed_mode = LEDC_LOW_SPEED_MODE;
    ledcTimerConfig.timer_num = LEDC_TIMER_0;
    ledcTimerConfig.duty_resolution = LEDC_TIMER_12_BIT;
    ledcTimerConfig.freq_hz = 5000;
    ledcTimerConfig.clk_cfg = LEDC_AUTO_CLK;

    ledc_timer_config(&ledcTimerConfig);

    ledc_channel_config_t ledcChannelConfig{};
    ledcChannelConfig.speed_mode = LEDC_LOW_SPEED_MODE;
    ledcChannelConfig.channel = ledcChannel;
    ledcChannelConfig.timer_sel = LEDC_TIMER_0;
    ledcChannelConfig.intr_type = LEDC_INTR_DISABLE;
    ledcChannelConfig.gpio_num = gpio;
    ledcChannelConfig.duty = 0;
    ledcChannelConfig.hpoint = 0;

    ledc_channel_config(&ledcChannelConfig);

    set(0);
  }

  int get() {
    return currentPercentage;
  }

  void set(int newPercentage) {
    if (newPercentage == currentPercentage) return;

    prevPercentage = currentPercentage;
    currentPercentage = newPercentage;
    ESP_LOGI(TAG_PWM, "PWM set to %d%%, prev %d%%", currentPercentage, prevPercentage);

    ledc_fade_start
    ledc_set_fade_with_time(LEDC_LOW_SPEED_MODE, ledcChannel, percentageToDuty(currentPercentage), 1000);
    ledc_fade_start(LEDC_LOW_SPEED_MODE, ledcChannel, LEDC_FADE_NO_WAIT);
  }

  void toggle(int percentage) {
    if (currentPercentage > 0) {
      set(0.0);
    } else {
      set(percentage);
    }
  }
};
