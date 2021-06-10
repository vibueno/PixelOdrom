/* In this file we use the expression pixelOdrom pixels to refer of the squares in the table (canvas).
We do so to avoid confusion with CSS pixels */

/**
 *
 * Constants
 *
 */

const PIXEL_CANVAS_SEL = '#pixel-canvas';

const TOOL_BRUSH = 'paint-brush';
const TOOL_ERASER = 'eraser';

const BLANK_PIXEL_COLOR = '#fff';
const DEFAULT_PICKER_COLOR = '#000';

const CANVAS_ASPECT_RATIO = 1.5;

/* Since canvas can be resized and we are using % for the sizes,
these pixel limits are only used for calculating the % of the main
div that the canvas will take, so that pixels don't get too big or too small */

const MIN_PIXEL_SIZE = 10; //in CSS pixels
const MAX_PIXEL_SIZE = 15; //in CSS pixels

const MAX_CANVAS_WIDTH_PO = 100; //in pixelOdrom pixels

const PIXEL_PADDING_CORRECTION = 0.1;

const CURSOR_COLOR = '#888888';

const ROW = '<tr></tr>';
const COLUMN = '<td class="pixel"></td>';

/**
 *
 * Dialog constants
 *
 */

const TOOL_BRUSH_HTML = '<i class="fa fa-paint-brush"></i>';
const TOOL_ERASER_HTML = '<i class="fa fa-eraser"></i>';
const CREATE_CANVAS_HTML = '<i class="fa fa-th"></i>';
const SAVE_CANVAS_HTML = '<i class="fa fa-floppy-o"></i>';
const EXPORT_CANVAS_HTML = '<i class="fa fa-image"></i>';
const OPEN_CANVAS_HTML = '<i class="fa fa-folder-open"></i>';

const DIALOG_HELP_TITLE = 'pixelOdrom help';

const DIALOG_HELP_TEXT = `<p class = "dialog-text-intro">pixelOdrom is a web tool for drawing pixel art.</p>
<ul class="dialog-list">
	<li class="dialog-list-element">Create a new canvas &nbsp;${CREATE_CANVAS_HTML} or open an existing one &nbsp;${OPEN_CANVAS_HTML}</li>
	<li class="dialog-list-element">Choose a color with the picker and use the &nbsp;${TOOL_BRUSH_HTML} for painting pixels.
	<p class="dialog-list-text-below">If you are using a mouse, you can also draw pixel lines.</p></li>
	<li class="dialog-list-element">By using the &nbsp;${TOOL_ERASER_HTML}, you can erase pixels.
	<p class="dialog-list-text-below">If you are using a mouse, you can also erase multiple pixels in one stroke</p></li>
	<li class="dialog-list-element">Click on &nbsp;${SAVE_CANVAS_HTML} to save your canvas to a local pixelOdrom file (*.pix) to continue your work later (note that every time you save the canvas, a new file will be created)</li>
	<li class="dialog-list-element">Click on &nbsp;${EXPORT_CANVAS_HTML} to export your canvas as an image</li>
</ul>`;

const DIALOG_START_UP_TITLE = 'Welcome to pixelOdrom';

const DIALOG_START_UP_TEXT =
  DIALOG_HELP_TEXT +
  `<p>
	<input type="checkbox" id="dialog-start-up-hide">
	<label for="dialog-start-up-hide">I am already a pixelOdrom master. Don't show this again!</label>
</p>
`;

const DIALOG_CONFIRM_EXPORT_TEXT = `<p class = "dialog-text">You are about to save your pixel art to an image file.</p>
<p class = "dialog-text">Depending on your browser configuration, the picture may start to download automatically and be saved into your download directory.</p>
<p class = "dialog-text">If your canvas is big, this process may take a couple of seconds to complete.</p>
<p class = "dialog-text">Would you like to export this canvas now?</p>`;

