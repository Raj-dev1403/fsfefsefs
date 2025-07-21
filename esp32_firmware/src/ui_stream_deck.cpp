#include "ui_stream_deck.h"
#include <ArduinoJson.h>
#include "mbedtls/base64.h"
#include <Arduino.h>
// #include "lv_gif.h" // Remove GIF support

/*************************************
 * FORWARD DECLARATIONS
 *************************************/
void update_static_image(int button_id, const char* b64_data);

/*************************************
 * STATIC GLOBAL VARIABLES
 *************************************/

// LVGL UI Objects
static lv_obj_t* ui_parents[TOTAL_BUTTONS]; 
static lv_obj_t* ui_objects[TOTAL_BUTTONS]; 

// Serial and JSON data handling
#define SERIAL_BUFFER_SIZE 40000
static char serial_buffer[SERIAL_BUFFER_SIZE];
static StaticJsonDocument<SERIAL_BUFFER_SIZE> doc;

#define ESP32_IMAGE_WIDTH 110
#define ESP32_IMAGE_HEIGHT 110

/*************************************
 * UI FUNCTIONS
 *************************************/

// Creates a single placeholder button.
static void create_button(lv_obj_t* parent, int id) {
    lv_obj_t* btn = lv_btn_create(parent);
    lv_obj_set_size(btn, 110, 110);
    lv_obj_set_style_radius(btn, 20, 0);
    lv_obj_set_style_bg_color(btn, lv_color_hex(0x333333), 0);
    lv_obj_set_style_bg_opa(btn, LV_OPA_TRANSP, LV_PART_MAIN); // Make background transparent
    lv_obj_set_style_border_width(btn, 0, LV_PART_MAIN);       // Remove border
    lv_obj_set_style_shadow_width(btn, 0, LV_PART_MAIN);       // Remove shadow
    lv_obj_center(btn);
    // No label, image will be the only content
    ui_parents[id] = btn;
    ui_objects[id] = btn;
}

// Public function to initialize the entire UI.
void create_stream_deck_ui(void) {
    lv_obj_t* main_screen = lv_obj_create(NULL);
    lv_obj_t* button_grid_container = lv_obj_create(main_screen);
    lv_obj_remove_style_all(button_grid_container);
    lv_obj_set_size(button_grid_container, lv_pct(100), lv_pct(100));
    lv_obj_center(button_grid_container);
    lv_obj_set_flex_flow(button_grid_container, LV_FLEX_FLOW_ROW_WRAP);
    lv_obj_set_flex_align(button_grid_container, LV_FLEX_ALIGN_SPACE_EVENLY, LV_FLEX_ALIGN_CENTER, LV_FLEX_ALIGN_CENTER);
    lv_obj_set_style_pad_row(button_grid_container, 5, 0);
    lv_obj_set_style_pad_column(button_grid_container, 20, 0);

    for (int i = 0; i < TOTAL_BUTTONS; ++i) {
        create_button(button_grid_container, i);
    }
    lv_scr_load(main_screen);
}

// Updates a button with a static image.
void update_static_image(int button_id, const char* b64_data) {
    if (button_id < 0 || button_id >= TOTAL_BUTTONS) return;

    size_t output_len;
    mbedtls_base64_decode(NULL, 0, &output_len, (const unsigned char*)b64_data, strlen(b64_data));
    uint8_t* data_buffer = (uint8_t*)malloc(output_len);
    if (!data_buffer) return;
    mbedtls_base64_decode(data_buffer, output_len, &output_len, (const unsigned char*)b64_data, strlen(b64_data));

    lv_obj_t* btn = ui_objects[button_id];
    if (!btn) return;

    // Prepare a persistent image descriptor for this button
    static lv_img_dsc_t img_dscs[TOTAL_BUTTONS];
    lv_img_dsc_t* img_dsc = &img_dscs[button_id];
    img_dsc->header.always_zero = 0;
    img_dsc->header.w = ESP32_IMAGE_WIDTH;
    img_dsc->header.h = ESP32_IMAGE_HEIGHT;
    img_dsc->header.cf = LV_IMG_CF_TRUE_COLOR;
    img_dsc->data_size = output_len;
    img_dsc->data = data_buffer;

    // Set the image as the button's background
    lv_obj_set_style_bg_img_src(btn, img_dsc, LV_PART_MAIN);
    lv_obj_invalidate(btn);
}

/*************************************
 * SERIAL COMMUNICATION
 *************************************/

void handle_serial_input(void) {
    if (Serial.available() > 0) {
        size_t len = Serial.readBytesUntil('\n', serial_buffer, SERIAL_BUFFER_SIZE - 1);
        if (len > 0) {
            serial_buffer[len] = '\0';
            DeserializationError error = deserializeJson(doc, serial_buffer);
            if (!error) {
                const char* type = doc["type"];
                if (strcmp(type, "static") == 0) {
                    update_static_image(doc["id"], doc["data"]);
                }
            }
        }
    }
}
