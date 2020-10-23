/**
 * @module classes
 */

import { functions } from './functions.js';
import { PIXEL_CANVAS_SEL, MODAL_CONTENT, TOOL_BRUSH,
	       TOOL_ERASER, DEFAULT_PICKER_COLOR, BLANK_PIXEL_COLOR,
	       MIN_PIXEL_SIZE, MAX_CANVAS_WIDTH_PO, CANVAS_ASPECT_RATIO,
	       ROW, COLUMN, MAX_PIXEL_SIZE, PIXEL_PADDING_CORRECTION } from './constants.js';

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
	this.maxWidthPx = Math.min(Math.floor(window.mainDivWidthPx/MIN_PIXEL_SIZE), MAX_CANVAS_WIDTH_PO);
	this.maxHeightPx = Math.floor(this.maxWidth*CANVAS_ASPECT_RATIO);
	this.isActive = false;
}

/**
 * @description Prepares the canvas.
 *
 */
Canvas.prototype.setUp = function() {

	let canvasCSSWidth;
	let pixelSize;

	let pixelBorderSize = $(".pixel").css("border-left-width");
	pixelBorderSize = (typeof myVar === 'undefined')? 0: functions.CSSPixelToNumber(pixelBorderSize);

	const TOTAL_BORDER_SIZE = pixelBorderSize * this.height;
	const MAX_CANVAS_WIDTH_PX = window.mainDivWidthPx-TOTAL_BORDER_SIZE;

	/* Here we calculate the % of the space available that we will use for the canvas,
	so that the pixels have a reasonable size.
	The side effects of not doing so would be:
	A too wide canvas and small amount of pixels results in too large pixels
	A too small canvas a large amount of pixels would result in too small pixels */

	for (let i=100;i>=1;i-=1) {

		canvasCSSWidth = i;
		pixelSize = ((MAX_CANVAS_WIDTH_PX / 100) * i) / this.width;

		if ((((MAX_CANVAS_WIDTH_PX / 100) * i) / this.width)<=MAX_PIXEL_SIZE) {
			break;
		}

	}

	window.canvas.DOMNode.css("width", (canvasCSSWidth+"%"));
	window.canvas.width = canvasCSSWidth;

	this.pixelSetUp(MAX_CANVAS_WIDTH_PX);

	functions.showToolbox(true);
	functions.showActionbox(true);
	window.drawingTool.set(TOOL_BRUSH);
	window.canvas.setVisibility(true);

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
Canvas.prototype.isCanvas = function() {
	return this.DOMNode.find(" tr ").length;
}

/**
 * @description Checks if the canvas width/height relation is allowed.
 *
 * @param  {Number} width  width of the canvas in pixelOdrom pixels.
 * @param  {Number} height height of the canvas in pixelOdrom pixels.
 */
Canvas.prototype.validProportions = function(width, height) {

	const PROPORTION = width/height;

	if (PROPORTION>=(CANVAS_ASPECT_RATIO/4) && PROPORTION <=CANVAS_ASPECT_RATIO){
		return true;
	}
	else{
		return false;
	}
},

/**
 * @description Checks whether the canvas with the given dimensions can be created.
 */
Canvas.prototype.checkCreate = function (width, height) {

	if (width > this.maxWidth || height >  this.maxHeight){
		window.canvas.setVisibility(true);
		showConfirmDialog("Canvas too big", `The dimensions selected exceed the available space.
			Would you like to create the biggest possible canvas (width: ${this.maxWidth}, height: ${this.maxHeight})?`,
			false,
			functions.createCanvasWrapper, MAX_CANVAS_PIXEL);
	}
	else
	{
		functions.createCanvasWrapper(width, height);
	}
}

/**
 * @description Creates the canvas.
 *
 * @param  {Array}   canvasSize Width and height of the canvas.
 * @param  {Boolean} scrollToCanvas tells whether to navigate to the canvas after creation.
 */
Canvas.prototype.create = function(width, height, scrollToCanvas=true){

	return new Promise((resolve) => {

		window.canvas.delete();

		for (let i=1; i<=height; i++){
			window.canvas.DOMNode.append(ROW);
			let lastRow = $(PIXEL_CANVAS_SEL + " tr").last();

			for (let j=1; j<=width; j++){
				lastRow.append(COLUMN);
			}
		}

		this.setUp(height, height);

		if (scrollToCanvas){
			functions.scrollToolboxTop();
		}

		resolve ("Canvas created");
	});
}

/**
 * @description Set ups the pixelOdrom pixels in the canvas.
 *
 * @param  {Number} maxCanvasWidthPx maximal width of the canvas in CSS pixels.
 */
Canvas.prototype.pixelSetUp = function() {

	const MAX_CANVAS_WIDTH_PERCENT = (this.maxWidthPx/window.mainDivWidthPx)*100;

	let pixelWidth = MAX_CANVAS_WIDTH_PERCENT/this.width;

	let padding = pixelWidth;
	padding = padding - padding*PIXEL_PADDING_CORRECTION;

	window.canvas.DOMNode.find(".pixel").width(pixelWidth+"%");
	window.canvas.DOMNode.find(".pixel").css("padding-bottom", padding+"%");

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
 * @description Resets all pixels to their initial color.
 */
Canvas.prototype.reset = function() {
	this.DOMNode.find(".pixel").css("background-color", BLANK_PIXEL_COLOR);
	functions.scrollToolboxTop();
}

/**
 * @description Loads a canvas.
 *
 * @param  {Object} file object containing the canvas to be imported.
 */
Canvas.prototype.load = function (input) {

	const FILE = input.files[0];
  let reader = new FileReader();

  reader.readAsText(FILE);

  reader.onload = function() {

  	let readerResult = reader.result;

  	try {
			let canvasToImport= $(readerResult);

	  	if (!functions.isValidCanvas(canvasToImport)){
	  		showInfoDialog("Wrong format", "The selected file does not contain a valid canvas.", false);
	  	}
	  	else {

				const CANVAS_WIDTH = canvasToImport.first().find(".pixel").length;
				const CANVAS_HEIGHT = canvasToImport.length;

				if (CANVAS_WIDTH > window.canvas.maxWidth || CANVAS_HEIGHT >  window.canvas.maxHeight) {
					window.modal.open("canvasImport");
				}
				else {
					window.canvas.DOMNode.html(reader.result);
					$("#input-width").val(CANVAS_WIDTH);
					$("#input-height").val(CANVAS_HEIGHT);

					window.canvas.setUp(CANVAS_WIDTH, CANVAS_HEIGHT);
					functions.setInputFieldValues(window.canvas.width, window.canvas.height);
					functions.scrollToolboxTop();
					throw new Error('Whoops!');
				}
			}
		}
		catch(e) {
			let shortErrorMessage = (e.message.length>500)?e.message.substring(0,499)+"...":e.message;

			window.modal.open("error", {"text": `There was an error while trying to load the canvas: ${shortErrorMessage}`});
		}
  };

  reader.onerror = function() {
  	window.modal.open("error", {"text": `There was an error while trying to load the canvas: ${reader.error}`});
  };

  /* This call is needed in order to make the even onchange fire every time,
  even if the users selects the same file again */

  $("#btn-load-canvas-input").prop("value", "");

}

/**
 * @description Saves the canvas to a .*pix file.
 */
Canvas.prototype.save = function() {

	//We need to clone the canvas, so that we don"t modify the DOM
	const CANVAS_TO_SAVE = window.canvas.DOMNode.clone();

	//removing styles since they should be calculated when loading
	CANVAS_TO_SAVE.find(".pixel").css("width", "");
	CANVAS_TO_SAVE.find(".pixel").css("padding-bottom", "");

	const canvasContent = CANVAS_TO_SAVE.html();

  const blob = new Blob([canvasContent], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "canvas.pix");
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

		html2canvas(this.DOMNode[0],
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
Spinner.prototype.show = function () {
	//a promise is needed to stop async execution
	return new Promise((resolve) => {

		$("#spinner-container").removeClass("spinner-container-hidden");

		$("#spinner-container").addClass("spinner-container");

		$("body").css("overflow", "hidden");

		functions.setBtnSidebarVisibility();

		this.isActive = true;

		resolve("Spin shown");
	});
}

/**
 * @description Hides the spinner.
 */
Spinner.prototype.hide = function () {
	//a promise is needed to stop async execution
	return new Promise((resolve) => {

		$("#spinner-container").addClass("spinner-container-hidden");
		$("#spinner-container").removeClass("spinner-container");

		$("body").css("overflow", "auto");

		functions.setBtnSidebarVisibility();

		this.isActive = false;

		resolve("Spin hidden");
	});
}

/**
 * @constructor
 * @description Creates a new Modal object.
 *
 */
let Modal = function(){
	this.DOMNode = $( "#dialog" );
	this.DOMNodeText = $( "#dialog" ).first("p");
	this.title;
	this.buttons = null;
}

/**
 * @description Sets title text.
 *
 * @param {String} text text to be shown on the modal title bar.
 */
Modal.prototype.setTitle = function (title) {
	this.title = title;
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
Modal.prototype.open = function (modalType, args) {

	if (args.title===undefined){
		this.setTitle(MODAL_CONTENT[modalType].title);
	}

	args.title===undefined?
		this.setTitle(MODAL_CONTENT[modalType].title):
		this.setTitle(args.title);

	args.text===undefined?
		this.setText(MODAL_CONTENT[modalType].text, true):
		this.setText(args.text);

	switch(modalType) {
	  case 'help':
	  	this.buttons = { "Alright!": function () { window.modal.DOMNode.dialog("close");}}
	    break;
	  case 'startUp':
			this.buttons = {"Get started!": function () { window.modal.DOMNode.dialog("close");}}
	    break;
	  case 'canvasCreate':
	  	this.buttons = {
	  		"Yes": function () {
	  						 window.canvas.checkCreate(args.callbackArgs.width, args.callbackArgs.height);
	  						 window.modal.DOMNode.dialog("close");
      				 },
      	"No":  function () {
        				 window.modal.DOMNode.dialog("close");
      				 }
    	}
	    break;
	  case 'canvasLoad':
	  	this.buttons = {
	  		"Yes": function () {
	  						 functions.showFileDialog();
	  						 window.modal.DOMNode.dialog("close");
      				 },
      	"No":  function () {
        				 window.modal.DOMNode.dialog("close");
      				 }
    	}
	    break;
	  case 'canvasSave':
	  	this.buttons = {
	  		"Yes": function () {
	  						 window.canvas.save();
	  						 window.modal.DOMNode.dialog("close");
      				 },
      	"No":  function () {
        				 window.modal.DOMNode.dialog("close");
      				 }
    	}
	    break;
	   case 'canvasReset':
	  	this.buttons = {
	  		"Yes": function () {
	  					   window.canvas.reset();
	  					   window.modal.DOMNode.dialog("close");
      				 },
      	"No":  function () {
        				 window.modal.DOMNode.dialog("close");
      				 }
    	}
	    break;
	  case 'canvasExport':
	  	this.buttons = {
	  		"Yes": function () {
        				 functions.exportCanvasWrapper();
        				 window.modal.DOMNode.dialog("close");
      				 },
      	"No":  function () {
        				 window.modal.DOMNode.dialog("close");
      				 }
    	}
	    break;
	  case 'info':
	  case 'error':
	  	this.buttons = {
	  		"OK": function () {
	  			window.modal.DOMNode.dialog("close");
	  		}
	  	}
	    break;
	}

	this.DOMNode.dialog({
		modal: true,
		title: this.title,
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

export { Canvas, DrawingTool, Spinner, Modal };