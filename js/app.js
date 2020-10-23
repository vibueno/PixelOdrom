import { TOOL_BRUSH, TOOL_ERASER, DEFAULT_PICKER_COLOR, MIN_PIXEL_SIZE,
	       MAX_CANVAS_WIDTH_PO, CANVAS_ASPECT_RATIO, PIXEL_CANVAS_SEL,
	       MODAL_CONTENT, ROW, COLUMN, MAX_PIXEL_SIZE, PIXEL_PADDING_CORRECTION,
	       CURSOR_COLOR } from './modules/constants.js';

import { Canvas, Modal, Spinner, DrawingTool } from './modules/classes.js';

import { functions } from './modules/functions.js';

/* In this file we use the expression pixelOdrom pixels to refer of the squares in the table (canvas).
We do so to avoid confusion with CSS pixels */

/**
 *
 * Globals
 *
 */

let gbMouseIsDown = false;

let gbCurrentCanvasMaxWidthPO; //in pixelOdrom pixels
let gbCurrentCanvasMaxHeightPO; //in pixelOdrom pixels

let gbCurrentCanvasWidthPO; //in pixelOdrom pixels
let gbCurrentCanvasHeightPO; //in pixelOdrom pixels

let gbMainWidthPx; //In CSS pixels

let gbCurrentCanvasWidth; //%

/**
 *
 * General functions
 *
 */

/**
 * @description Sets value of global variables
 */
function setGlobals() {

	gbCurrentCanvasWidthPO = parseInt($("#input-width").val());
	gbCurrentCanvasHeightPO = parseInt($("#input-height").val());

	gbMainWidthPx = parseInt($(".main").width());

	gbCurrentCanvasMaxWidthPO = Math.min(Math.floor(gbMainWidthPx/MIN_PIXEL_SIZE), MAX_CANVAS_WIDTH_PO);
	gbCurrentCanvasMaxHeightPO = Math.floor(gbCurrentCanvasMaxWidthPO*CANVAS_ASPECT_RATIO);

}

/**
 * @description Sets up the application.
 */
function setUpPixelOdrom() {
	resetInputFieldValues();
	setGlobals();
	showToolbox(false);
	showActionbox(false);
	setBtnSidebarVisibility();
	window.canvas.setVisibility(false);

}

/**
 * @description Opens the open file dialog (not a jQuery UI Dialog).
 */
function showFileDialog() {

	/* We need to trigger this event manually, since we are using
	a button to activate a hidden input file field */

	$("#btn-load-canvas-input").trigger("click");
}

/**
 *
 * Input fields
 *
 */

/**
 * @description Resets the input fields to their default values.
 */
function resetInputFieldValues() {
	$("#inputWidth").val($("#input-width").prop("defaultValue"));
	$("#inputHeight").val($("#input-height").prop("defaultValue"));

	InitializeColorPicker(DEFAULT_PICKER_COLOR);
}

/**
 * @description Sets the value of the input fields
 *
 * @param  {Number} canvasWidth canvas width to be set to the input field.
 * @param  {Number} canvasHeight canvas height to be set to the input field.
 */
function setInputFieldValues(canvasWidth, canvasHeight) {
	$("#input-width").val(canvasWidth);
	$("#input-height").val(canvasHeight);
}

/**
 * @description Initializes the color picker.
 *
 * @param  {String} inputColor Hexadecimal value of the color to be set.
 */
function InitializeColorPicker(inputColor) {

	window.drawingTool.color = inputColor;

	$("#color-picker").spectrum({
	    color: inputColor,
	    replacerClassName: "btn-color-picker",
			change: function(color) {
        window.drawingTool.color = color.toHexString();
        window.drawingTool.set(TOOL_BRUSH);
    }
	});
}

/**
 *
 * Canvas
 *
 */

/**
 * @description Prepares the canvas.
 * @param  {Number} canvasWidthPO canvas width in pixelOdrom pixels.
 * @param  {Number} canvasHeightPO canvas height in pixelOdrom pixels.
 */
