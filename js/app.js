/*
parseInt($("#input-width").val());
parseInt($("#input-height").val());
*/

import { TOOL_BRUSH, TOOL_ERASER, DEFAULT_PICKER_COLOR, MIN_PIXEL_SIZE,
	       MAX_CANVAS_WIDTH_PO, CANVAS_ASPECT_RATIO, PIXEL_CANVAS_SEL,
	       ROW, COLUMN, MAX_PIXEL_SIZE, PIXEL_PADDING_CORRECTION,
	       CURSOR_COLOR } from './modules/constants.js';

import { Canvas } from './modules/components/Canvas.js';
import { Modal } from './modules/components/Modal.js';
import { Spinner } from './modules/components/Spinner.js';
import { DrawingTool } from './modules/components/DrawingTool.js';

import { functions } from './modules/functions.js';

/* In this file we use the expression pixelOdrom pixels to refer of the squares in the table (canvas).
We do so to avoid confusion with CSS pixels */

/**
 * @description document.ready
 */
$(function() {

	window.canvas = new Canvas();
	window.modal = new Modal();
	window.spinner = new Spinner();
	window.drawingTool = new DrawingTool();

	window.mainDivWidthPx = parseInt($(".main").width());

	functions.setUpPixelOdrom();
	window.canvas.create($("#input-width").prop("defaultValue"), $("#input-height").prop("defaultValue"), false);

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
		functions.setBtnSidebarVisibility();
	});

	/**
	 * @description Sets the visibility of the sidebar on each resize
	 */
	$(window).resize(function() {
		functions.setBtnSidebarVisibility();
	});

	/**
	 * @description Sets the visibility of the sidebar on each resize
	 */
	$( "#header" ).click(function() {
		functions.goToHomePage();
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

		if (!window.canvas.validProportions(CANVAS_HEIGHT, CANVAS_WIDTH)) {
			window.modal.open('canvasProportions', {});
		}
		else
		{
			const DIALOG_MSG = `Are you sure that you want to create a new ${CANVAS_WIDTH}x${CANVAS_HEIGHT} canvas?`;
			window.modal.open('canvasCreate', {"text": DIALOG_MSG, "callbackArgs": {"width": CANVAS_WIDTH, "height": CANVAS_HEIGHT}});
		}

		e.preventDefault();

	});

	/**
	 * @description Shows the load canvas dialog
	 */
	$("#btn-load-canvas").click( function() {
		window.modal.open('canvasLoad', {});
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
		window.mouseDown=true;
		window.drawingTool.paintPixel(this);
	});

	/**
	 * @description Paints or erases pixels
	 */
	window.canvas.DOMNode.on("mouseover", "td", function() {
		if (window.mouseDown){
			window.drawingTool.paintPixel(this);
		}
	});

	/**
	 * @description Paints or erases pixels
	 */
	window.canvas.DOMNode.on("mouseenter", function() {
		$( this ).awesomeCursor(window.drawingTool.tool, {
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

		let invisibleDiv = $( 'div[style="position: absolute; left: -9999px; top: -9999px;"]' );
		invisibleDiv.remove();
	});

  /**
	 * @description Updates global when mouse button released
	 */

	/* In this case, we must use the document and not the canvas,
	because the user may release the mouse outside the canvas */
	$(document).on("mouseup", function() {
		window.mouseDown=false;
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
		if (window.canvas.isActive){
			window.modal.open("canvasReset", {});
		}
	});

	$("#btn-save-canvas").click( function(){
		if (window.canvas.isActive){
			window.modal.open("canvasSave", {});
		}
	});

	$("#btn-export-canvas").click( function(){
		if (window.canvas.isActive){
			window.modal.open("canvasExport", {});
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
			scrollToolboxTop();
		}
		else {
			scrollTop();
		}
	});

	/**
	 *
	 * Dialog events
	 *
	 */

	$( "#dialog" ).on( "dialogopen",
		function( ) {
			functions.setBtnSidebarVisibility();
		}
	);

	$( "#dialog" ).on( "dialogclose",
		function( ) {
			functions.setBtnSidebarVisibility();
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
				modal.open('error', {"title": "error", "text": `There was an error trying to access the local storage: ${e.message}`});
			}
		}
	);

	/**
	 *
	 * Help events
	 *
	 */

	$("#btn-help").click(function() {
		modal.open("help", {});
	});

	if (!localStorage.dialogStartUpHide) {
		modal.open("startUp", {});
	}
});