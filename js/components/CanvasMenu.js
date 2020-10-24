import { DEFAULT_PICKER_COLOR, CANVAS_DEFAULT_WIDTH, CANVAS_DEFAULT_HEIGHT } from '../constants.js';

/**
 * @constructor
 * @description Creates a new Modal object.
 *
 */
let CanvasMenu = function(){
	this.DOMNodeGridWidth = $( '#input-width' );
	this.DOMNodeGridHeight = $( '#input-height' );
	this.DOMNodeBtnCanvasCreate = $( '#btn-create-canvas' );
	this.DOMNodeBtnCanvasLoad = $( '#btn-load-canvas' );

	this.DOMNodeGridHeight.prop('defaultValue', CANVAS_DEFAULT_WIDTH);
	this.DOMNodeGridHeight.prop('defaultValue', CANVAS_DEFAULT_HEIGHT);

};

/**
 * @description Sets the value of the input fields
 *
 * @param  {Number} canvasWidth canvas width to be set to the input field.
 * @param  {Number} canvasHeight canvas height to be set to the input field.
 */
CanvasMenu.prototype.setInputFields = function (width, height) {
	$('#input-width').val(width);
	$('#input-height').val(height);
};

/**
 * @description Resets the input fields to their default values.
 */
CanvasMenu.prototype.resetInputFields = function () {
	this.DOMNodeGridWidth.val(CANVAS_DEFAULT_WIDTH);
	this.DOMNodeGridHeight.val(CANVAS_DEFAULT_HEIGHT);
};

export { CanvasMenu };