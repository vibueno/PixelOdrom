/**
 * @module classes
 */

import { functions } from './functions.js';
import { PIXEL_CANVAS_SEL, MODAL_CONTENT, TOOL_BRUSH, TOOL_ERASER, DEFAULT_PICKER_COLOR,
         BLANK_PIXEL_COLOR } from './constants.js';

/**
 * @constructor
 * @description Creates a new Canvas object.
 *
 */
let Pixel = function(){
	this.color = BLANK_PIXEL_COLOR;
}

/**
 * @constructor
 * @description Creates a new Canvas object.
 *
 * @property {Object} DOMNode DOM object related to the canvas.
 * @property {Number} canvas width.
 * @property {Number} canvas height.
 */
let Canvas = function(width, height){
	this.DOMNode = $ ( PIXEL_CANVAS_SEL );
	this.width = width;
	this.height = height;
	this.isActive = false;
}

/**
 * @description Sets canvas visibility.
 *
 * @param {Boolean} indicates whether the Canvas should be shown or hidden
 */
Canvas.prototype.setVisibility = function (show) {
	if (show){
		this.DOMNode.removeClass("pixel-canvas-hidden");
		this.DOMNode.addClass("pixel-canvas");
		this.isActive = true;
	}
	else
	{
		this.DOMNode.addClass("pixel-canvas-hidden");
		this.DOMNode.removeClass("pixel-canvas");
		this.isActive = false;
	}
}

/**
 * @description Checks whether there is an active canvas.
 */
function isCanvas() {
	return this.DOMNode.find(" tr ").length;
}

/**
 * @description Deletes the canvas from the DOM.
 */
Canvas.prototype.delete = function() {

	const CANVAS_ROWS = this.DOMNode.find(" tr ");

	CANVAS_ROWS.remove();
	this.setVisibility(false);
}

/**
 * @description Exports the canvas to an image file.
 *
 * @returns {Object} Promise
 */
Canvas.prototype.export = function() {

	return new Promise((resolve) => {

		/*
		 In order to make it easier for html2canvas,
		 we move the pixel table to the left corner of the browser
		*/

		this.DOMNode.addClass("pixel-canvas-export");
		this.DOMNode.removeClass("pixel-canvas");

		html2canvas(this.DOMNode,
			{x: this.DOMNode.left,
			y: this.DOMNode.top})
		.then(canvas => {

		  //Saves canvas to client
			saveAs(canvas.toDataURL(), 'pixelOdrom.png');

			//Moving the pixel table back to its original position
			this.DOMNode.removeClass("pixel-canvas-export");
			this.DOMNode.addClass("pixel-canvas");

			resolve ("Exported canvas");

		});
	});
}

/**
 * @constructor
 * @description Creates a new DrawingTool object.
 *
 * @property {String} selectedTool indicates which drawing tool is selected.
 * @property {String} color color to be used when painting pixels.
 *
 */
let DrawingTool = function(){
	this.tool = TOOL_BRUSH;
	this.color = DEFAULT_PICKER_COLOR;
}

/**
 * @description Changes the active tool.
 *
 * @param  {String} tool drawing tool to be set as active.
 */
DrawingTool.prototype.set = function(tool) {

	this.tool = tool;

	switch(tool) {
	  case TOOL_BRUSH:
	  	$( "#btn-tool-eraser").removeClass("btn-pressed");
	    $( "#btn-tool-brush").addClass("btn-pressed");
	    break;
	  case TOOL_ERASER:
	  	$( "#btn-tool-brush").removeClass("btn-pressed");
	  	$( "#btn-tool-eraser").addClass("btn-pressed");
	    break;
	}
}

/**
 * @description Paints or erases a pixel.
 *
 * @param {String} color hexadecimal value of the color to be used
 */
