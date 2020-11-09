/**
 * @module constants
 */

/* The constants in this module contain some prefixes in their names to make clearer
what they are used for:
- SEL: jQuery selector
- SEL_JS: vanilla js selector
- COLOR: contains a hexadecimal color code
- HTML: contains HTML code
- CAPTION: contains text to be shown on a button
- FILENAME: contains a file system filename
- NUM: represents a constant number
- TITLE & TEXT: contain text to be used on modals, although there may be exceptions */

/**
 *
 * General
 *
 */

const SEL_HEADER = '#header';
const SEL_MAIN = '.main';

const COLOR_CURSOR = '#888888';
const DIV_INVISIBLE_CURSOR = 'div[style="position: absolute; left: -9999px; top: -9999px;"]';

/*
 *
 * Side bar
 *
 */

const SEL_SIDEBAR_HELP = '#btn-help';
const SEL_SIDEBAR_BACK_TO_TOP = '#btn-back-to-top';

/*
 *
 * Spinner
 *
 */

const SEL_SPINNER = '#spinner-container';

/**
 *
 * Canvas Menu
 *
 */

const SEL_FORM_CANVAS_MENU = '#size-picker';

const SEL_CANVAS_MENU_INPUT_WIDTH = '#input-width';
const SEL_CANVAS_MENU_INPUT_HEIGHT = '#input-height';

const SEL_CANVAS_MENU_CREATE_BTN = '#btn-create-canvas';
const SEL_CANVAS_MENU_BTN_LOAD = '#btn-load-canvas';

const SEL_BTN_INPUT_CANVAS_MENU_LOAD = '#btn-load-canvas-input';
const FILENAME_CANVAS_MENU_SAVE = 'canvas.pix';
const FILENAME_CANVAS_MENU_EXPORT = 'pixelOdrom.png';

/**
 *
 * Canvas Toolbox
 *
 */

const SEL_CANVAS_TOOLBOX = '#tool-box';
const SEL_COLOR_PICKER_CANVAS_TOOLBOX = '#color-picker';
const SEL_BTN_CANVAS_TOOLBOX_BRUSH = '#btn-tool-brush';
const SEL_BTN_CANVAS_TOOLBOX_ERASER = '#btn-tool-eraser';

const TOOL_BRUSH = 'paint-brush';
const TOOL_ERASER = 'eraser';

const COLOR_BLANK_PIXEL = '#fff';
const COLOR_PICKER_DEFAULT = '#000';

/**
 *
 * Canvas Action Box
 *
 */

const SEL_CANVAS_ACTION_BOX = '#action-box';
const SEL_BTN_RESET_CANVAS_ACTION_BOX = '#btn-reset-canvas';
const SEL_BTN_SAVE_CANVAS_ACTION_BOX = '#btn-save-canvas';
const SEL_BTN_EXPORT_CANVAS_ACTION_BOX = '#btn-export-canvas';

/**
 *
 * Canvas
 *
 */

const SEL_CANVAS = '#pixel-canvas';
const SEL_JS_CANVAS = 'pixel-canvas';

const SEL_PIXEL = '.pixel';

const NUM_CANVAS_ASPECT_RATIO = 1.5;

/* Since canvas can be resized and we are using % for the sizes,
these pixel limits are only used for calculating the % of the main
div that the canvas will take, so that pixels don't get too big or too small */

const NUM_CANVAS_MIN_PIXEL_SIZE = 10; //in CSS pixels
const NUM_CANVAS_MAX_PIXEL_SIZE = 15; //in CSS pixels

const NUM_CANVAS_DEFAULT_WIDTH = 10;
const NUM_CANVAS_DEFAULT_HEIGHT = 10;

const NUM_CANVAS_MAX_WIDTH_PO = 100; //in pixelOdrom pixels

const NUM_CANVAS_PIXEL_PADDING_CORRECTION = 0.1;

const HTML_CANVAS_ROW = '<tr></tr>';
const HTML_CANVAS_COLUMN = "<td class='pixel'></td>";

/**
 *
 * Modal
 *
 */

const SEL_MODAL = '#dialog';

const HTML_ICON_MODAL_CANVAS_CREATE = "<i class='fa fa-th'></i>";
const HTML_ICON_MODAL_CANVAS_OPEN = "<i class='fa fa-folder-open'></i>";

const HTML_ICON_MODAL_TOOL_BRUSH = "<i class='fa fa-paint-brush'></i>";
const HTML_ICON_MODAL_TOOL_ERASER = "<i class='fa fa-eraser'></i>";

