/**
 * @module constants
 */

const CANVAS_SELECTOR = '#pixel-canvas';

const CANVAS_TOOLBOX_SELECTOR = $ ( '#tool-box' );

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

const CANVAS_DEFAULT_WIDTH = 10;
const CANVAS_DEFAULT_HEIGHT = 10;

const MAX_CANVAS_WIDTH_PO = 100; //in pixelOdrom pixels

const PIXEL_PADDING_CORRECTION = 0.1;

const CURSOR_COLOR = '#888888';

const ROW = '<tr></tr>';
const COLUMN = "<td class='pixel'></td>";

const TOOL_BRUSH_HTML = "<i class='fa fa-paint-brush'></i>";
const TOOL_ERASER_HTML = "<i class='fa fa-eraser'></i>";
const CREATE_CANVAS_HTML = "<i class='fa fa-th'></i>";
const SAVE_CANVAS_HTML = "<i class='fa fa-floppy-o'></i>";
const EXPORT_CANVAS_HTML = "<i class='fa fa-image'></i>";
const OPEN_CANVAS_HTML = "<i class='fa fa-folder-open'></i>";

/**
 *
 * Dialog constants
 *
 */

const MODAL_HELP_TEXT = `<p class = 'dialog-text-intro'>pixelOdrom is a web tool for drawing pixel art.</p>
	<ul class='dialog-list'>
	<li class='dialog-list-element'>Create a new canvas &nbsp;${CREATE_CANVAS_HTML} or open an existing one &nbsp;${OPEN_CANVAS_HTML}</li>
	<li class='dialog-list-element'>Choose a color with the picker and use the &nbsp;${TOOL_BRUSH_HTML} for painting pixels.
	<p class='dialog-list-text-below'>If you are using a mouse, you can also draw pixel lines.</p></li>
	<li class='dialog-list-element'>By using the &nbsp;${TOOL_ERASER_HTML}, you can erase pixels.
	<p class='dialog-list-text-below'>If you are using a mouse, you can also erase multiple pixels in one stroke</p></li>
	<li class='dialog-list-element'>Click on &nbsp;${SAVE_CANVAS_HTML} to save your canvas to a local pixelOdrom file (*.pix) to continue your work later (note that every time you save the canvas, a new file will be created)</li>
	<li class='dialog-list-element'>Click on &nbsp;${EXPORT_CANVAS_HTML} to export your canvas as an image</li>
	</ul>`;

const MODAL_START_UP_TEXT = MODAL_HELP_TEXT + `<p>
	<input type='checkbox' id='dialog-start-up-hide'>
	<label for='dialog-start-up-hide'>I am already a pixelOdrom master. Don't show this again!</label>
	</p>`;

const MODAL_PAGE_LEAVE_TEXT = 'Leaving the page will reset the canvas. Do you want to proceed?';

const MODAL_CANVAS_CREATE_NO_SPACE_TITLE = 'Canvas too big';

const MODAL_CANVAS_CREATE_PROPORTIONS_TITLE = 'Invalid proportions';

const MODAL_CANVAS_CREATE_PROPORTIONS_TEXT = `The proportions selected are not allowed:
	the max. allowed aspect ratio is 1:${CANVAS_ASPECT_RATIO}.`;

const MODAL_CANVAS_LOAD_TEXT  = 'Are you sure that you want to load a previously saved canvas?';

const MODAL_CANVAS_SAVE_TEXT  = 'Are you sure that you want to save this canvas?';

const MODAL_CANVAS_RESET_TEXT  = 'Are you sure that you want to reset this canvas?';

const MODAL_CANVAS_EXPORT_TEXT = `<p class = 'dialog-text'>You are about to save your pixel art to an image file.</p>
	<p class = 'dialog-text'>Depending on your browser configuration, the picture may start to download automatically and be saved into your download directory.</p>
	<p class = 'dialog-text'>If your canvas is big, this process may take a couple of seconds to complete.</p>
	<p class = 'dialog-text'>Would you like to export this canvas now?</p>`;

const MODAL_CANVAS_IMPORT_TITLE = 'Canvas too big';

const MODAL_CANVAS_IMPORT_TEXT = `The selected canvas is too big for the available space.
	If you created this canvas on another device, please make sure you use a similar one
	to edit it.`;

const MODAL_CANVAS_INVALID_TITLE = 'Wrong format';

const MODAL_CANVAS_INVALID_TEXT = 'The selected file does not contain a valid canvas.';

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
	canvasCreateNoSpace: {
		'title': MODAL_CANVAS_CREATE_NO_SPACE_TITLE},
	canvasProportions: {
		'title': MODAL_CANVAS_CREATE_PROPORTIONS_TITLE,
		'text': MODAL_CANVAS_CREATE_PROPORTIONS_TEXT},
	canvasLoad: {
		'title': MODAL_CONFIRM_TITLE,
		'text': MODAL_CANVAS_LOAD_TEXT},
	canvasSave: {
		'title': MODAL_CONFIRM_TITLE,
		'text': MODAL_CANVAS_SAVE_TEXT},
	canvasReset: {
		'title': MODAL_CONFIRM_TITLE,
		'text': MODAL_CANVAS_RESET_TEXT},
	canvasExport: {
		'title': MODAL_CONFIRM_TITLE,
		'text': MODAL_CANVAS_EXPORT_TEXT},
	canvasImport: {
		'title': MODAL_CANVAS_IMPORT_TITLE,
		'text': MODAL_CANVAS_IMPORT_TEXT},
	canvasImportInvalid: {
		'title': MODAL_CANVAS_INVALID_TITLE,
		'text': MODAL_CANVAS_INVALID_TEXT},
	info: {},
	error: {
		'title': MODAL_ERROR_TITLE}
	};

export {
	CANVAS_SELECTOR,
	CANVAS_TOOLBOX_SELECTOR,
	TOOL_BRUSH,
	TOOL_ERASER,
	BLANK_PIXEL_COLOR,
	DEFAULT_PICKER_COLOR,
	CANVAS_ASPECT_RATIO,
	MIN_PIXEL_SIZE,
	MAX_PIXEL_SIZE,
	CANVAS_DEFAULT_WIDTH,
	CANVAS_DEFAULT_HEIGHT,
	MAX_CANVAS_WIDTH_PO,
	PIXEL_PADDING_CORRECTION,
	CURSOR_COLOR,
	ROW,
	COLUMN,
	TOOL_BRUSH_HTML,
	TOOL_ERASER_HTML,
	CREATE_CANVAS_HTML,
	SAVE_CANVAS_HTML,
	EXPORT_CANVAS_HTML,
	OPEN_CANVAS_HTML,
	MODAL_CONTENT };