const DIALOG_CONFIRM_TITLE = 'Confirm';
const DIALOG_ERROR_TITLE = 'Error';

/**
 *
 * Globals
 *
 */

let gbMouseIsDown = false;
let gbSelectedTool = TOOL_BRUSH;

let gbSelectedColor = DEFAULT_PICKER_COLOR;

let gbCanvas;

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
 * @description Creates a delay that can be used in a promise chain.
 * @param  {Number} duration amount of time the delay will run.
 *
 * @returns {Object} Promise
 */
function delay(duration) {
  return new Promise(function(resolve) {
    setTimeout(resolve, duration);
  });
}

/**
 * @description Converts a css value to Number.
 * @param  {String} CSSValue value to be converted.
 *
 * @returns {Number} converted value
 */
function CSSPixelToNumber(CSSValue) {
  return parseInt(CSSValue.replace('px', ''));
}

/**
 * @description Sets value of global variables
 */
function setGlobals() {
  gbCurrentCanvasWidthPO = parseInt($('#input-width').val());
  gbCurrentCanvasHeightPO = parseInt($('#input-height').val());

  gbMainWidthPx = parseInt($('.main').width());

  gbCurrentCanvasMaxWidthPO = Math.min(
    Math.floor(gbMainWidthPx / MIN_PIXEL_SIZE),
    MAX_CANVAS_WIDTH_PO
  );
  gbCurrentCanvasMaxHeightPO = Math.floor(
    gbCurrentCanvasMaxWidthPO * CANVAS_ASPECT_RATIO
  );

  gbCanvas = $(PIXEL_CANVAS_SEL);
}

/**
 * @description Navigates to an empty page with no canvas.
 */
function goToHomePage() {
  if (isCanvasActive()) {
    showConfirmDialog(
      DIALOG_CONFIRM_TITLE,
      'Leaving the page will reset the canvas. Do you want to proceed?',
      false,
      setUpPixelOdrom
    );
  } else {
    setUpPixelOdrom();
  }
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
  showCanvas(false);
}

/**
 *
 * Spinner
 *
 */

/* It is used to tell the user the system is working on something
 It is a full screen div, since we need to move the canvas
 to the top-left corner before exporting it to an image
 and we want to hide this to the user */

/**
 * @description Shows the spinner.
 */
function showSpin() {
  //a promise is needed to stop async execution
  return new Promise(resolve => {
    $('#spinner-container').removeClass('spinner-container-hidden');

    $('#spinner-container').addClass('spinner-container');

    $('body').css('overflow', 'hidden');

    setBtnSidebarVisibility();

    resolve('Spin shown');
  });
}

/**
 * @description Hides the spinner.
 */
function hideSpin() {
  //a promise is needed to stop async execution
  return new Promise(resolve => {
    $('#spinner-container').addClass('spinner-container-hidden');
    $('#spinner-container').removeClass('spinner-container');

    $('body').css('overflow', 'auto');

    setBtnSidebarVisibility();

    resolve('Spin hidden');
  });
}

/**
 * description Checks whether the spinner is being used.
 */
function isSpinnerActive() {
  return $('#spinner-container').hasClass('spinner-container');
}

/**
 *
 * Dialogs
 *
 */

/**
 * @description Shows the start-up dialog
 *
 */
function showStartUpDialog() {
  $('#dialog').attr('title', DIALOG_START_UP_TITLE);

  $('#dialog')
    .first('p')
    .html(DIALOG_START_UP_TEXT);

  $('#dialog').dialog({
    modal: true,
    buttons: {
      'Get started!': function() {
        $(this).dialog('close');
      },
    },
    resizable: false,
  });
}

/**
 * @description Opens the help dialog.
 */
