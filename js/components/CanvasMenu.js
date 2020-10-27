/**
 * @module CanvasMenu
 */

import {
  SEL_CANVAS_MENU_INPUT_WIDTH,
  SEL_CANVAS_MENU_INPUT_HEIGHT,
  SEL_CANVAS_MENU_CREATE_BTN,
  SEL_CANVAS_MENU_BTN_LOAD,
  NUM_CANVAS_DEFAULT_WIDTH,
  NUM_CANVAS_DEFAULT_HEIGHT } from '../constants.js';

/**
 * @constructor
 * @description Creates a new CanvasMenu object.
 *
 */
let CanvasMenu = function(){
  this.DOMNodeGridWidth = $ (SEL_CANVAS_MENU_INPUT_WIDTH );
  this.DOMNodeGridHeight = $ ( SEL_CANVAS_MENU_INPUT_HEIGHT );
  this.DOMNodeBtnCanvasCreate = $ (SEL_CANVAS_MENU_CREATE_BTN );
  this.DOMNodeBtnCanvasLoad = $ ( SEL_CANVAS_MENU_BTN_LOAD );

  this.DOMNodeGridHeight.prop('defaultValue', NUM_CANVAS_DEFAULT_WIDTH);
  this.DOMNodeGridHeight.prop('defaultValue', NUM_CANVAS_DEFAULT_HEIGHT);
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
  this.DOMNodeGridWidth.val(NUM_CANVAS_DEFAULT_WIDTH);
  this.DOMNodeGridHeight.val(NUM_CANVAS_DEFAULT_HEIGHT);
};

export { CanvasMenu };