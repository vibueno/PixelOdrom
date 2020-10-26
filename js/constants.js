/**
 * @module constants
 */

/**
 *
 * General
 *
 */

const HEADER = '#header';
const MAIN = '.main';

const CURSOR_COLOR = '#888888';
const CURSOR_INVISIBLE_DIV = 'div[style="position: absolute; left: -9999px; top: -9999px;"]';

/*
 *
 * Side bar
 *
 */

const SIDEBAR_HELP = '#btn-help';
const SIDEBAR_BACK_TO_TOP = '#btn-back-to-top';

/*
 *
 * Spinner
 *
 */

const SPINNER = '#spinner-container';

/**
 *
 * Canvas Menu
 *
 */

const CANVAS_MENU_FORM = '#size-picker';

const CANVAS_MENU_INPUT_WIDTH = '#input-width';
const CANVAS_MENU_INPUT_HEIGHT = '#input-height';

const CANVAS_MENU_BTN_CREATE = '#btn-create-canvas';
const CANVAS_MENU_BTN_LOAD = '#btn-load-canvas';

const CANVAS_MENU_LOAD_INPUT = '#btn-load-canvas-input';
const CANVAS_MENU_SAVE_FILENAME = 'canvas.pix';
const CANVAS_MENU_EXPORT_FILENAME = 'pixelOdrom.png';

/**
 *
 * Canvas Toolbox
 *
 */

const CANVAS_TOOLBOX = '#tool-box';
const CANVAS_TOOLBOX_COLOR_PICKER = '#color-picker';
const CANVAS_TOOLBOX_BRUSH = '#btn-tool-brush';
const CANVAS_TOOLBOX_ERASER = '#btn-tool-eraser';

const TOOL_BRUSH = 'paint-brush';
const TOOL_ERASER = 'eraser';

const BLANK_PIXEL_COLOR = '#fff';
const DEFAULT_PICKER_COLOR = '#000';

/**
 *
 * Canvas Action Box
 *
 */

const CANVAS_ACTION_BOX = '#action-box';
const CANVAS_ACTION_BOX_RESET = '#btn-reset-canvas';
const CANVAS_ACTION_BOX_SAVE = '#btn-save-canvas';
const CANVAS_ACTION_BOX_EXPORT = '#btn-export-canvas';


/**
 *
 * Canvas
 *
 */


const CANVAS = '#pixel-canvas';
const PIXEL = '.pixel';



const CANVAS_ASPECT_RATIO = 1.5;

/* Since canvas can be resized and we are using % for the sizes,
these pixel limits are only used for calculating the % of the main
div that the canvas will take, so that pixels don't get too big or too small */

const CANVAS_MIN_PIXEL_SIZE = 10; //in CSS pixels
const CANVAS_MAX_PIXEL_SIZE = 15; //in CSS pixels

const CANVAS_DEFAULT_WIDTH = 10;
const CANVAS_DEFAULT_HEIGHT = 10;

const CANVAS_MAX_WIDTH_PO = 100; //in pixelOdrom pixels

const CANVAS_PIXEL_PADDING_CORRECTION = 0.1;

const CANVAS_ROW_HTML = '<tr></tr>';
const CANVAS_COLUMN_HTML = "<td class='pixel'></td>";

/**
 *
 * Modal
 *
 */

const MODAL = '#dialog';

const MODAL_CANVAS_CREATE_ICON_HTML = "<i class='fa fa-th'></i>";
const MODAL_CANVAS_OPEN_ICON_HTML = "<i class='fa fa-folder-open'></i>";

const MODAL_TOOL_BRUSH_ICON_HTML = "<i class='fa fa-paint-brush'></i>";
const MODAL_TOOL_ERASER_ICON_HTML = "<i class='fa fa-eraser'></i>";

const MODAL_CANVAS_SAVE_ICON_HTML = "<i class='fa fa-floppy-o'></i>";
const MODAL_CANVAS_EXPORT_ICON_HTML = "<i class='fa fa-image'></i>";