function showHelpDialog() {
  $('#dialog').attr('title', DIALOG_HELP_TITLE);

  $('#dialog')
    .first('p')
    .html(DIALOG_HELP_TEXT);

  $('#dialog')
    .dialog({
      modal: true,
      buttons: {
        'Alright!': function() {
          $(this).dialog('close');
        },
      },
      resizable: false,
    })
    .parent()
    .removeClass('ui-state-error');
}

/**
 * @description Opens the confirm dialog.
 *
 * @param  {String} dialogTitle    Text for the title of the dialog.
 * @param  {String} dialogContent  Text for the content of the dialog.
 * @param  {Boolean} isHTMLcontent Tells whether the content of the dialog is HTML.
 * @param  {String} callback       Callback function.
 * @param  {Array} callbackParams  Parameters for the callback function.
 */
function showConfirmDialog(
  dialogTitle,
  dialogContent,
  isHTMLcontent,
  callback,
  callbackParams
) {
  $('#dialog').attr('title', dialogTitle);

  if (isHTMLcontent) {
    $('#dialog')
      .first('p')
      .html(dialogContent);
  } else {
    $('#dialog')
      .first('p')
      .text(dialogContent);
  }

  $('#dialog')
    .dialog({
      modal: true,
      buttons: {
        Yes: function() {
          $(this).dialog('close');
          callback(callbackParams);
        },
        No: function() {
          $(this).dialog('close');
        },
      },
      resizable: false,
    })
    .parent()
    .removeClass('ui-state-error');
}

/**
 * @description Opens the information dialog.
 *
 * @param  {String} dialogTitle    Text for the title of the dialog.
 * @param  {String} dialogContent  Text for the content of the dialog.
 * @param  {Boolean} isHTMLcontent Tells whether the content of the dialog is HTML.
 */
function showInfoDialog(dialogTitle, dialogContent, isHTMLcontent) {
  $('#dialog').attr('title', dialogTitle);

  if (isHTMLcontent) {
    $('#dialog')
      .first('p')
      .html(dialogContent);
  } else {
    $('#dialog')
      .first('p')
      .text(dialogContent);
  }

  $('#dialog')
    .dialog({
      modal: true,
      buttons: {
        OK: function() {
          $(this).dialog('close');
        },
      },
      resizable: false,
    })
    .parent()
    .removeClass('ui-state-error');
}

/**
 * @description Opens the error dialog.
 *
 * @param  {String} dialogTitle    Text for the title of the dialog.
 * @param  {String} dialogContent  Text for the content of the dialog.
 * @param  {Boolean} isHTMLcontent Tells whether the content of the dialog is HTML.
 */
function showErrorDialog(dialogTitle, dialogContent, isHTMLcontent) {
  $('#dialog').attr('title', dialogTitle);

  if (isHTMLcontent) {
    $('#dialog')
      .first('p')
      .html(dialogContent);
  } else {
    $('#dialog')
      .first('p')
      .text(dialogContent);
  }

  $('#dialog')
    .dialog({
      modal: true,
      buttons: {
        OK: function() {
          $(this).dialog('close');
        },
      },
      resizable: false,
    })
    .parent()
    .addClass('ui-state-error');
}

/**
 * @description Opens the open file dialog (not a jQuery UI Dialog).
 */
function showFileDialog() {
  /* We need to trigger this event manually, since we are using
	a button to activate a hidden input file field */

  $('#btn-load-canvas-input').trigger('click');
}

/**
 * @description Checks whether the jQuery UI Dialog is open.
 *
 * @returns {Boolean}
 */
