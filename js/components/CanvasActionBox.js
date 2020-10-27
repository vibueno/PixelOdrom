/**
 * @module CanvasActionBox
 */

import {
  SEL_CANVAS_ACTION_BOX,
  SEL_BTN_RESET_CANVAS_ACTION_BOX,
  SEL_BTN_SAVE_CANVAS_ACTION_BOX,
  SEL_BTN_EXPORT_CANVAS_ACTION_BOX } from '../constants.js';

/**
 * @constructor
 * @description Creates a new Canvas Action Box object.
 */
let CanvasActionBox = function(){
  this.DOMNode = $ ( SEL_CANVAS_ACTION_BOX );
  this.DOMNodeCanvasReset = $ ( SEL_BTN_RESET_CANVAS_ACTION_BOX);
  this.DOMNodeCanvasSave = $ ( SEL_BTN_SAVE_CANVAS_ACTION_BOX);
  this.DOMNodeCanvasExport = $ ( SEL_BTN_EXPORT_CANVAS_ACTION_BOX);
};

/**
 * @description Shows or hides the action box.
 * @param {Boolean} visible Tells whether the action box should be shown or hidden.
 */
CanvasActionBox.prototype.setVisibility = function (visible) {
  if (visible) {
    this.DOMNode.removeClass('action-box-hidden');
  }
  else {
    this.DOMNode.addClass('action-box-hidden');
  }
};

export { CanvasActionBox };