function setUpCanvas(canvasWidthPO, canvasHeightPO) {

	let canvasCSSWidth;
	let pixelSize;

	let pixelBorderSize = $(".pixel").css("border-left-width");
	pixelBorderSize = (typeof myVar === 'undefined')? 0: functions.CSSPixelToNumber(pixelBorderSize);

	const TOTAL_BORDER_SIZE = pixelBorderSize * gbCurrentCanvasHeightPO;
	const MAX_CANVAS_WIDTH_PX = gbMainWidthPx-TOTAL_BORDER_SIZE;

	setGlobals();

	/* Here we calculate the % of the space available that we will use for the canvas,
	so that the pixels have a reasonable size.
	The side effects of not doing so would be:
	A too wide canvas and small amount of pixels results in too large pixels
	A too small canvas a large amount of pixels would result in too small pixels */

	for (let i=100;i>=1;i-=1) {

		canvasCSSWidth = i;
		pixelSize = ((MAX_CANVAS_WIDTH_PX / 100) * i) / canvasWidthPO;

		if ((((MAX_CANVAS_WIDTH_PX / 100) * i) / canvasWidthPO)<=MAX_PIXEL_SIZE) {
			break;
		}

	}

	window.canvas.DOMNode.css("width", (canvasCSSWidth+"%"));
	gbCurrentCanvasWidth = canvasCSSWidth;

	setInputFieldValues(canvasWidthPO, canvasHeightPO);

	setGlobals();

	setUpPixel(MAX_CANVAS_WIDTH_PX);

	showToolbox(true);
	showActionbox(true);
	window.drawingTool.set(TOOL_BRUSH);
	window.canvas.setVisibility(true);

}

/**
 * @description Set ups the pixelOdrom pixels in the canvas.
 *
 * @param  {Number} maxCanvasWidthPx maximal width of the canvas in CSS pixels.
 */
function setUpPixel(maxCanvasWidthPx) {

	const MAX_CANVAS_WIDTH_PERCENT = (maxCanvasWidthPx/gbMainWidthPx)*100;

	let pixelWidth = MAX_CANVAS_WIDTH_PERCENT/gbCurrentCanvasWidthPO;

	let padding = pixelWidth;
	padding = padding - padding*PIXEL_PADDING_CORRECTION;

	window.canvas.DOMNode.find(".pixel").width(pixelWidth+"%");
	window.canvas.DOMNode.find(".pixel").css("padding-bottom", padding+"%");

}

/**
 * @description Checks whether the canvas can be created.
 *
 * @param  {Array} canvasSize Width and height of the canvas.
 */
function createCanvasCheck(canvasSize) {

	setGlobals();

	const CANVAS_WIDTH = canvasSize [0];
	const CANVAS_HEIGHT = canvasSize [1];

	const MAX_CANVAS_PIXEL=[gbCurrentCanvasMaxWidthPO, gbCurrentCanvasMaxHeightPO];

	if (CANVAS_WIDTH > gbCurrentCanvasMaxWidthPO || CANVAS_HEIGHT >  gbCurrentCanvasMaxHeightPO){
		showCanvas(true);
		showConfirmDialog("Canvas too big", `The dimensions selected exceed the available space.
			Would you like to create the biggest possible canvas (width: ${gbCurrentCanvasMaxWidthPO}, height: ${gbCurrentCanvasMaxHeightPO})?`,
			false,
			createCanvasWrapper, MAX_CANVAS_PIXEL);
	}
	else
	{
		createCanvasWrapper(canvasSize);
	}
}

/**
 * @description Creates the canvas.
 *
 * @param  {Array} canvasSize Width and height of the canvas.
 * @param  {Boolean} scrollToCanvas tells whether to navigate to the canvas after creation.
 */
function createCanvas(canvasSize, scrollToCanvas=true){

	return new Promise((resolve) => {

		const CANVAS_WIDTH = canvasSize [0];
		const CANVAS_HEIGHT = canvasSize [1];

		window.canvas.delete();

		for (let i=1; i<=CANVAS_HEIGHT; i++){
			window.canvas.DOMNode.append(ROW);
			let lastRow = $(PIXEL_CANVAS_SEL + " tr").last();

			for (let j=1; j<=CANVAS_WIDTH; j++){
				lastRow.append(COLUMN);
			}
		}

		setUpCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

		if (scrollToCanvas){
			scroll(0, getToolboxPositionTop());
		}

		resolve ("Canvas created");
	});
}

/**
 * @description Wrapper for the create function.
 *
 * @param  {Array} canvasSize Width and height of the canvas.
 */