const MODAL_HELP_TEXT = `<p class = 'dialog-text-intro'>pixelOdrom is a web tool for drawing pixel art.</p>
  <ul class='dialog-list'>
  <li class='dialog-list-element'>Create a new canvas &nbsp;${MODAL_CANVAS_CREATE_ICON_HTML} or open an existing one &nbsp;${MODAL_CANVAS_OPEN_ICON_HTML}</li>
  <li class='dialog-list-element'>Choose a color with the picker and use the &nbsp;${MODAL_TOOL_BRUSH_ICON_HTML} for painting pixels.
  <p class='dialog-list-text-below'>If you are using a mouse, you can also draw pixel lines.</p></li>
  <li class='dialog-list-element'>By using the &nbsp;${MODAL_TOOL_ERASER_ICON_HTML}, you can erase pixels.
  <p class='dialog-list-text-below'>If you are using a mouse, you can also erase multiple pixels in one stroke</p></li>
  <li class='dialog-list-element'>Click on &nbsp;${MODAL_CANVAS_SAVE_ICON_HTML} to save your canvas to a local pixelOdrom file (*.pix) to continue your work later (note that every time you save the canvas, a new file will be created)</li>
  <li class='dialog-list-element'>Click on &nbsp;${MODAL_CANVAS_EXPORT_ICON_HTML} to export your canvas as an image</li>
  </ul>`;

const MODAL_HELP_BUTTON_TEXT = 'Alright!';

const MODAL_START_UP_TEXT = MODAL_HELP_TEXT + `<p>
  <input type='checkbox' id='dialog-start-up-hide'>
  <label for='dialog-start-up-hide'>I am already a pixelOdrom master. Don't show this again!</label>
  </p>`;

const MODAL_START_UP_BUTTON_TEXT = 'Get started!';

const MODAL_PAGE_LEAVE_TEXT = 'Leaving the page will reset the canvas. Do you want to proceed?';

/**
 *
 * Modal -> Canvas
 *
 */

const MODAL_CANVAS_NO_SPACE_TITLE = 'Canvas too big';

const MODAL_CANVAS_INVALID_PROP_TITLE = 'Invalid proportions';
const MODAL_CANVAS_INVALID_PROP_TEXT = `The proportions selected are not allowed:
  the max. allowed aspect ratio is 1:${CANVAS_ASPECT_RATIO}.`;

const MODAL_CANVAS_LOAD_TEXT  = 'Are you sure that you want to load a previously saved canvas?';

const MODAL_CANVAS_LOAD_ERROR_TEXT  = 'There has been an error loading the specified canvas.';

const MODAL_CANVAS_SAVE_TEXT  = 'Are you sure that you want to save this canvas?';

const MODAL_CANVAS_RESET_TEXT  = 'Are you sure that you want to reset this canvas?';

const MODAL_CANVAS_EXPORT_TEXT = `<p class = 'dialog-text'>You are about to save your pixel art to an image file.</p>
  <p class = 'dialog-text'>Depending on your browser configuration, the picture may start to download automatically and be saved into your download directory.</p>
  <p class = 'dialog-text'>If your canvas is big, this process may take a couple of seconds to complete.</p>
  <p class = 'dialog-text'>Would you like to export this canvas now?</p>`;

const MODAL_CANVAS_TOO_BIG_TITLE = 'Canvas too big';
const MODAL_CANVAS_TOO_BIG_TEXT = `The selected canvas is too big for the available space.
  If you created this canvas on another device, please make sure you use a similar one
  to edit it.`;

const MODAL_CANVAS_WRONG_FORMAT_TITLE = 'Wrong format';
const MODAL_CANVAS_WRONG_FORMAT_TEXT = 'The selected file does not contain a valid canvas.';

const MODAL_CONFIRM_TITLE = 'Confirm';

