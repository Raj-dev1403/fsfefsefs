#ifndef UI_STREAM_DECK_H
#define UI_STREAM_DECK_H

#ifdef __cplusplus
extern "C" {
#endif

#include "lvgl.h"

#define GRID_ROWS 3
#define GRID_COLS 5
#define TOTAL_BUTTONS (GRID_ROWS * GRID_COLS)

/**
 * @brief Initializes the UI with placeholder objects.
 */
void create_stream_deck_ui(void);

/**
 * @brief Handles incoming serial data for static images and GIFs.
 */
void handle_serial_input(void);

#ifdef __cplusplus
}
#endif

#endif // UI_STREAM_DECK_H
