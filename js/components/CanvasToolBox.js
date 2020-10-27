/**
 * @module CanvasToolBox
 */

import {
  SEL_CANVAS_TOOLBOX,
  SEL_COLOR_PICKER_CANVAS_TOOLBOX,
  SEL_BTN_CANVAS_TOOLBOX_BRUSH,
  SEL_BTN_CANVAS_TOOLBOX_ERASER,
  TOOL_BRUSH,
  COLOR_PICKER_DEFAULT } from '../constants.js';

import { DrawingTool } from './DrawingTool.js';

/**
 * @constructor
 * @description Creates a new CanvasToolbox object.
 */
let CanvasToolBox = function(){
  this.DOMNode = $( SEL_CANVAS_TOOLBOX );
  this.DOMNodeColorPicker = $( SEL_COLOR_PICKER_CANVAS_TOOLBOX );
  this.DOMNodeBrush = $( SEL_BTN_CANVAS_TOOLBOX_BRUSH );
  this.DOMNodeEraser = $( SEL_BTN_CANVAS_TOOLBOX_ERASER );
  this.drawingTool = new DrawingTool();

  this.initColorPicker(COLOR_PICKER_DEFAULT);
};

/**
 * @description Shows or hides the tool box.
 * @param {Boolean} visible tells whether the tool box should be shown or hidden.
 */
CanvasToolBox.prototype.setVisibility = function (visible) {
  if (visible) {
    this.DOMNode.removeClass('tool-box-hidden');
  }
  else {
    this.DOMNode.addClass('tool-box-hidden');
  }
};

/**
 * @description Initializes the color picker.
 * @param  {String} newColor Hexadecimal value of the color to be set.
 */
CanvasToolBox.prototype.initColorPicker = function (newColor) {

  this.drawingTool.color = newColor;

  $( SEL_COLOR_PICKER_CANVAS_TOOLBOX ).spectrum({
    color: newColor,
    replacerClassName: 'btn-color-picker',
    change: function(color) {
      this.drawingTool.color = color.toHexString();
      this.drawingTool.set(TOOL_BRUSH);
    }.bind(this)
  });
};

export { CanvasToolBox };