function createCanvasWrapper(canvasSize) {

	/* It calls the functions sequentially by using promises
  This is needed for showing the spinner for the amount time
  pixelOdrom needs to create the canvas

	We need the delay call, because otherwise the Spin is not shown */

  if (canvasSize[0]*canvasSize[1]>1000) {
		showSpin().then(delay.bind(1000)).then(createCanvas.bind(null, canvasSize)).then(hideSpin);
	}
	else {
		createCanvas(canvasSize);
	}
}

/**
 * @description Checks if the canvas width/height relation is allowed.
 *
 * @param  {Number} widthPO width of the canvas in pixelOdrom pixels.
 * @param  {Number} heightPO height of the canvas in pixelOdrom pixels.
 */
function canvasPropCorrect(widthPO, heightPO) {

	const PROPORTION = widthPO/heightPO;

	if (PROPORTION>=(CANVAS_ASPECT_RATIO/4) && PROPORTION <=CANVAS_ASPECT_RATIO){
		return true;
	}
	else{
		return false;
	}

}

/**
 * @description Resets all pixels to their initial color.
 */
function resetCanvas() {
	window.canvas.DOMNode.find(".pixel").css("background-color", BLANK_PIXEL_COLOR);
	scrollToToolboxTop();
}

/**
 * @description Saves the canvas to a .*pix file.
 */