DrawingTool.prototype.paintPixel = function (pixel) {
	if (this.tool === TOOL_BRUSH){
		$ (pixel).css( "background-color", this.color);
	}
	else 	if (this.tool === TOOL_ERASER){
		$ (pixel).css( "background-color", BLANK_PIXEL_COLOR);
	}
}

/**
 * @constructor
 * @description Creates a new Spinner object.
 *
 */
let Spinner = function(){
	this.isActive = false;
}

/**
 * @description Shows the spinner.
 */
Spinner.prototype.showSpin = function () {
	//a promise is needed to stop async execution
	return new Promise((resolve) => {

		$("#spinner-container").removeClass("spinner-container-hidden");

		$("#spinner-container").addClass("spinner-container");

		$("body").css("overflow", "hidden");

		setBtnSidebarVisibility();

		this.isActive = true;

		resolve("Spin shown");
	});
}

/**
 * @description Hides the spinner.
 */
Spinner.prototype.hideSpin = function () {
	//a promise is needed to stop async execution
	return new Promise((resolve) => {

		$("#spinner-container").addClass("spinner-container-hidden");
		$("#spinner-container").removeClass("spinner-container");

		$("body").css("overflow", "auto");

		setBtnSidebarVisibility();

		this.isActive = false;

		resolve("Spin hidden");
	});
}

/**
 * description Checks whether the spinner is being used.
 */
Spinner.prototype.isActive = function () {
	return $("#spinner-container").hasClass("spinner-container");
}

/**
 * @constructor
 * @description Creates a new Modal object.
 *
 */
let Modal = function(){
	this.DOMNode = $( "#dialog" );
	this.DOMNode.dialog;
	this.DOMNodeText = $( "#dialog" ).first("p");
	this.buttons = null;
}

/**
 * @description Sets title text.
 *
 * @param {String} text text to be shown on the modal title bar.
 */
Modal.prototype.setTitle = function (text) {
	this.DOMNode.attr('title', text );
};

/**
 * @description Sets modal text.
 *
 * @param {String} text text to be shown on the modal.
 * @param {String} isHTML indicates whether the text should be treated as HTML.
 */
Modal.prototype.setText = function (text, isHTML) {
	isHTML? this.DOMNodeText.html( text ): this.DOMNodeText.text( text );
};

/**
 * @description Opens the modal.
 *
 * @param {String} modalType indicates the type of modal to be shown.
 */
Modal.prototype.open = function (modalType) {
	this.setText(MODAL_CONTENT[modalType].text, true);


	switch(modalType) {
	  case 'helpDialog':
	  	this.buttons = { "Alright!": function () { window.modal.DOMNode.dialog("close");}}
	    break;
	  case 'startUp':
			this.buttons = {"Get started!": function () { window.modal.DOMNode.dialog("close");}}
	    break;
	  case 'export':
	  	this.buttons = {
	  		"Yes": function () {
        				 window.modal.DOMNode.dialog("close");
        				 callback(callbackParams);
      				 },
      	"No":  function () {
        				 window.modal.DOMNode.dialog("close");
      				 }
    	}
	    break;
	  case 'info':
	  case 'error':
	  	this.buttons = { "OK": function () { window.modal.DOMNode.dialog("close"); }}
	    break;
	}

	this.DOMNode.dialog({
		modal: true,
		buttons: this.buttons,
    resizable: false
  }).parent().removeClass("ui-state-error");

};

/**
 * @description Checks whether the jQuery UI Dialog is open.
 *
 * @returns {Boolean}
 */
Modal.prototype.isOpen = function () {

	/* We check first whether the dialog has been initialized
	https://stackoverflow.com/questions/15763909/jquery-ui-dialog-check-if-exists-by-instance-method */
	if (this.DOMNode.hasClass('ui-dialog-content')) {
		if (this.DOMNode.dialog("isOpen")) {
			return true;
		}
		else {
			return false;
		}
	}
	else {
		return false;
	}
}

export { Pixel, Canvas, DrawingTool, Spinner, Modal };