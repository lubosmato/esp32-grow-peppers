idf_component_register(
    SRCS "main.cpp" "button.cpp"
    INCLUDE_DIRS ""
    REQUIRES essentials esp_adc_cal esp32-ds18b20 esp32-owb
)
