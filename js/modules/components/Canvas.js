import { TOOL_BRUSH, TOOL_ERASER, DEFAULT_PICKER_COLOR, MIN_PIXEL_SIZE,
	       MAX_CANVAS_WIDTH_PO, CANVAS_ASPECT_RATIO, PIXEL_CANVAS_SEL,
	       ROW, COLUMN, MAX_PIXEL_SIZE, PIXEL_PADDING_CORRECTION,
	       CURSOR_COLOR } from '../constants.js';

import { functions } from '../functions.js';

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

export { Canvas };