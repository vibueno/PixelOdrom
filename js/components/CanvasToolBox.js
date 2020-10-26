/**
 * @module CanvasToolBox
 */

import {
  CANVAS_TOOLBOX,
  CANVAS_TOOLBOX_COLOR_PICKER,
  CANVAS_TOOLBOX_BRUSH,
  CANVAS_TOOLBOX_ERASER,
  TOOL_BRUSH,
  DEFAULT_PICKER_COLOR } from '../constants.js';

import { DrawingTool } from './DrawingTool.js';

/**
 * @constructor
 * @description Creates a new CanvasToolbox object.
 */
let CanvasToolBox = function(){
  this.DOMNode = $( CANVAS_TOOLBOX );
  this.DOMNodeColorPicker = $( CANVAS_TOOLBOX_COLOR_PICKER );
  this.DOMNodeBrush = $( CANVAS_TOOLBOX_BRUSH );
  this.DOMNodeEraser = $( CANVAS_TOOLBOX_ERASER );
  this.drawingTool = new DrawingTool();

  this.initColorPicker(DEFAULT_PICKER_COLOR);
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

  $( CANVAS_TOOLBOX_COLOR_PICKER ).spectrum({
    color: newColor,
    replacerClassName: 'btn-color-picker',
    change: function(color) {
      this.drawingTool.color = color.toHexString();
      this.drawingTool.set(TOOL_BRUSH);
    }.bind(this)
  });
};

export { CanvasToolBox };