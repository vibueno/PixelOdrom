import {
	MIN_PIXEL_SIZE,
	MAX_CANVAS_WIDTH_PO,
	CANVAS_ASPECT_RATIO,
	CANVAS_SELECTOR,
	ROW,
	COLUMN,
	MAX_PIXEL_SIZE,
	PIXEL_PADDING_CORRECTION,
	BLANK_PIXEL_COLOR } from '../constants.js';

import { functions } from '../functions.js';

import { CanvasNoSpace, CanvasInvalidProportions } from './Error.js';

/**
 * @constructor
 * @description Creates a new Canvas object.
 *
 * @property {Object} DOMNode DOM object related to the canvas.
 * @property {Number} canvas width.
 * @property {Number} canvas height.
 */
let Canvas = function(width, height){
	this.DOMNode = $ ( CANVAS_SELECTOR );
	this.width = width;
	this.height = height;
	this.maxWidthPx = Math.min(Math.floor(window.mainDivWidthPx/MIN_PIXEL_SIZE), MAX_CANVAS_WIDTH_PO);
	this.maxHeightPx = Math.floor(this.maxWidth*CANVAS_ASPECT_RATIO);
	this.isActive = false;
};

/**
 * @description Prepares the canvas.
 *
 */
Canvas.prototype.setUp = function() {

	let canvasCSSWidth;
	let pixelSize;

	let pixelBorderSize = $('.pixel').css('border-left-width');
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

	this.DOMNode.css('width', (canvasCSSWidth+'%'));
	this.width = canvasCSSWidth;

	this.pixelSetUp(MAX_CANVAS_WIDTH_PX);

	this.setVisibility(true);

};

/**
 * @description Sets canvas visibility.
 *
 * @param {Boolean} indicates whether the Canvas should be shown or hidden
 */
Canvas.prototype.setVisibility = function (show) {
	if (show){
		this.DOMNode.removeClass('pixel-canvas-hidden');
		this.DOMNode.addClass('pixel-canvas');
		this.isActive = true;
	}
	else
	{
		this.DOMNode.addClass('pixel-canvas-hidden');
		this.DOMNode.removeClass('pixel-canvas');
		this.isActive = false;
	}
};

/**
 * @description Checks whether there is an active canvas.
 */
Canvas.prototype.isCanvas = function() {
	return this.DOMNode.find(' tr ').length;
};

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
};

/**
 * @description Creates the canvas.
 *
 * @param  {Array}   canvasSize Width and height of the canvas.
 * @param  {Boolean} scrollToCanvas tells whether to navigate to the canvas after creation.
 */
Canvas.prototype.create = function(width, height){

	return new Promise((resolve) => {

		//Check if the size of the canvas fits the available space
		if (width > this.maxWidth || height >  this.maxHeight){
			throw new CanvasNoSpace ();
		}

		if (!this.validProportions(width, height)) {
			throw new CanvasInvalidProportions ();
		}

		this.delete();

		for (let i=1; i<=height; i++){
			this.DOMNode.append(ROW);
			let lastRow = $(CANVAS_SELECTOR + ' tr').last();

			for (let j=1; j<=width; j++){
				lastRow.append(COLUMN);
			}
		}

		this.setUp(height, height);

		resolve ('Canvas created');
	});
};

/**
 * @description Wrapper for the create function.
 *
 * @param  {Array} canvasSize Width and height of the canvas.
 */
Canvas.prototype.createCanvasWrapper = function (width, height) {

	/* It calls the functions sequentially by using promises
  This is needed for showing the spinner for the amount time
  pixelOdrom needs to create the canvas

	We need the delay call, because otherwise the Spin is not shown */

  if (width*height>1000) {
		window.spinner.show().
			then(functions.delay.bind(1000)).
			then(this.create.bind(null, {width, height})).
			then(window.spinner.hide());
	}
	else {
		window.canvas.create(width, height);
	}
};

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

	this.DOMNode.find('.pixel').width(pixelWidth+'%');
	this.DOMNode.find('.pixel').css('padding-bottom', padding+'%');

};

/**
 * @description Deletes the canvas from the DOM.
 */
Canvas.prototype.delete = function() {

	const CANVAS_ROWS = this.DOMNode.find(' tr ');

	CANVAS_ROWS.remove();
	this.setVisibility(false);
};

/**
 * @description Resets all pixels to their initial color.
 */
Canvas.prototype.reset = function() {
	this.DOMNode.find('.pixel').css('background-color', BLANK_PIXEL_COLOR);
};

/**
 * @description Loads a canvas.
 *
 * @param  {Object} file object containing the canvas to be imported.
 */
Canvas.prototype.load = function (input) {

	return new Promise((resolve, reject) => {

		const FILE = input.files[0];
	  let reader = new FileReader();

	  reader.readAsText(FILE);

	  reader.onload = function() {

	  	let readerResult = reader.result;

				let canvasToImport= $(readerResult);


		  	if (!functions.isValidCanvas(canvasToImport)){
		  		reject('CanvasInvalid');
		  	}
		  	else
		  	{
					const CANVAS_WIDTH = canvasToImport.first().find('.pixel').length;
					const CANVAS_HEIGHT = canvasToImport.length;

					if (CANVAS_WIDTH > this.maxWidth || CANVAS_HEIGHT >  this.maxHeight) {
						window.modal.open('canvasImport');
					}
					else {
						this.DOMNode.html(reader.result);
					}

				  /* This call is needed in order to make the even onchange fires every time,
				  even if the users selects the same file again */
				  $('#btn-load-canvas-input').prop('value', '');

					resolve ('canvas loaded');
		  	}
			}.bind(this);

	  reader.onerror = function() {
	  	reject('CanvasLoadError');
	  };
	});

};

/**
 * @description Saves the canvas to a .*pix file.
 */
Canvas.prototype.save = function() {

	//We need to clone the canvas, so that we don't modify the DOM
	const CANVAS_TO_SAVE = this.DOMNode.clone();

	//removing styles since they should be calculated when loading
	CANVAS_TO_SAVE.find('.pixel').css('width', '');
	CANVAS_TO_SAVE.find('.pixel').css('padding-bottom', '');

	const canvasContent = CANVAS_TO_SAVE.html();

  const blob = new Blob([canvasContent], {type: 'text/plain;charset=utf-8'});
  saveAs(blob, 'canvas.pix');
};

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
		this.DOMNode.addClass('pixel-canvas-export');
		this.DOMNode.removeClass('pixel-canvas');

		html2canvas(this.DOMNode[0],
			{x: this.DOMNode.left,
			y: this.DOMNode.top})
		.then(canvas => {

		  //Saves canvas to client
			saveAs(canvas.toDataURL(), 'pixelOdrom.png');

			//Moving the pixel table back to its original position
			this.DOMNode.removeClass('pixel-canvas-export');
			this.DOMNode.addClass('pixel-canvas');

			resolve ('Exported canvas');

		});
	});
};


/**
 * @description Wrapper for the export function.
 */
Canvas.prototype.exportCanvasWrapper =  function () {

	/* It calls the functions sequentially by using promises
  This is needed for showing the spinner for the amount time
  pixelOdrom needs to export the canvas */

	window.spinner.show().
		then(window.canvas.export()).
		then(window.spinner.hide());
};

export { Canvas };