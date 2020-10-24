/*
parseInt($('#input-width').val());
parseInt($('#input-height').val());
*/

import { TOOL_BRUSH, TOOL_ERASER, CURSOR_COLOR, CANVAS_DEFAULT_WIDTH, CANVAS_DEFAULT_HEIGHT  } from './constants.js';

import { functions } from './functions.js';

import { CanvasMenu } from './components/CanvasMenu.js';
import { Canvas } from './components/Canvas.js';
import { Modal } from './components/Modal.js';
import { SideBar } from './components/SideBar.js';
import { Spinner } from './components/Spinner.js';
import { CanvasToolBox } from './components/CanvasToolBox.js';
import { CanvasActionBox } from './components/CanvasActionBox.js';

/* In this file we use the expression pixelOdrom pixels to refer of the squares in the table (canvas).
We do so to avoid confusion with CSS pixels */

/**
 * @description document.ready
 */
$(function() {

	let canvasMenu = new CanvasMenu();
	let canvasActionBox = new CanvasActionBox();
	window.sideBar = new SideBar();

	window.modal = new Modal();
	window.spinner = new Spinner();

	window.canvasToolBox = new CanvasToolBox();
	window.canvas = new Canvas();

	/******************************************/
	/*
	This code may needed in some other places,
	since it was the function pixelOdrom setup

	Once places where needed, remove from here
	*/
	canvasMenu.resetInputFields();
	window.canvasToolBox.setVisibility(false);
	canvasActionBox.setVisibility(false);
	window.sideBar.setVisibility();
	window.canvas.setVisibility();
	/******************************************/


	window.mainDivWidthPx = parseInt($('.main').width());

	window.canvas.create(CANVAS_DEFAULT_WIDTH, CANVAS_DEFAULT_HEIGHT, false);
	window.canvasToolBox.setVisibility(true);
	canvasActionBox.setVisibility(true);

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
		window.sideBar.setVisibility();
	});

	/**
	 * @description Sets the visibility of the sidebar on each resize
	 */
	$(window).resize(function() {
		window.sideBar.setVisibility();
	});

	/**
	 * @description Sets the visibility of the sidebar on each resize
	 */
	$( '#header' ).click(function() {
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
	$('#size-picker').submit( function(e) {

		const CANVAS_WIDTH = parseInt($('#input-width').val());
		const CANVAS_HEIGHT = parseInt($('#input-height').val());

		if (!window.canvas.validProportions(CANVAS_HEIGHT, CANVAS_WIDTH)) {
			window.modal.open('canvasProportions');
		}
		else
		{
			const DIALOG_MSG = `Are you sure that you want to create a new ${CANVAS_WIDTH}x${CANVAS_HEIGHT} canvas?`;
			window.modal.open('canvasCreate', {'text': DIALOG_MSG, 'callbackArgs': {'width': CANVAS_WIDTH, 'height': CANVAS_HEIGHT}});
		}

		e.preventDefault();

	});

	/**
	 * @description Shows the load canvas dialog
	 */
	canvasMenu.DOMNodeBtnCanvasLoad.click( function() {
		window.modal.open('canvasLoad');

		/*
		If load successfull run:

		$('#input-width').val(CANVAS_WIDTH);
		$('#input-height').val(CANVAS_HEIGHT);

		this.setUp();

		functions.setInputFieldsValues(this.width, this.height);
		functions.scrollToolboxTop();
		*/

	});

	/*
	 *
	 * Event delegation
	 *
	 */

	/**
	 * @description Paints or erases pixels
	 */
	window.canvas.DOMNode.on('mousedown', 'td', function() {
		window.mouseDown=true;
		window.canvasToolBox.drawingTool.paintPixel(this);
	});

	/**
	 * @description Paints or erases pixels
	 */
	window.canvas.DOMNode.on('mouseover', 'td', function() {
		if (window.mouseDown){
			window.canvasToolBox.drawingTool.paintPixel(this);
		}
	});

	/**
	 * @description Paints or erases pixels
	 */
	window.canvas.DOMNode.on('mouseenter', function() {
		$( this ).awesomeCursor(window.canvasToolBox.drawingTool.tool, {
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
	window.canvas.DOMNode.on('mouseleave', function() {
		$( this ).css('cursor', '');

		let invisibleDiv = $( 'div[style="position: absolute; left: -9999px; top: -9999px;"]' );
		invisibleDiv.remove();
	});

  /**
	 * @description Updates global when mouse button released
	 */

	/* In this case, we must use the document and not the canvas,
	because the user may release the mouse outside the canvas */
	$(document).on('mouseup', function() {
		window.mouseDown=false;
	});

  /**
	 * @description Prevents dragging on painted pixels,
	 * which otherwise may behave together like an image
	 */
	window.canvas.DOMNode.on('dragstart', function (e) {
		e.preventDefault();
	});

	/**
	 *
	 * Action box events
	 *
	 */

	canvasActionBox.DOMNodeCanvasReset.click(function() {
		if (window.canvas.isActive){
			window.modal.open('canvasReset');
		}
	});

	canvasActionBox.DOMNodeCanvasSave.click( function(){
		if (window.canvas.isActive){
			window.modal.open('canvasSave');
		}
	});

	canvasActionBox.DOMNodeCanvasExport.click( function(){
		if (window.canvas.isActive){
			window.modal.open('canvasExport');
		}
	});

	/**
	 *
	 * Toolbox events
	 *
	 */

	window.canvasToolBox.DOMNodeBrush.click(function() {
		window.canvasToolBox.drawingTool.set(TOOL_BRUSH);
	});

	window.canvasToolBox.DOMNodeEraser.click(function() {
		window.canvasToolBox.drawingTool.set(TOOL_ERASER);
	});

	/**
	 *
	 * Back to top events
	 *
	 */

	window.sideBar.DOMNodeBtnBackToTop.click(function() {
		if (window.canvas.isActive){
			functions.scrollToolboxTop();
		}
		else {
			functions.scrollTop();
		}
	});

	/**
	 *
	 * Dialog events
	 *
	 */

	window.modal.DOMNode.on( 'dialogopen',
		function( ) {
			window.sideBar.setVisibility();
		}
	);

	window.modal.DOMNode.on( 'dialogclose',
		function( ) {
			window.sideBar.setVisibility();
		}
	);

	window.modal.DOMNode.on ('change', '#dialog-start-up-hide',
		function( ) {
			try {
				if ($('#dialog-not-show-again').is(':checked')){
					localStorage.setItem('dialogStartUpHide', true);
				}
				else {
					localStorage.setItem('dialogStartUpHide', false);
				}
			}
			catch(e) {
				window.modal.open('error', {'title': 'error', 'text': `There was an error trying to access the local storage: ${e.message}`});
			}
		}
	);

	/**
	 *
	 * Help events
	 *
	 */

	window.sideBar.DOMNodeBtnHelp.click(function() {
		window.modal.open('help');
	});

	if (!localStorage.dialogStartUpHide) {
		window.modal.open('startUp');
	}
});