const HTML_ICON_MODAL_CANVAS_SAVE = "<i class='fa fa-floppy-o'></i>";
const HTML_ICON_MODAL_CANVAS_EXPORT = "<i class='fa fa-image'></i>";

const HTML_TEXT_MODAL_HELP = `<p class = 'dialog-text-intro'>pixelOdrom is a web tool for drawing pixel art.</p>
  <ul class='dialog-list'>
  <li class='dialog-list-element'>Create a new canvas &nbsp;${HTML_ICON_MODAL_CANVAS_CREATE} or open an existing one &nbsp;${HTML_ICON_MODAL_CANVAS_OPEN}</li>
  <li class='dialog-list-element'>Choose a color with the picker and use the &nbsp;${HTML_ICON_MODAL_TOOL_BRUSH} for painting pixels.
  <p class='dialog-list-text-below'>If you are using a mouse, you can also draw pixel lines.</p></li>
  <li class='dialog-list-element'>By using the &nbsp;${HTML_ICON_MODAL_TOOL_ERASER}, you can erase pixels.
  <p class='dialog-list-text-below'>If you are using a mouse, you can also erase multiple pixels in one stroke</p></li>
  <li class='dialog-list-element'>Click on &nbsp;${HTML_ICON_MODAL_CANVAS_SAVE} to save your canvas to a local pixelOdrom file (*.pix) to continue your work later (note that every time you save the canvas, a new file will be created)</li>
  <li class='dialog-list-element'>Click on &nbsp;${HTML_ICON_MODAL_CANVAS_EXPORT} to export your canvas as an image</li>
  </ul>`;

const CAPTION_BTN_MODAL_HELP = 'Alright!';

const HTML_TEXT_MODAL_START_UP = HTML_TEXT_MODAL_HELP + `<p>
  <input type='checkbox' id='dialog-start-up-hide'>
  <label for='dialog-start-up-hide'>I am already a pixelOdrom master. Don't show this again!</label>
  </p>`;

const CAPTION_BTN_MODAL_START_UP = 'Get started!';

const TEXT_MODAL_PAGE_LEAVE = 'Leaving the page will reset the canvas. Do you want to proceed?';

/**
 *
 * Modal -> Canvas
 *
 */

const TITLE_MODAL_CANVAS_INVALID_RATIO = 'Invalid proportions';
const TEXT_MODAL_CANVAS_INVALID_RATIO = `The proportions selected are not allowed:
  the max. allowed aspect ratio is 1:${NUM_CANVAS_ASPECT_RATIO}.`;

/* This is a modal text template. You can pass arguments for completing this message
with the parameter args.messageArgs when calling 'open' on Modal */
const TEXT_MODAL_CANVAS_CREATE = 'Are you sure that you want to create a new ${canvasWidth}x${canvasHeight} canvas?';

const TITLE_MODAL_CANVAS_CREATE_NO_SPACE = 'Canvas too big';
const TEXT_MODAL_CANVAS_CREATE_NO_SPACE = `The selected canvas is too big for the available space.
  If you created this canvas on another device, please make sure you use a similar one
  to edit it.`;

const TEXT_MODAL_CANVAS_LOAD  = 'Are you sure that you want to load a previously saved canvas?';
const TEXT_MODAL_CANVAS_LOAD_ERROR  = 'There has been an error loading the specified canvas.';

const TITLE_MODAL_CANVAS_LOAD_NO_SPACE = 'Canvas too big';
const TEXT_MODAL_CANVAS_LOAD_NO_SPACE = `The selected canvas is too big for the available space.
  If you created this canvas on another device, please make sure you use a similar one
  to edit it.`;

const TEXT_MODAL_CANVAS_SAVE  = 'Are you sure that you want to save this canvas?';

const TEXT_MODAL_CANVAS_RESET  = 'Are you sure that you want to reset this canvas?';

const TEXT_MODAL_CANVAS_EXPORT = `<p class = 'dialog-text'>You are about to save your pixel art to an image file.</p>
  <p class = 'dialog-text'>Depending on your browser configuration, the picture may start to download automatically and be saved into your download directory.</p>
  <p class = 'dialog-text'>If your canvas is big, this process may take a couple of seconds to complete.</p>
  <p class = 'dialog-text'>Would you like to export this canvas now?</p>`;

const TITLE_MODAL_CANVAS_WRONG_FORMAT = 'Wrong format';
const TEXT_MODAL_CANVAS_WRONG_FORMAT = 'The selected file does not contain a valid canvas.';

const TEXT_MODAL_LOCAL_STORAGE_ERROR = 'There was an error trying to access the local storage: ${errorMessage}';

const TITLE_MODAL_CONFIRM = 'Confirm';

