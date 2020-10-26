import {
  CANVAS_ACTION_BOX,
  CANVAS_ACTION_BOX_RESET,
  CANVAS_ACTION_BOX_SAVE,
  CANVAS_ACTION_BOX_EXPORT } from '../constants.js';

/**
 * @constructor
 * @description Creates a new Canvas Action Box object.
 *
 */
let CanvasActionBox = function(){
  this.DOMNode = $ ( CANVAS_ACTION_BOX );
  this.DOMNodeCanvasReset = $ ( CANVAS_ACTION_BOX_RESET);
  this.DOMNodeCanvasSave = $ ( CANVAS_ACTION_BOX_SAVE);
  this.DOMNodeCanvasExport = $ ( CANVAS_ACTION_BOX_EXPORT);
};

/**
 * @description Shows or hides the action box.
 *
 * @param {Boolean} visible tells whether the action box should be shown or hidden.
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