function isDialogOpen() {
  /* We check first whether the dialog has been initialized
	https://stackoverflow.com/questions/15763909/jquery-ui-dialog-check-if-exists-by-instance-method */

  if ($('#dialog').hasClass('ui-dialog-content')) {
    if ($('#dialog').dialog('isOpen')) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
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
  $('#inputWidth').val($('#input-width').prop('defaultValue'));
  $('#inputHeight').val($('#input-height').prop('defaultValue'));

  InitializeColorPicker(DEFAULT_PICKER_COLOR);
}

/**
 * @description Sets the value of the input fields
 *
 * @param  {Number} canvasWidth canvas width to be set to the input field.
 * @param  {Number} canvasHeight canvas height to be set to the input field.
 */
function setInputFieldValues(canvasWidth, canvasHeight) {
  $('#input-width').val(canvasWidth);
  $('#input-height').val(canvasHeight);
}

/**
 * @description Initializes the color picker.
 *
 * @param  {String} inputColor Hexadecimal value of the color to be set.
 */
function InitializeColorPicker(inputColor) {
  gbSelectedColor = inputColor;

  $('#color-picker').spectrum({
    color: inputColor,
    replacerClassName: 'btn-color-picker',
    change: function(color) {
      gbSelectedColor = color.toHexString();
      selectTool(TOOL_BRUSH);
    },
  });
}

/**
 *
 * Toolbox
 *
 */

/**
 * @description Calculates the top position of the Tool box.
 *
 * @returns {Number} top position of the tool box.
 */
function getToolboxPositionTop() {
  const TOOL_BOX_MARGIN_TOP = CSSPixelToNumber($('#tool-box').css('marginTop'));
  const TOOL_BOX_POSITION_TOP =
    $('#tool-box').position().top + TOOL_BOX_MARGIN_TOP;
  return TOOL_BOX_POSITION_TOP;
}

/**
 * @description Scrolls to the top of the toolbox
 */
function scrollToToolboxTop() {
  scroll(0, getToolboxPositionTop());
}

/**
 *
 * Canvas
 *
 */

/**
 * @description Toggles the canvas.
 *
 * @param  {Boolean} show tells whether the canvas should be shown.
 */
function showCanvas(show) {
  if (show) {
    gbCanvas.removeClass('pixel-canvas-hidden');
    gbCanvas.addClass('pixel-canvas');
  } else {
    gbCanvas.addClass('pixel-canvas-hidden');
    gbCanvas.removeClass('pixel-canvas');
  }
}

/**
 * @description Prepares the canvas.
 * @param  {Number} canvasWidthPO canvas width in pixelOdrom pixels.
 * @param  {Number} canvasHeightPO canvas height in pixelOdrom pixels.
 */
function setUpCanvas(canvasWidthPO, canvasHeightPO) {
  let canvasCSSWidth;
  let pixelSize;

  let pixelBorderSize = $('.pixel').css('border-left-width');
  pixelBorderSize =
    typeof myVar === 'undefined' ? 0 : CSSPixelToNumber(pixelBorderSize);

  const TOTAL_BORDER_SIZE = pixelBorderSize * gbCurrentCanvasHeightPO;
  const MAX_CANVAS_WIDTH_PX = gbMainWidthPx - TOTAL_BORDER_SIZE;

  setGlobals();

  /* Here we calculate the % of the space available that we will use for the canvas,
	so that the pixels have a reasonable size.
	The side effects of not doing so would be:
	A too wide canvas and small amount of pixels results in too large pixels
	A too small canvas a large amount of pixels would result in too small pixels */

  for (let i = 100; i >= 1; i -= 1) {
    canvasCSSWidth = i;
    pixelSize = ((MAX_CANVAS_WIDTH_PX / 100) * i) / canvasWidthPO;

    if (((MAX_CANVAS_WIDTH_PX / 100) * i) / canvasWidthPO <= MAX_PIXEL_SIZE) {
      break;
    }
  }

  gbCanvas.css('width', canvasCSSWidth + '%');
  gbCurrentCanvasWidth = canvasCSSWidth;

  setInputFieldValues(canvasWidthPO, canvasHeightPO);

  setGlobals();

  setUpPixel(MAX_CANVAS_WIDTH_PX);

  showToolbox(true);
  showActionbox(true);
  selectTool(TOOL_BRUSH);
  showCanvas(true);
}

/**
 * @description Set ups the pixelOdrom pixels in the canvas.
 *
 * @param  {Number} maxCanvasWidthPx maximal width of the canvas in CSS pixels.
 */
function setUpPixel(maxCanvasWidthPx) {
  const MAX_CANVAS_WIDTH_PERCENT = (maxCanvasWidthPx / gbMainWidthPx) * 100;

  let pixelWidth = MAX_CANVAS_WIDTH_PERCENT / gbCurrentCanvasWidthPO;

  let padding = pixelWidth;
  padding = padding - padding * PIXEL_PADDING_CORRECTION;

  gbCanvas.find('.pixel').width(pixelWidth + '%');
  gbCanvas.find('.pixel').css('padding-bottom', padding + '%');
}

/**
 * @description Checks whether the canvas can be created.
 *
 * @param  {Array} canvasSize Width and height of the canvas.
 */
function createCanvasCheck(canvasSize) {
  setGlobals();

  const CANVAS_WIDTH = canvasSize[0];
  const CANVAS_HEIGHT = canvasSize[1];

  const MAX_CANVAS_PIXEL = [
    gbCurrentCanvasMaxWidthPO,
    gbCurrentCanvasMaxHeightPO,
  ];

  if (
    CANVAS_WIDTH > gbCurrentCanvasMaxWidthPO ||
    CANVAS_HEIGHT > gbCurrentCanvasMaxHeightPO
  ) {
    showCanvas(true);
    showConfirmDialog(
      'Canvas too big',
      `The dimensions selected exceed the available space.
			Would you like to create the biggest possible canvas (width: ${gbCurrentCanvasMaxWidthPO}, height: ${gbCurrentCanvasMaxHeightPO})?`,
      false,
      createCanvasWrapper,
      MAX_CANVAS_PIXEL
    );
  } else {
    createCanvasWrapper(canvasSize);
  }
}

/**
 * @description Creates the canvas.
 *
 * @param  {Array} canvasSize Width and height of the canvas.
 * @param  {Boolean} scrollToCanvas tells whether to navigate to the canvas after creation.
 */
function createCanvas(canvasSize, scrollToCanvas = true) {
  return new Promise(resolve => {
    const CANVAS_WIDTH = canvasSize[0];
    const CANVAS_HEIGHT = canvasSize[1];

    deleteCanvas();

    for (let i = 1; i <= CANVAS_HEIGHT; i++) {
      gbCanvas.append(ROW);
      let lastRow = $(PIXEL_CANVAS_SEL + ' tr').last();

      for (let j = 1; j <= CANVAS_WIDTH; j++) {
        lastRow.append(COLUMN);
      }
    }

    setUpCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    if (scrollToCanvas) {
      scroll(0, getToolboxPositionTop());
    }

    resolve('Canvas created');
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

  if (canvasSize[0] * canvasSize[1] > 1000) {
    showSpin()
      .then(delay.bind(1000))
      .then(createCanvas.bind(null, canvasSize))
      .then(hideSpin);
  } else {
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
  const PROPORTION = widthPO / heightPO;

  if (
    PROPORTION >= CANVAS_ASPECT_RATIO / 4 &&
    PROPORTION <= CANVAS_ASPECT_RATIO
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * @description Deletes the canvas from the DOM.
 */
function deleteCanvas() {
  const CANVAS_ROWS = $(PIXEL_CANVAS_SEL + ' tr');

  CANVAS_ROWS.remove();
  showCanvas(false);
}

/**
 * @description Resets all pixels to their initial color.
 */
function resetCanvas() {
  gbCanvas.find('.pixel').css('background-color', BLANK_PIXEL_COLOR);
  scrollToToolboxTop();
}

/**
 * @description Saves the canvas to a .*pix file.
 */
function saveCanvas() {
  //We need to clone the canvas, so that we don"t modify the DOM
  const CANVAS_TO_SAVE = gbCanvas.clone();

  //removing styles since they should be calculated when loading
  CANVAS_TO_SAVE.find('.pixel').css('width', '');
  CANVAS_TO_SAVE.find('.pixel').css('padding-bottom', '');

  const canvasContent = CANVAS_TO_SAVE.html();

  const blob = new Blob([canvasContent], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'canvas.pix');
}

/**
 * @description Exports the canvas to an image file.
 *
 * @returns {Object} Promise
 */
function exportCanvas() {
  return new Promise(resolve => {
    /*
		 In order to make it easier for html2canvas,
		 we move the pixel table to the left corner of the browser
		*/

    $(PIXEL_CANVAS_SEL).addClass('pixel-canvas-export');
    $(PIXEL_CANVAS_SEL).removeClass('pixel-canvas');

    html2canvas(document.querySelector('#pixel-canvas'), {
      x: $('#pixel-canvas').left,
      y: $('#pixel-canvas').top,
    }).then(canvas => {
      //Saves canvas to client
      saveAs(canvas.toDataURL(), 'pixelOdrom.png');

      //Moving the pixel table back to its original position
      $(PIXEL_CANVAS_SEL).removeClass('pixel-canvas-export');
      $(PIXEL_CANVAS_SEL).addClass('pixel-canvas');

      resolve('Exported canvas');
    });
  });
}

/**
 * @description Wrapper for the export function.
 */
function exportCanvasWrapper() {
  /* It calls the functions sequentially by using promises
  This is needed for showing the spinner for the amount time
  pixelOdrom needs to export the canvas */

  showSpin()
    .then(exportCanvas)
    .then(hideSpin);
}

/**
 * @description Checks if the file to be imported contains a valid canvas.
 *
 * @returns {Boolean}
 */
function isValidCanvas(canvas) {
  let canvasCheck;

  if (canvas.length > 0) {
    canvasCheck = canvas.filter('tr').get(0);

    if (canvasCheck === canvas.get(0)) {
      return true;
    } else {
      return false;
    }
  } else {
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
      let canvasToImport = $(readerResult);

      if (!isValidCanvas(canvasToImport)) {
        showInfoDialog(
          'Wrong format',
          'The selected file does not contain a valid canvas.',
          false
        );
      } else {
        setGlobals();

        const CANVAS_WIDTH = canvasToImport.first().find('.pixel').length;
        const CANVAS_HEIGHT = canvasToImport.length;

        if (
          CANVAS_WIDTH > gbCurrentCanvasMaxWidthPO ||
          CANVAS_HEIGHT > gbCurrentCanvasMaxHeightPO
        ) {
          const DIALOG_MSG = `The selected canvas is too big for the available space.
						If you created this canvas on another device, please make sure you use a similar one
						to edit it.`;

          showInfoDialog('Canvas too big', DIALOG_MSG, false);
        } else {
          gbCanvas.html(reader.result);
          $('#input-width').val(CANVAS_WIDTH);
          $('#input-height').val(CANVAS_HEIGHT);

          setUpCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
          scrollToToolboxTop();
        }
      }
    } catch (e) {
      let shortErrorMessage =
        e.message.length > 500
          ? e.message.substring(0, 499) + '...'
          : e.message;

      showErrorDialog(
        DIALOG_ERROR_TITLE,
        `There was an error while trying to load the canvas: ${shortErrorMessage}`,
        false
      );
    }
  };

  reader.onerror = function() {
    showErrorDialog(
      DIALOG_ERROR_TITLE,
      `There was an error while trying to load the canvas: ${reader.error}`,
      false
    );
  };

  /* This call is needed in order to make the even onchange fire every time,
  even if the users selects the same file again */

  $('#btn-load-canvas-input').prop('value', '');
}

/**
 * @description Checks whether there is an active canvas.
 */
function isCanvasActive() {
  return $(PIXEL_CANVAS_SEL + ' tr').length;
}

/**
 * @description Paints or erases a pixel.
 *
 * @param  {[jQuery Selector]} pixel pixelOdrom pixel to be painted or erased.
 */
function paintPixel(pixel) {
  if (gbSelectedTool == TOOL_BRUSH) {
    $(pixel).css('background-color', gbSelectedColor);
  } else {
    $(pixel).css('background-color', BLANK_PIXEL_COLOR);
  }
}

/**
 *
 * Toolbox
 *
 */

/**
 * @description Changes the active tool.
 *
 * @param  {String} tool tool to be set as active.
 */
function selectTool(tool) {
  gbSelectedTool = tool;

  switch (gbSelectedTool) {
    case TOOL_BRUSH:
      $('#btn-tool-eraser').removeClass('btn-pressed');
      $('#btn-tool-brush').addClass('btn-pressed');
      break;
    case TOOL_ERASER:
      $('#btn-tool-brush').removeClass('btn-pressed');
      $('#btn-tool-eraser').addClass('btn-pressed');
      break;
  }
}

/**
 * @description Toggles the tool box.
 *
 * @param  {Boolean} show tells whether the tool box should be shown or hidden.
 */
function showToolbox(show) {
  if (show) {
    $('#tool-box').removeClass('tool-box-hidden');
  } else {
    $('#tool-box').addClass('tool-box-hidden');
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
    $('#action-box').removeClass('action-box-hidden');
  } else {
    $('#action-box').addClass('action-box-hidden');
  }
}

/**
 * @description Functionality of the reset canvas button.
 */
function btnResetCanvasClick() {
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
  if (
    $(window).height() + $(window).scrollTop() >=
      $('body').outerHeight() / 1.25 &&
    getToolboxPositionTop() <= $(window).scrollTop() &&
    isCanvasActive() &&
    !isDialogOpen() && !isSpinnerActive()
  ) {
    window.setTimeout(function() {
      $('#btn-back-to-top').removeClass('btn-back-to-top-hidden');
      $('#btn-back-to-top').addClass('btn-back-to-top-visible');
    }, 100);
  } else {
    window.setTimeout(function() {
      $('#btn-back-to-top').removeClass('btn-back-to-top-visible');
      $('#btn-back-to-top').addClass('btn-back-to-top-hidden');
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
  if (!isDialogOpen() && !isSpinnerActive()) {
    window.setTimeout(function() {
      $('#btn-help').removeClass('btn-help-hidden');
      $('#btn-help').addClass('btn-help-visible');
    }, 100);
  } else {
    window.setTimeout(function() {
      $('#btn-help').removeClass('btn-help-visible');
      $('#btn-help').addClass('btn-help-hidden');
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
  $('#size-picker').submit(function(e) {
    const CANVAS_WIDTH = parseInt($('#input-width').val());
    const CANVAS_HEIGHT = parseInt($('#input-height').val());
    const CANVAS_SIZE = [CANVAS_WIDTH, CANVAS_HEIGHT];

    if (!canvasPropCorrect(CANVAS_HEIGHT, CANVAS_WIDTH)) {
      showInfoDialog(
        'Information',
        `The proportions selected are not allowed: the max. allowed aspect ratio is 1:${CANVAS_ASPECT_RATIO}.`,
        false
      );
    } else {
      const DIALOG_MSG = `Are you sure that you want to create a new ${CANVAS_WIDTH}x${CANVAS_HEIGHT} canvas?`;
      showConfirmDialog(
        DIALOG_CONFIRM_TITLE,
        DIALOG_MSG,
        false,
        createCanvasCheck,
        CANVAS_SIZE
      );
    }

    e.preventDefault();
  });

  /**
   * @description Shows the load canvas dialog
   */
  $('#btn-load-canvas').click(function() {
    const DIALOG_MSG =
      'Are you sure that you want to load a previously saved canvas?';
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
  $(PIXEL_CANVAS_SEL).on('mousedown', 'td', function() {
    gbMouseIsDown = true;
    paintPixel(this);
  });

  /**
   * @description Paints or erases pixels
   */
  $(PIXEL_CANVAS_SEL).on('mouseover', 'td', function() {
    if (gbMouseIsDown) {
      paintPixel(this);
    }
  });

  /**
   * @description Paints or erases pixels
   */
  $(PIXEL_CANVAS_SEL).on('mouseenter', function() {
    $(this).awesomeCursor(gbSelectedTool, {
      hotspot: [2, 15],
      color: CURSOR_COLOR,
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
  $(PIXEL_CANVAS_SEL).on('mouseleave', function() {
    $(this).css('cursor', '');

    let invisibleViv = $(
      'div[style="position: absolute; left: -9999px; top: -9999px;"]'
    );
    invisibleViv.remove();
  });

  /**
   * @description Updates global when mouse button released
   */

  /* In this case, we must use the document and not the canvas,
	because the user may release the mouse outside the canvas */
  $(document).on('mouseup', function() {
    gbMouseIsDown = false;
  });

  /**
   * @description Prevents dragging on painted pixels,
   * which otherwise may behave together like an image
   */
  $(PIXEL_CANVAS_SEL).on('dragstart', function(e) {
    e.preventDefault();
  });

  /**
   *
   * Action box events
   *
   */

  $('#btn-reset-canvas').click(function() {
    if (isCanvasActive()) {
      showConfirmDialog(
        DIALOG_CONFIRM_TITLE,
        'Are you sure that you want to reset this canvas?',
        false,
        btnResetCanvasClick
      );
    }
  });

  $('#btn-save-canvas').click(function() {
    if (isCanvasActive()) {
      showConfirmDialog(
        DIALOG_CONFIRM_TITLE,
        'Are you sure that you want to save this canvas?',
        false,
        saveCanvas
      );
    }
  });

  $('#btn-export-canvas').click(function() {
    if (isCanvasActive()) {
      showConfirmDialog(
        DIALOG_CONFIRM_TITLE,
        DIALOG_CONFIRM_EXPORT_TEXT,
        true,
        exportCanvasWrapper
      );
    }
  });

  /**
   *
   * Toolbox events
   *
   */

  $('#btn-tool-brush').click(function() {
    selectTool(TOOL_BRUSH);
  });

  $('#btn-tool-eraser').click(function() {
    selectTool(TOOL_ERASER);
  });

  /**
   *
   * Back to top events
   *
   */

  $('#btn-back-to-top').click(function() {
    if (isCanvasActive()) {
      scrollToToolboxTop();
    } else {
      scroll(0, 0);
    }
  });

  /**
   *
   * Dialog events
   *
   */

  $('#dialog').on('dialogopen', function() {
    setBtnSidebarVisibility();
  });

  $('#dialog').on('dialogclose', function() {
    setBtnSidebarVisibility();
  });

  $('#dialog').on('change', '#dialog-start-up-hide', function() {
    try {
      if ($('#dialog-not-show-again').is(':checked')) {
        localStorage.setItem('dialogStartUpHide', true);
      } else {
        localStorage.setItem('dialogStartUpHide', false);
      }
    } catch (e) {
      showErrorDialog(
        DIALOG_ERROR_TITLE,
        `There was an error trying to access the local storage: ${e.message}`,
        false
      );
    }
  });

  /**
   *
   * Help events
   *
   */

  $('#btn-help').click(function() {
    showHelpDialog();
  });

  /**
   *
   * Initial calls
   *
   */

  if (!localStorage.dialogStartUpHide) {
    showStartUpDialog();
  }

  setUpPixelOdrom();
  createCanvas(
    [
      $('#input-width').prop('defaultValue'),
      $('#input-height').prop('defaultValue'),
    ],
    false
  );
});
