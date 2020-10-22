/**
 * @module constants
 */

const PIXEL_CANVAS_SEL = "#pixel-canvas";

const TOOL_BRUSH = "paint-brush";
const TOOL_ERASER = "eraser";

const BLANK_PIXEL_COLOR = "#fff";
const DEFAULT_PICKER_COLOR = "#000";

const CANVAS_ASPECT_RATIO = 1.5;

/* Since canvas can be resized and we are using % for the sizes,
these pixel limits are only used for calculating the % of the main
div that the canvas will take, so that pixels don't get too big or too small */

const MIN_PIXEL_SIZE = 10; //in CSS pixels
const MAX_PIXEL_SIZE = 15; //in CSS pixels

const MAX_CANVAS_WIDTH_PO = 100; //in pixelOdrom pixels

const PIXEL_PADDING_CORRECTION = 0.1;

const CURSOR_COLOR = "#888888";

const ROW = "<tr></tr>";
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

const DIALOG_HELP_TEXT =  `<p class = "dialog-text-intro">pixelOdrom is a web tool for drawing pixel art.</p>
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

const DIALOG_START_UP_TEXT = DIALOG_HELP_TEXT + `<p>
	<input type="checkbox" id="dialog-start-up-hide">
	<label for="dialog-start-up-hide">I am already a pixelOdrom master. Don't show this again!</label>
</p>
`;

const DIALOG_CONFIRM_EXPORT_TEXT = `<p class = "dialog-text">You are about to save your pixel art to an image file.</p>
<p class = "dialog-text">Depending on your browser configuration, the picture may start to download automatically and be saved into your download directory.</p>
<p class = "dialog-text">If your canvas is big, this process may take a couple of seconds to complete.</p>
<p class = "dialog-text">Would you like to export this canvas now?</p>`;

const DIALOG_CONFIRM_TITLE = "Confirm";
const DIALOG_ERROR_TITLE = "Error";