const TITLE_MODAL_ERROR = 'Error';

const MODAL_CONTENT = {
  help: {
    'title': 'pixelOdrom help',
    'text': HTML_TEXT_MODAL_HELP},
  startUp: {
    'title': 'Welcome to pixelOdrom',
    'text': HTML_TEXT_MODAL_START_UP},
  pageLeave: {
    'title': TITLE_MODAL_CONFIRM,
    'text': TEXT_MODAL_PAGE_LEAVE},
  canvasCreate: {
    'title': TITLE_MODAL_CONFIRM,
    'text': TEXT_MODAL_CANVAS_CREATE},
  canvasCreateNoSpace: {
    'title': TITLE_MODAL_CANVAS_CREATE_NO_SPACE,
    'text': TEXT_MODAL_CANVAS_CREATE_NO_SPACE},
  canvasInvalidProportions: {
    'title': TITLE_MODAL_CANVAS_INVALID_RATIO,
    'text': TEXT_MODAL_CANVAS_INVALID_RATIO},
  canvasLoad: {
    'title': TITLE_MODAL_CONFIRM,
    'text': TEXT_MODAL_CANVAS_LOAD},
  canvasLoadNoSpace: {
    'title': TITLE_MODAL_CANVAS_LOAD_NO_SPACE,
    'text': TEXT_MODAL_CANVAS_LOAD_NO_SPACE},
  canvasLoadError: {
    'title': TITLE_MODAL_ERROR,
    'text': TEXT_MODAL_CANVAS_LOAD_ERROR},
  canvasSave: {
    'title': TITLE_MODAL_CONFIRM,
    'text': TEXT_MODAL_CANVAS_SAVE},
  canvasReset: {
    'title': TITLE_MODAL_CONFIRM,
    'text': TEXT_MODAL_CANVAS_RESET},
  canvasExport: {
    'title': TITLE_MODAL_CONFIRM,
    'text': TEXT_MODAL_CANVAS_EXPORT},
  canvasWrongFormat: {
    'title': TITLE_MODAL_CANVAS_WRONG_FORMAT,
    'text': TEXT_MODAL_CANVAS_WRONG_FORMAT},
  localStorageError: {
    'title': TITLE_MODAL_ERROR,
    'text': TEXT_MODAL_LOCAL_STORAGE_ERROR},
  };

export {
  SEL_HEADER,
  SEL_MAIN,
  COLOR_CURSOR,
  DIV_INVISIBLE_CURSOR,
  SEL_SIDEBAR_HELP,
  SEL_SIDEBAR_BACK_TO_TOP,
  SEL_SPINNER,
  SEL_FORM_CANVAS_MENU,
  SEL_CANVAS_MENU_INPUT_WIDTH,
  SEL_CANVAS_MENU_INPUT_HEIGHT,
  SEL_CANVAS_MENU_CREATE_BTN,
  SEL_CANVAS_MENU_BTN_LOAD,
  SEL_BTN_INPUT_CANVAS_MENU_LOAD,
  FILENAME_CANVAS_MENU_SAVE,
  FILENAME_CANVAS_MENU_EXPORT,
  SEL_CANVAS_TOOLBOX,
  SEL_COLOR_PICKER_CANVAS_TOOLBOX,
  SEL_BTN_CANVAS_TOOLBOX_BRUSH,
  SEL_BTN_CANVAS_TOOLBOX_ERASER,
  TOOL_BRUSH,
  TOOL_ERASER,
  COLOR_BLANK_PIXEL,
  COLOR_PICKER_DEFAULT,
  SEL_CANVAS_ACTION_BOX,
  SEL_BTN_RESET_CANVAS_ACTION_BOX,
  SEL_BTN_SAVE_CANVAS_ACTION_BOX,
  SEL_BTN_EXPORT_CANVAS_ACTION_BOX,
  SEL_CANVAS,
  SEL_JS_CANVAS,
  SEL_PIXEL,
  NUM_CANVAS_ASPECT_RATIO,
  NUM_CANVAS_MIN_PIXEL_SIZE,
  NUM_CANVAS_MAX_PIXEL_SIZE,
  NUM_CANVAS_DEFAULT_WIDTH,
  NUM_CANVAS_DEFAULT_HEIGHT,
  NUM_CANVAS_MAX_WIDTH_PO,
  NUM_CANVAS_PIXEL_PADDING_CORRECTION,
  HTML_CANVAS_ROW,
  HTML_CANVAS_COLUMN,
  SEL_MODAL,
  MODAL_CONTENT,
  CAPTION_BTN_MODAL_HELP,
  CAPTION_BTN_MODAL_START_UP
};