#include "button.hpp"

QueueHandle_t ButtonHandler::gpioEventQueue{};
std::array<Button*, GPIO_NUM_MAX> ButtonHandler::buttons{};
bool ButtonHandler::isInitialized{};

void Button::notifyChange(State newState) {
  if (newState == prevState) return;

  int64_t newPressTime = esp_timer_get_time();

  const bool isHoldLongEnough = lastPressTime != -1 && ((newPressTime - lastPressTime) / 1000) >= _onHoldTime.count();
  if (_onHold && prevState == State::Pressed && newState == State::Normal && isHoldLongEnough) {
    _onHold();
  } else if (_onClick && prevState == State::Pressed && newState == State::Normal) {
    _onClick();
  }

  prevState = newState;
  lastPressTime = newPressTime;
}

void ButtonHandler::initialize() {
  if (isInitialized) return;
  isInitialized = true;

  gpioEventQueue = xQueueCreate(10, sizeof(int));

  gpio_install_isr_service(ESP_INTR_FLAG_LEVEL1 | ESP_INTR_FLAG_EDGE);

  xTaskCreate(
    [](void*) {
      int btnIndex{};

      while (true) {
        if (xQueueReceive(gpioEventQueue, &btnIndex, portMAX_DELAY)) {
          Button* btn = buttons[btnIndex];
          if (btn == nullptr) return;

          btn->notifyChange(static_cast<Button::State>(gpio_get_level(btn->gpio)));
        }
      }
    },
    "button_task",
    2048,
    nullptr,
    10,
    nullptr);
}

void ButtonHandler::addButton(Button* btn) {
  buttons[static_cast<int>(btn->gpio)] = btn;
  gpio_isr_handler_add(btn->gpio, &gpioISRHandler, reinterpret_cast<void*>(btn->gpio));
}

void ButtonHandler::removeButton(Button* btn) {
  gpio_isr_handler_remove(btn->gpio);
  buttons[static_cast<int>(btn->gpio)] = nullptr;
}

void IRAM_ATTR ButtonHandler::gpioISRHandler(void* arg) {
  int btnIndex = reinterpret_cast<int>(arg);
  xQueueSendFromISR(gpioEventQueue, &btnIndex, NULL);
}