const MODAL_ERROR_TITLE = 'Error';

const MODAL_CONTENT = {
  help: {
    'title': 'pixelOdrom help',
    'text': MODAL_HELP_TEXT},
  startUp: {
    'title': 'Welcome to pixelOdrom',
    'text': MODAL_START_UP_TEXT},
  pageLeave: {
    'title': MODAL_CONFIRM_TITLE,
    'text': MODAL_PAGE_LEAVE_TEXT},
  canvasCreate: {
    'title': MODAL_CONFIRM_TITLE},
  canvasNoSpace: {
    'title': MODAL_CANVAS_NO_SPACE_TITLE},
  canvasInvalidProportions: {
    'title': MODAL_CANVAS_INVALID_PROP_TITLE,
    'text': MODAL_CANVAS_INVALID_PROP_TEXT},
  canvasLoad: {
    'title': MODAL_CONFIRM_TITLE,
    'text': MODAL_CANVAS_LOAD_TEXT},
  canvasLoadError: {
    'title': MODAL_ERROR_TITLE,
    'text': MODAL_CANVAS_LOAD_ERROR_TEXT},
  canvasSave: {
    'title': MODAL_CONFIRM_TITLE,
    'text': MODAL_CANVAS_SAVE_TEXT},
  canvasReset: {
    'title': MODAL_CONFIRM_TITLE,
    'text': MODAL_CANVAS_RESET_TEXT},
  canvasExport: {
    'title': MODAL_CONFIRM_TITLE,
    'text': MODAL_CANVAS_EXPORT_TEXT},
  canvasTooBig: {
    'title': MODAL_CANVAS_TOO_BIG_TITLE,
    'text': MODAL_CANVAS_TOO_BIG_TEXT},
  canvasWrongFormat: {
    'title': MODAL_CANVAS_WRONG_FORMAT_TITLE,
    'text': MODAL_CANVAS_WRONG_FORMAT_TEXT}
  };

export {
  HEADER,
  MAIN,
  CURSOR_COLOR,
  CURSOR_INVISIBLE_DIV,
  SIDEBAR_HELP,
  SIDEBAR_BACK_TO_TOP,
  SPINNER,
  CANVAS_MENU_FORM,
  CANVAS_MENU_INPUT_WIDTH,
  CANVAS_MENU_INPUT_HEIGHT,
  CANVAS_MENU_BTN_CREATE,
  CANVAS_MENU_BTN_LOAD,
  CANVAS_MENU_LOAD_INPUT,
  CANVAS_MENU_SAVE_FILENAME,
  CANVAS_MENU_EXPORT_FILENAME,
  CANVAS_TOOLBOX,
  CANVAS_TOOLBOX_COLOR_PICKER,
  CANVAS_TOOLBOX_BRUSH,
  CANVAS_TOOLBOX_ERASER,
  TOOL_BRUSH,
  TOOL_ERASER,
  BLANK_PIXEL_COLOR,
  DEFAULT_PICKER_COLOR,
  CANVAS_ACTION_BOX,
  CANVAS_ACTION_BOX_RESET,
  CANVAS_ACTION_BOX_SAVE,
  CANVAS_ACTION_BOX_EXPORT,
  CANVAS,
  PIXEL,
  CANVAS_ASPECT_RATIO,
  CANVAS_MIN_PIXEL_SIZE,
  CANVAS_MAX_PIXEL_SIZE,
  CANVAS_DEFAULT_WIDTH,
  CANVAS_DEFAULT_HEIGHT,
  CANVAS_MAX_WIDTH_PO,
  CANVAS_PIXEL_PADDING_CORRECTION,
  CANVAS_ROW_HTML,
  CANVAS_COLUMN_HTML,
  MODAL,
  MODAL_CONTENT,
  MODAL_HELP_BUTTON_TEXT,
  MODAL_START_UP_BUTTON_TEXT
};