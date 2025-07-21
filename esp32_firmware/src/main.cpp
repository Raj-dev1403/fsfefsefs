#include "pins_config.h"
#include "LovyanGFX_Driver.h"

#include <Arduino.h>
#include <lvgl.h>

#include "ui_stream_deck.h" // Our custom UI functions

// Board-specific hardware includes
#include <TCA9534.h>
TCA9534 ioex;
LGFX gfx;

// LVGL Display and Touch Driver Globals
static lv_disp_draw_buf_t draw_buf;
static lv_color_t *buf;


//  Display refresh callback for LVGL
void my_disp_flush(lv_disp_drv_t *disp, const lv_area_t *area, lv_color_t *color_p) {
  if (gfx.getStartCount() > 0) {
    gfx.endWrite();
  }
  uint32_t w = (area->x2 - area->x1 + 1);
  uint32_t h = (area->y2 - area->y1 + 1);
  gfx.pushImageDMA(area->x1, area->y1, w, h, (lgfx::rgb565_t *)&color_p->full);
  lv_disp_flush_ready(disp);
}

//  Read touch callback for LVGL
void my_touchpad_read( lv_indev_drv_t * indev_driver, lv_indev_data_t * data )
{
  uint32_t touch_x, touch_y;
  data->state = LV_INDEV_STATE_REL;
  bool touched = gfx.getTouch( &touch_x, &touch_y );
  if (touched)
  {
    data->state = LV_INDEV_STATE_PR;
    data->point.x = touch_x;
    data->point.y = touch_y;
  }
}

void setup()
{
  Serial.begin(115200);
  delay(2000);
  Serial.println("ESP32 Stream Deck Initializing...");

  // --- Board specific hardware initialization ---
  Wire.begin(15, 16);
  delay(50);
  ioex.attach(Wire);
  ioex.setDeviceAddress(0x18);
  ioex.config(1, TCA9534::Config::OUT);
  ioex.config(2, TCA9534::Config::OUT);
  ioex.output(1, TCA9534::Level::H);
  delay(20);
  ioex.output(2, TCA9534::Level::H);
  delay(100);
  pinMode(1, INPUT);

  // Init LovyanGFX Display
  gfx.init();
  gfx.initDMA();
  gfx.startWrite();
  gfx.fillScreen(TFT_BLACK);

  // Init LVGL
  lv_init();
  
  size_t buffer_size = sizeof(lv_color_t) * LCD_H_RES * 10;
  buf = (lv_color_t *)heap_caps_malloc(buffer_size, MALLOC_CAP_DMA);
  lv_disp_draw_buf_init(&draw_buf, buf, NULL, LCD_H_RES * 10);

  // Initialize display driver
  static lv_disp_drv_t disp_drv;
  lv_disp_drv_init(&disp_drv);
  disp_drv.hor_res = LCD_H_RES;
  disp_drv.ver_res = LCD_V_RES;
  disp_drv.flush_cb = my_disp_flush;
  disp_drv.draw_buf = &draw_buf;
  lv_disp_drv_register(&disp_drv);

  // Initialize input device driver
  static lv_indev_drv_t indev_drv;
  lv_indev_drv_init(&indev_drv);
  indev_drv.type = LV_INDEV_TYPE_POINTER;
  indev_drv.read_cb = my_touchpad_read;
  lv_indev_drv_register(&indev_drv);

  // Create our custom Stream Deck UI
  create_stream_deck_ui();

  Serial.println("Setup done. Ready to receive image data.");
}

void loop()
{
  // Check for serial data from the PC app
  handle_serial_input();

  // Let LVGL handle its tasks
  lv_timer_handler(); 
  delay(5);
}