function saveCanvas() {

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
 * @description Wrapper for the export function.
 */
function exportCanvasWrapper() {

	/* It calls the functions sequentially by using promises
  This is needed for showing the spinner for the amount time
  pixelOdrom needs to export the canvas */

	showSpin().then(exportCanvas).then(hideSpin);
}

/**
 * @description Checks if the file to be imported contains a valid canvas.
 *
 * @returns {Boolean}
 */
function isValidCanvas(canvas) {
	let canvasCheck;

	if (canvas.length>0) {
		canvasCheck = canvas.filter("tr").get(0);

		if (canvasCheck === canvas.get(0)) {
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

/**
 * @description Loads a canvas.
 *
 * @param  {Object} file object containing the canvas to be imported.
 */
function loadCanvas(input) {

	const FILE = input.files[0];
  let reader = new FileReader();

  reader.readAsText(FILE);

  reader.onload = function() {

  	let readerResult = reader.result;

  	try {
			let canvasToImport= $(readerResult);

	  	if (!isValidCanvas(canvasToImport)){
	  		showInfoDialog("Wrong format", "The selected file does not contain a valid canvas.", false);
	  	}
	  	else {

	  		setGlobals();

				const CANVAS_WIDTH = canvasToImport.first().find(".pixel").length;
				const CANVAS_HEIGHT = canvasToImport.length;

				if (CANVAS_WIDTH > gbCurrentCanvasMaxWidthPO || CANVAS_HEIGHT >  gbCurrentCanvasMaxHeightPO) {
					const DIALOG_MSG = `The selected canvas is too big for the available space.
						If you created this canvas on another device, please make sure you use a similar one
						to edit it.`;

					showInfoDialog("Canvas too big", DIALOG_MSG, false);
				}
				else {
					window.canvas.DOMNode.html(reader.result);
					$("#input-width").val(CANVAS_WIDTH);
					$("#input-height").val(CANVAS_HEIGHT);

					setUpCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
					scrollToToolboxTop();
				}
			}
		}
		catch(e) {
			let shortErrorMessage = (e.message.length>500)?e.message.substring(0,499)+"...":e.message;

			showErrorDialog(DIALOG_ERROR_TITLE, `There was an error while trying to load the canvas: ${shortErrorMessage}`, false);
		}
  };

  reader.onerror = function() {
    showErrorDialog(DIALOG_ERROR_TITLE, `There was an error while trying to load the canvas: ${reader.error}`, false);
  };

  /* This call is needed in order to make the even onchange fire every time,
  even if the users selects the same file again */

  $("#btn-load-canvas-input").prop("value", "");

}

/**
 *
 * Toolbox
 *
 */

/**
 * @description Toggles the tool box.
 *
 * @param  {Boolean} show tells whether the tool box should be shown or hidden.
 */
function showToolbox(show) {
	if (show) {
		$("#tool-box").removeClass("tool-box-hidden");
	}
	else {
		$("#tool-box").addClass("tool-box-hidden");
	}
}

/**
 *
 * Action box
 *
 */

/**
 * @description Toggles the action box.
 *
 * @param {Boolean} show tells whether the action box should be shown or hidden.
 */
function showActionbox(show) {
	if (show) {
		$("#action-box").removeClass("action-box-hidden");
	}
	else {
		$("#action-box").addClass("action-box-hidden");
	}
}

/**
 * @description Functionality of the reset canvas button.
 */
function btnResetCanvasClick(){
	resetCanvas();
}

/**
 *
 * Side bar buttons
 *
 */

/**
 *
 * Back to top
 *
 */

/**
 * @description Sets the visibility of the back to top button.
 */
function setBacktotopVisibility() {

	if ((($( window ).height() + $(window).scrollTop()) >= ($("body").outerHeight()/1.25)) &&
		(functions.getToolboxPositionTop()<=$(window).scrollTop()) && canvas.isActive &&
		(!window.modal.isOpen() &&(!window.spinner.isActive))) {

		window.setTimeout( function() {
			$("#btn-back-to-top").removeClass("btn-back-to-top-hidden");
			$("#btn-back-to-top").addClass("btn-back-to-top-visible");
		}, 100);
	}
	else{
		window.setTimeout( function() {
			$("#btn-back-to-top").removeClass("btn-back-to-top-visible");
			$("#btn-back-to-top").addClass("btn-back-to-top-hidden");
		}, 100);
	}
}

/**
 *
 * Help
 *
 */

/**
 * @description Sets the visibility of the help button.
 */
function setBtnHelpVisibility() {
	if (!window.modal.isOpen() && (!window.spinner.isActive)) {

		window.setTimeout( function() {
			$("#btn-help").removeClass("btn-help-hidden");
			$("#btn-help").addClass("btn-help-visible");
		}, 100);
	}
	else{
		window.setTimeout( function() {
			$("#btn-help").removeClass("btn-help-visible");
			$("#btn-help").addClass("btn-help-hidden");
		}, 100);
	}
}

/**
 * @description Sets the visibility of the side bar buttons.
 */
function setBtnSidebarVisibility() {
	setBtnHelpVisibility();
	setBacktotopVisibility();
}

/**
 * @description document.ready
 */
$(function() {

	window.canvas = new Canvas();
	window.modal = new Modal();
	window.spinner = new Spinner();
	window.drawingTool = new DrawingTool();

	/**
	 *
	 * Events
	 *
	 */

	/**
	 *
	 * General events
	 *
	 */

	/**
	 * @description Sets the visibility of the sidebar on each scroll
	 */
	$(document).scroll(function() {
		setBtnSidebarVisibility();
	});

	/**
	 * @description Sets the visibility of the sidebar on each resize
	 */
	$(window).resize(function() {
		setBtnSidebarVisibility();
	});

	/**
	 *
	 * Canvas events
	 *
	 */

	/**
	 * @description Creates a canvas if requirements satisfied
	 */
	$("#size-picker").submit( function(e) {

		const CANVAS_WIDTH = parseInt($("#input-width").val());
		const CANVAS_HEIGHT = parseInt($("#input-height").val());
		const CANVAS_SIZE =[CANVAS_WIDTH, CANVAS_HEIGHT];

		if (!canvasPropCorrect(CANVAS_HEIGHT, CANVAS_WIDTH)) {
			showInfoDialog("Information", `The proportions selected are not allowed: the max. allowed aspect ratio is 1:${CANVAS_ASPECT_RATIO}.`, false);
		}
		else
		{
			const DIALOG_MSG = `Are you sure that you want to create a new ${CANVAS_WIDTH}x${CANVAS_HEIGHT} canvas?`;
			showConfirmDialog(DIALOG_CONFIRM_TITLE, DIALOG_MSG, false, createCanvasCheck, CANVAS_SIZE);
		}

		e.preventDefault();

	});

	/**
	 * @description Shows the load canvas dialog
	 */
	$("#btn-load-canvas").click( function() {

		const DIALOG_MSG = "Are you sure that you want to load a previously saved canvas?";
		showConfirmDialog(DIALOG_CONFIRM_TITLE, DIALOG_MSG, false, showFileDialog);

	});

	/*
	 *
	 * Event delegation
	 *
	 */

	/**
	 * @description Paints or erases pixels
	 */
	window.canvas.DOMNode.on("mousedown", "td", function() {
		gbMouseIsDown=true;
		window.drawingTool.paintPixel(this);
	});

	/**
	 * @description Paints or erases pixels
	 */
	window.canvas.DOMNode.on("mouseover", "td", function() {
		if (gbMouseIsDown){
			window.drawingTool.paintPixel(this);
		}
	});

	/**
	 * @description Paints or erases pixels
	 */
	window.canvas.DOMNode.on("mouseenter", function() {

		$( this ).awesomeCursor(window.drawingTool.color, {
			hotspot: [2, 15],
			color: CURSOR_COLOR
		});

	});

	/**
	 * @description Resets the cursor and deletes unneeded divs created by jQuery Awesome Cursor.
	 */

	/* One div is created every time a cursor is shown.
	By removing the divs, we keep the DOM cleaner and make the application faster
	Beware: since the selector is neither id nor class,
	this may produce unexpected results if other divs with the same style are used
	*/
	window.canvas.DOMNode.on("mouseleave", function() {

		$( this ).css('cursor', '');

		let invisibleViv = $( 'div[style="position: absolute; left: -9999px; top: -9999px;"]' );
		invisibleViv.remove();

	});

  /**
	 * @description Updates global when mouse button released
	 */

	/* In this case, we must use the document and not the canvas,
	because the user may release the mouse outside the canvas */
	$(document).on("mouseup", function() {
		gbMouseIsDown=false;
	});

  /**
	 * @description Prevents dragging on painted pixels,
	 * which otherwise may behave together like an image
	 */
	window.canvas.DOMNode.on("dragstart", function (e) {
		e.preventDefault();
	});

	/**
	 *
	 * Action box events
	 *
	 */

	$("#btn-reset-canvas").click(function() {
		if (isCanvasActive()){
			showConfirmDialog(DIALOG_CONFIRM_TITLE, "Are you sure that you want to reset this canvas?", false, btnResetCanvasClick);
		}
	});

	$("#btn-save-canvas").click( function(){
		if (isCanvasActive()){
			showConfirmDialog(DIALOG_CONFIRM_TITLE, "Are you sure that you want to save this canvas?", false, saveCanvas);
		}
	});

	$("#btn-export-canvas").click( function(){
		if (isCanvasActive()){
			showConfirmDialog(DIALOG_CONFIRM_TITLE, DIALOG_CONFIRM_EXPORT_TEXT, true, exportCanvasWrapper);
		}
	});

	/**
	 *
	 * Toolbox events
	 *
	 */

	$("#btn-tool-brush").click(function() {
		window.drawingTool.set(TOOL_BRUSH);
	});

	$("#btn-tool-eraser").click(function() {
		window.drawingTool.set(TOOL_ERASER);
	});

	/**
	 *
	 * Back to top events
	 *
	 */

	$("#btn-back-to-top").click(function() {
		if (window.canvas.isActive){
			scroll(0, functions.getToolboxPositionTop());
		}
		else {
			scroll(0,0);
		}
	});

	/**
	 *
	 * Dialog events
	 *
	 */

	$( "#dialog" ).on( "dialogopen",
		function( ) {
			setBtnSidebarVisibility();
		}
	);

	$( "#dialog" ).on( "dialogclose",
		function( ) {
			setBtnSidebarVisibility();
		}
	);

	$("#dialog").on ("change", "#dialog-start-up-hide",
		function( ) {

			try {
				if ($("#dialog-not-show-again").is(":checked")){
					localStorage.setItem('dialogStartUpHide', true);
				}
				else {
					localStorage.setItem('dialogStartUpHide', false);
				}
			}
			catch(e) {
				showErrorDialog(DIALOG_ERROR_TITLE, `There was an error trying to access the local storage: ${e.message}`, false);
			}
		}
	);

	/**
	 *
	 * Help events
	 *
	 */

	$("#btn-help").click(function() {
		modal.open("help");
	});

	/**
	 *
	 * Initial calls
	 *
	 */

	if (!localStorage.dialogStartUpHide) {
		modal.open("startUp");
	}

	setUpPixelOdrom();
	createCanvas([$("#input-width").prop("defaultValue"), $("#input-height").prop("defaultValue")], false);
});