/**
 * @module DrawingTool
 */

import {
  TOOL_BRUSH,
  TOOL_ERASER,
  SEL_BTN_CANVAS_TOOLBOX_BRUSH,
  SEL_BTN_CANVAS_TOOLBOX_ERASER,
  COLOR_PICKER_DEFAULT,
  COLOR_BLANK_PIXEL,
} from '../constants.js';

/**
 * @constructor
 * @description Creates a new DrawingTool object.
 *
 * @property {String} tool Indicates which drawing tool is selected.
 * @property {String} color Color to be used when painting pixels.
 *
 */
let DrawingTool = function() {
  this.tool = TOOL_BRUSH;
  this.color = COLOR_PICKER_DEFAULT;
};

/**
 * @description Changes the active tool.
 * @param  {String} tool Drawing tool to be set as active.
 */
DrawingTool.prototype.set = function(tool) {
  this.tool = tool;

  switch (tool) {
    case TOOL_BRUSH:
      $(SEL_BTN_CANVAS_TOOLBOX_ERASER).removeClass('btn-pressed');
      $(SEL_BTN_CANVAS_TOOLBOX_BRUSH).addClass('btn-pressed');
      break;
    case TOOL_ERASER:
      $(SEL_BTN_CANVAS_TOOLBOX_BRUSH).removeClass('btn-pressed');
      $(SEL_BTN_CANVAS_TOOLBOX_ERASER).addClass('btn-pressed');
      break;
  }
};

/**
 * @description Paints or erases a pixel.
 * @param {String} pixel Pixel to be painted
 */
DrawingTool.prototype.paintPixel = function(pixel) {
  if (this.tool === TOOL_BRUSH) {
    $(pixel).css('background-color', this.color);
  } else if (this.tool === TOOL_ERASER) {
    $(pixel).css('background-color', COLOR_BLANK_PIXEL);
  }
};

export { DrawingTool };
