#pragma once

#include "driver/gpio.h"
#include "esp_camera.h"
#include "esp_log.h"

#include <memory>

const char* TAG_CAMERA = "cam";

static constexpr int CAM_PIN_PWDN = 32;
static constexpr int CAM_PIN_RESET = -1; // software reset will be performed
static constexpr int CAM_PIN_XCLK = 0;
static constexpr int CAM_PIN_SIOD = 26;
static constexpr int CAM_PIN_SIOC = 27;
static constexpr int CAM_PIN_D7 = 35;
static constexpr int CAM_PIN_D6 = 34;
static constexpr int CAM_PIN_D5 = 39;
static constexpr int CAM_PIN_D4 = 36;
static constexpr int CAM_PIN_D3 = 21;
static constexpr int CAM_PIN_D2 = 19;
static constexpr int CAM_PIN_D1 = 18;
static constexpr int CAM_PIN_D0 = 5;
static constexpr int CAM_PIN_VSYNC = 25;
static constexpr int CAM_PIN_HREF = 23;
static constexpr int CAM_PIN_PCLK = 22;
static constexpr gpio_num_t CAM_PIN_FLASHLIGHT = GPIO_NUM_4;

esp_err_t cameraInitialize() {
  gpio_config_t conf{};

  conf.pin_bit_mask = (1 << CAM_PIN_FLASHLIGHT);
  conf.mode = GPIO_MODE_OUTPUT;
  conf.pull_up_en = GPIO_PULLUP_ENABLE;
  conf.pull_down_en = GPIO_PULLDOWN_DISABLE;
  conf.intr_type = GPIO_INTR_ANYEDGE;

  gpio_config(&conf);
  gpio_set_level(CAM_PIN_FLASHLIGHT, 0);

  camera_config_t cameraConfig{};

  cameraConfig.pin_pwdn = CAM_PIN_PWDN;
  cameraConfig.pin_reset = CAM_PIN_RESET;
  cameraConfig.pin_xclk = CAM_PIN_XCLK;
  cameraConfig.pin_sscb_sda = CAM_PIN_SIOD;
  cameraConfig.pin_sscb_scl = CAM_PIN_SIOC;
  cameraConfig.pin_d7 = CAM_PIN_D7;
  cameraConfig.pin_d6 = CAM_PIN_D6;
  cameraConfig.pin_d5 = CAM_PIN_D5;
  cameraConfig.pin_d4 = CAM_PIN_D4;
  cameraConfig.pin_d3 = CAM_PIN_D3;
  cameraConfig.pin_d2 = CAM_PIN_D2;
  cameraConfig.pin_d1 = CAM_PIN_D1;
  cameraConfig.pin_d0 = CAM_PIN_D0;
  cameraConfig.pin_vsync = CAM_PIN_VSYNC;
  cameraConfig.pin_href = CAM_PIN_HREF;
  cameraConfig.pin_pclk = CAM_PIN_PCLK;
  cameraConfig.xclk_freq_hz = 16000000; // EXPERIMENTAL: Set to 16MHz on ESP32-S2 or ESP32-S3 to enable EDMA mode
  cameraConfig.ledc_timer = LEDC_TIMER_0;
  cameraConfig.ledc_channel = LEDC_CHANNEL_0;
  cameraConfig.pixel_format = PIXFORMAT_JPEG; // YUV422,GRAYSCALE,RGB565,JPEG
  cameraConfig.frame_size = FRAMESIZE_UXGA; // QQVGA-QXGA Do not use sizes above QVGA when not JPEG
  cameraConfig.jpeg_quality = 12; // 0-63 lower number means higher quality
  cameraConfig.fb_count = 1; // if more than one, i2s runs in continuous mode. Use only with JPEG
  cameraConfig.grab_mode = CAMERA_GRAB_WHEN_EMPTY; // CAMERA_GRAB_LATEST. Sets when buffers should be filled

  // initialize the camera
  esp_err_t err = esp_camera_init(&cameraConfig);
  if (err != ESP_OK) {
    ESP_LOGE(TAG_CAMERA, "Camera Init Failed");
    return err;
  }

  return ESP_OK;
}

auto camera_fb_t_deleter = [](camera_fb_t* f) {
  if (f) {
    esp_camera_fb_return(f);
  }
};

using unique_ptr_frame_buffer = std::unique_ptr<camera_fb_t, decltype(camera_fb_t_deleter)>;

unique_ptr_frame_buffer cameraCapture() {
  // discard previous frame
  auto f = esp_camera_fb_get();
  esp_camera_fb_return(f);

  auto frame = unique_ptr_frame_buffer{esp_camera_fb_get(), camera_fb_t_deleter};
  if (!frame) {
    ESP_LOGE(TAG_CAMERA, "Camera Capture Failed");
    return unique_ptr_frame_buffer{nullptr, camera_fb_t_deleter};
  }

  return std::move(frame);
}

void cameraSetFlashlight(bool enable) {
  gpio_set_level(CAM_PIN_FLASHLIGHT, enable ? 1 : 0);
}
