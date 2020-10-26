/* In this file we use the expression pixelOdrom pixels to refer of the squares in the table (canvas).
We do so to avoid confusion with CSS pixels */

import {
  HEADER,
  MAIN,
  CURSOR_COLOR,
  CURSOR_INVISIBLE_DIV,
  //SPINNER,
  CANVAS_MENU_FORM,
  CANVAS_MENU_INPUT_WIDTH,
  CANVAS_MENU_INPUT_HEIGHT,
  CANVAS_TOOLBOX,
  TOOL_BRUSH,
  TOOL_ERASER,
  CANVAS_DEFAULT_WIDTH,
  CANVAS_DEFAULT_HEIGHT,
  MODAL_HELP_BUTTON_TEXT,
  MODAL_START_UP_BUTTON_TEXT} from './constants.js';

import { functions } from './functions.js';

import { Canvas } from './components/Canvas.js';
import { CanvasActionBox } from './components/CanvasActionBox.js';
import { CanvasMenu } from './components/CanvasMenu.js';
import { CanvasToolBox } from './components/CanvasToolBox.js';
import { Modal } from './components/Modal.js';
import { SideBar } from './components/SideBar.js';
//import { Spinner } from './components/Spinner.js';

/**
 * @description document.ready.
 */
$(function() {

  /**
   *
   * Functions
   *
   */

  /**
   * @description Resets PixelOdrom to all default values and visibilities.
   */

  let resetPixelOdrom = function (){
    canvas.delete();
    canvas.create(CANVAS_DEFAULT_WIDTH, CANVAS_DEFAULT_HEIGHT, false);
    canvas.setUp();
    canvas.setVisibility(true);
    setSideBarVisibility();
    canvasToolBox.setVisibility(true);
    canvasToolBox.drawingTool.set(TOOL_BRUSH);
    canvasActionBox.setVisibility(true);
  };

  /**
   * @description Navigates to an empty page with no canvas.
   */
   let goToHomePage = function () {
    if (canvas.isActive) {
     modal.open('pageLeave', 'yesNo')
     .then(
      answer_yes => {if (answer_yes) resetPixelOdrom();});
    }
  };

  /**
   * @description Sets the visibility of the sidebar.
   */
  let setSideBarVisibility = function () {
    if (!modal.isOpen()){
      sideBar.setHelpVisibility(true);
    }
    else {
      sideBar.setHelpVisibility(false);
    }

    if (((($ ( window ).height() + $ ( window ).scrollTop()) >= ($ ( 'body' ).outerHeight()/1.25)) &&
     (functions.getNodePositionTop(CANVAS_TOOLBOX)<=$ ( window ).scrollTop())) &&
      canvas.isActive &&
      !modal.isOpen()) {
      sideBar.setBacktotopVisibility(true);
    }
    else {
      sideBar.setBacktotopVisibility(false);
    }
  };

  /**
   * @description Handles the click event on the header when called from index.html.
   * @param {Number} file File to be loaded as a canvas.
   */
  window.btnLoadCanvasClick = function (file){
    canvas.load(file)
    .catch(err => {
      switch(err){
       case "CanvasWrongFormat":
       modal.open('canvasWrongFormat', 'OK');
       break;
       default:
         modal.open('canvasLoadError', 'OK');
       }
     });
  };

  /*
   *
   * Initial calls
   *
   */

  window.mainDivWidthPx = parseInt($ (MAIN).width());

  //let spinner = new Spinner();
  let modal = new Modal();
  let canvas = new Canvas();
  let canvasMenu = new CanvasMenu();
  let canvasToolBox = new CanvasToolBox();
  let canvasActionBox = new CanvasActionBox();
  let sideBar = new SideBar();

  let mouseDown=false;

  resetPixelOdrom();

  if (!localStorage.dialogStartUpHide) {
    modal.open('startUp', 'OK', {'button1Label': MODAL_START_UP_BUTTON_TEXT});
  }

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
   * @description scroll event on document.
   * Sets the visibility of the sidebar on each scroll.
   */
  $ ( document ).scroll(function() {
    setSideBarVisibility();
  });

  /**
   * @description resize event on window.
   * Sets the visibility of the sidebar on each resize.
   */
  $ ( window ).resize(function() {
    setSideBarVisibility();
  });

  /**
   * @description click event on the header.
   * Check whether to reset the application.
   */
  $ ( HEADER ).click(function() {
    goToHomePage();
  });

  /**
   *
   * Canvas events
   *
   */

  /**
   * @description Creates a canvas if requirements satisfied.
   */
  $ ( CANVAS_MENU_FORM ).submit( function(e) {

    const CANVAS_WIDTH = parseInt($( CANVAS_MENU_INPUT_WIDTH ).val());
    const CANVAS_HEIGHT = parseInt($( CANVAS_MENU_INPUT_HEIGHT ).val());

    //TODO: spinner
    modal.open('canvasCreate', 'yesNo',
      {'messageArgs': {'canvasWidth': CANVAS_WIDTH, 'canvasHeight': CANVAS_HEIGHT}})
    .then(
    	answer_yes => {if (answer_yes) canvas.create(CANVAS_WIDTH, CANVAS_HEIGHT);});

    e.preventDefault();

  });

  /**
   * @description Shows the load canvas dialog.
   */
  canvasMenu.DOMNodeBtnCanvasLoad.click( function() {

    modal.open('canvasLoad', 'yesNo')
    .then(
     answer_yes => {if (answer_yes) functions.showFileDialog();});

    /*
    If load successful run:

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
   * @description mousedown event on canvas.td.
   * Paints or erases pixels.
   */
  canvas.DOMNode.on('mousedown', 'td', function() {
    mouseDown=true;
    canvasToolBox.drawingTool.paintPixel(this);
  });

  /**
   * @description mousedown event on canvas.td.
   * Paints or erases pixels.
   */
  canvas.DOMNode.on('mouseover', 'td', function() {
    if (mouseDown){
     canvasToolBox.drawingTool.paintPixel(this);
   }
  });

  /**
   * @description mouseenter event on canvas.td.
   * Sets cursor depending on selected tool.
   */
  canvas.DOMNode.on('mouseenter', function() {
    $( this ).awesomeCursor(canvasToolBox.drawingTool.tool, {
     hotspot: [2, 15],
     color: CURSOR_COLOR
   });
  });

  /**
   * @description mouseleave event on canvas.
   * Resets the cursor and deletes unneeded divs created by jQuery Awesome Cursor.
   */

  /* One div is created every time a cursor is shown.
  By removing the divs, we keep the DOM cleaner and make the application faster
  Beware: since the selector is neither id nor class,
  this may produce unexpected results if other divs with the same style are used
  */
  canvas.DOMNode.on('mouseleave', function() {
    $( this ).css('cursor', '');

    let invisibleDiv = $( CURSOR_INVISIBLE_DIV );
    invisibleDiv.remove();
  });

  /**
   * @description mouseup event on document.
   * Updates variable mouseDown when mouse button released.
   */

  /* In this case, we must use the document and not the canvas,
  because the user may release the mouse outside the canvas */
  $ ( document ).on('mouseup', function() {
    mouseDown=false;
  });

  /**
   * @description dragstart event on canvas.
   * Prevents dragging on painted pixels, which otherwise may behave together
   * like an image.
   */
  canvas.DOMNode.on('dragstart', function (e) {
    e.preventDefault();
  });

  /**
   *
   * Action box events
   *
   */

  /**
   * @description click event of the button Reset canvas.
   */
  canvasActionBox.DOMNodeCanvasReset.click(function() {
    if (canvas.isActive){
      modal.open('canvasReset', 'yesNo')
      .then(
        answer_yes => {if (answer_yes) canvas.reset();});
    }
  });

  /**
   * @description click event of the button Save canvas.
   */
  canvasActionBox.DOMNodeCanvasSave.click( function(){
    if (canvas.isActive){
     modal.open('canvasSave', 'yesNo')
     .then(
       answer_yes => {if (answer_yes) canvas.save();});
    }
  });

  /**
   * @description click event of the button Export canvas.
   */
  canvasActionBox.DOMNodeCanvasExport.click( function(){
    //TODO: spinner
    if (canvas.isActive){
      modal.open('canvasExport', 'yesNo')
      .then(
        answer_yes => {if (answer_yes) canvas.export();});
    }
  });

  /**
   *
   * Toolbox events
   *
   */

  /**
   * @description click event of the tool Brush.
   */
  canvasToolBox.DOMNodeBrush.click(function() {
    canvasToolBox.drawingTool.set(TOOL_BRUSH);
  });

  /**
   * @description click event of the tool Eraser.
   */
  canvasToolBox.DOMNodeEraser.click(function() {
    canvasToolBox.drawingTool.set(TOOL_ERASER);
  });

  /**
   *
   * Back to top events
   *
   */

  /**
   * @description click event of the button Back to top.
   */
  sideBar.DOMNodeBtnBackToTop.click(function() {
    if (canvas.isActive){
     functions.scrollTo(functions.getNodePositionTop(CANVAS_TOOLBOX));
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

  /**
   * @description dialogopen event of the modal.
   * Sets the visibility of the sidebar.
   */
  modal.DOMNode.on( 'dialogopen',
    function( ) {
     setSideBarVisibility();
    }
  );

  /**
   * @description dialogclose event of the modal.
   * Sets the visibility of the sidebar.
   */
  modal.DOMNode.on( 'dialogclose',
    function( ) {
     setSideBarVisibility();
    }
  );

  /**
   * @description change event of the modal when start up message shown.
   */
  modal.DOMNode.on ('change', '#dialog-start-up-hide',
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
        modal.open('localStorageError', 'OK', {'messageArgs': {'errorMessage': e.message}});
      }
    }
  );

  /**
   *
   * Help events
   *
   */

  /**
   * @description click event of the button Help
   */
  sideBar.DOMNodeBtnHelp.click(function() {
    modal.open('help', 'OK', {'button1Label': MODAL_HELP_BUTTON_TEXT});
  });
});