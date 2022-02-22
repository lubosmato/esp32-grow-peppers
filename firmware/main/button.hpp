#pragma once

#include "driver/gpio.h"
#include "esp_intr_alloc.h"
#include "freertos/FreeRTOS.h"
#include "freertos/queue.h"

#include <array>
#include <chrono>
#include <functional>

struct Button;

struct ButtonHandler {
  static QueueHandle_t gpioEventQueue;
  static std::array<Button*, GPIO_NUM_MAX> buttons;
  static bool isInitialized;

  static void initialize();
  static void addButton(Button* btn);
  static void removeButton(Button* btn);
  static void IRAM_ATTR gpioISRHandler(void* arg);
};

struct Button {
  friend ButtonHandler;

  enum class State : int {
    Unknown = -1,
    Pressed = 0,
    Normal = 1,
  };

  const gpio_num_t gpio;

  Button(gpio_num_t gpio) : gpio{gpio} {
    gpio_config_t conf{};

    conf.pin_bit_mask = (1 << gpio);
    conf.mode = GPIO_MODE_INPUT;
    conf.pull_up_en = GPIO_PULLUP_ENABLE;
    conf.pull_down_en = GPIO_PULLDOWN_DISABLE;
    conf.intr_type = GPIO_INTR_ANYEDGE;

    gpio_config(&conf);
    gpio_set_level(gpio, 1);

    prevState = static_cast<State>(gpio_get_level(gpio));

    ButtonHandler::initialize();
    ButtonHandler::addButton(this);
  }

  ~Button() {
    ButtonHandler::removeButton(this);
  }

  void onHold(std::chrono::milliseconds time, std::function<void()> reaction) {
    _onHoldTime = time;
    _onHold = reaction;
  }

  void onClick(std::function<void()> reaction) {
    _onClick = reaction;
  }

  State get() {
    return prevState;
  }

private:
  std::chrono::milliseconds _onHoldTime{};
  std::function<void()> _onHold{};
  std::function<void()> _onClick{};

  State prevState = State::Unknown;
  int64_t lastPressTime = -1;

  void notifyChange(State newState);
};