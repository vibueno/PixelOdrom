/**
 * @module CanvasMenu
 */

import {
  CANVAS_MENU_INPUT_WIDTH,
  CANVAS_MENU_INPUT_HEIGHT,
  CANVAS_MENU_BTN_CREATE,
  CANVAS_MENU_BTN_LOAD,
  CANVAS_TOOLBOX_COLOR_PICKER,
  CANVAS_DEFAULT_WIDTH,
  CANVAS_DEFAULT_HEIGHT } from '../constants.js';

/**
 * @constructor
 * @description Creates a new CanvasMenu object.
 *
 */
let CanvasMenu = function(){
  this.DOMNodeGridWidth = $ (CANVAS_MENU_INPUT_WIDTH );
  this.DOMNodeGridHeight = $ ( CANVAS_MENU_INPUT_HEIGHT );
  this.DOMNodeBtnCanvasCreate = $ (CANVAS_MENU_BTN_CREATE );
  this.DOMNodeBtnCanvasLoad = $ ( CANVAS_MENU_BTN_LOAD );

  this.DOMNodeGridHeight.prop('defaultValue', CANVAS_DEFAULT_WIDTH);
  this.DOMNodeGridHeight.prop('defaultValue', CANVAS_DEFAULT_HEIGHT);
};

/**
 * @description Sets the value of the input fields
 * @param  {Number} width  canvas width to be set into the input field.
 * @param  {Number} height canvas height to be set into the input field.
 */
CanvasMenu.prototype.setInputFields = function (width, height) {
  this.DOMNodeGridWidth.val(width);
  this.DOMNodeGridHeight.val(height);
};

/**
 * @description Resets the input fields to their default values.
 */
CanvasMenu.prototype.resetInputFields = function () {
  this.DOMNodeGridWidth.val(CANVAS_DEFAULT_WIDTH);
  this.DOMNodeGridHeight.val(CANVAS_DEFAULT_HEIGHT);
};

export { CanvasMenu };