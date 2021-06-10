/**
 * @module Canvas
 */

import {
  SEL_BTN_INPUT_CANVAS_MENU_LOAD,
  FILENAME_CANVAS_MENU_SAVE,
  FILENAME_CANVAS_MENU_EXPORT,
  COLOR_BLANK_PIXEL,
  SEL_CANVAS,
  SEL_JS_CANVAS,
  SEL_PIXEL,
  NUM_CANVAS_ASPECT_RATIO,
  NUM_CANVAS_MIN_PIXEL_SIZE,
  NUM_CANVAS_MAX_PIXEL_SIZE,
  NUM_CANVAS_MAX_WIDTH_PO,
  NUM_CANVAS_PIXEL_PADDING_CORRECTION,
  HTML_CANVAS_ROW,
  HTML_CANVAS_COLUMN,
} from '../constants.js';

import { functions } from '../functions.js';

import { CanvasCreateNoSpace, CanvasInvalidProportions } from './Error.js';

/**
 * @constructor
 * @description Creates a new Canvas object.
 *
 * @property {Object}  DOMNode     DOM object related to the canvas.
 * @property {Number}  width       Canvas width.
 * @property {Number}  height      Canvas height.
 * @property {Number}  maxWidthPx  Canvas maximal width in pixels.
 * @property {Number}  maxHeightPx Canvas maximal height in pixels.
 * @property {Boolean} isActive    tells whether the canvas is active.
 */
let Canvas = function(width, height) {
  this.DOMNode = $(SEL_CANVAS);
  this.width = width;
  this.height = height;
  this.maxWidthPx = Math.min(
    Math.floor(window.mainDivWidthPx / NUM_CANVAS_MIN_PIXEL_SIZE),
    NUM_CANVAS_MAX_WIDTH_PO
  );
  this.maxHeightPx = Math.floor(this.maxWidth * NUM_CANVAS_ASPECT_RATIO);
  this.isActive = false;
};

/**
 * @description Prepares the canvas.
 *
 */
Canvas.prototype.setUp = function() {
  let canvasCSSWidth;
  let pixelSize;

  let pixelBorderSize = $(SEL_PIXEL).css('border-left-width');
  pixelBorderSize =
    typeof myVar === 'undefined'
      ? 0
      : functions.CSSPixelToNumber(pixelBorderSize);

  const CANVAS_TOTAL_BORDER_SIZE = pixelBorderSize * this.height;
  const CANVAS_MAX_WIDTH_PX = window.mainDivWidthPx - CANVAS_TOTAL_BORDER_SIZE;

  /* Here we calculate the % of the space available that we will use for the canvas,
  so that the pixels have a reasonable size.
  The side effects of not doing so would be:
  A too wide canvas and small amount of pixels results in too large pixels
  A too small canvas a large amount of pixels would result in too small pixels */

  for (let i = 100; i >= 1; i -= 1) {
    canvasCSSWidth = i;
    pixelSize = ((CANVAS_MAX_WIDTH_PX / 100) * i) / this.width;

    if (
      ((CANVAS_MAX_WIDTH_PX / 100) * i) / this.width <=
      NUM_CANVAS_MAX_PIXEL_SIZE
    ) {
      break;
    }
  }

  this.DOMNode.css('width', canvasCSSWidth + '%');
  this.width = canvasCSSWidth;

  this.pixelSetUp(CANVAS_MAX_WIDTH_PX);

  this.setVisibility(true);
};

/**
 * @description Sets canvas visibility.
 * @param {Boolean} visible Indicates whether the Canvas should be shown or hidden.
 */
Canvas.prototype.setVisibility = function(visible) {
  if (visible) {
    this.DOMNode.removeClass('pixel-canvas-hidden');
    this.DOMNode.addClass('pixel-canvas');
    this.isActive = true;
  } else {
    this.DOMNode.addClass('pixel-canvas-hidden');
    this.DOMNode.removeClass('pixel-canvas');
    this.isActive = false;
  }
};

/**
 * @description Checks if the canvas width/height ratio is allowed.
 * @param  {Number} width  Width of the canvas in pixelOdrom pixels.
 * @param  {Number} height Height of the canvas in pixelOdrom pixels.
 */
Canvas.prototype.validProportions = function(width, height) {
  const PROPORTION = width / height;

  if (
    PROPORTION >= NUM_CANVAS_ASPECT_RATIO / 4 &&
    PROPORTION <= NUM_CANVAS_ASPECT_RATIO
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 * @description Creates the canvas.
 * @param  {Number}  width  Width of the canvas to be created.
 * @param  {Number}  height Height of the canvas to be created.
 */
Canvas.prototype.create = function(width, height) {
  return new Promise(resolve => {
    //Checks if the size of the canvas fits the available space
    if (width > this.maxWidth || height > this.maxHeight) {
      throw new CanvasCreateNoSpace();
    }

    if (!this.validProportions(width, height)) {
      throw new CanvasInvalidProportions();
    }

    this.delete();

    for (let i = 1; i <= height; i++) {
      this.DOMNode.append(HTML_CANVAS_ROW);
      let lastRow = $(SEL_CANVAS + ' tr').last();

      for (let j = 1; j <= width; j++) {
        lastRow.append(HTML_CANVAS_COLUMN);
      }
    }

    this.setUp(width, height);

    resolve(true);
  });
};

/**
 * @description Wrapper for the create function.
 * @param  {Number}  width  Width of the canvas to be created.
 * @param  {Number}  height Height of the canvas to be created.
 */
Canvas.prototype.createCanvasWrapper = function(width, height) {
  /* It calls the functions sequentially by using promises
  This is needed for showing the spinner for the amount time
  pixelOdrom needs to create the canvas

  We need the delay call, because otherwise the Spin is not shown */

  if (width * height > 1000) {
    window.spinner
      .show()
      .then(functions.delay.bind(1000))
      .then(this.create.bind(null, { width, height }))
      .then(window.spinner.hide());
  } else {
    window.canvas.create(width, height);
  }
};

/**
 * @description Set ups the pixels in the canvas.
 */
Canvas.prototype.pixelSetUp = function() {
  const CANVAS_MAX_WIDTH_PERCENT =
    (this.maxWidthPx / window.mainDivWidthPx) * 100;

  let pixelWidth = CANVAS_MAX_WIDTH_PERCENT / this.width;

  let padding = pixelWidth;
  padding = padding - padding * NUM_CANVAS_PIXEL_PADDING_CORRECTION;

  $(SEL_PIXEL).width(pixelWidth + '%');
  $(SEL_PIXEL).css('padding-bottom', padding + '%');
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
  $(SEL_PIXEL).css('background-color', COLOR_BLANK_PIXEL);
};

/**
 * @description Loads a canvas.
 * @param  {Object} input File object containing the canvas to be loaded.
 */
Canvas.prototype.load = function(input) {
  return new Promise((resolve, reject) => {
    const FILE = input.files[0];
    let reader = new FileReader();

    reader.readAsText(FILE);

    reader.onload = function() {
      let readerResult = reader.result;
      let canvasToImport = $(readerResult);

      if (!functions.isValidCanvas(canvasToImport)) {
        reject('CanvasWrongFormat');
      } else {
        const CANVAS_WIDTH = canvasToImport.first().find('.pixel').length;
        const CANVAS_HEIGHT = canvasToImport.length;

        if (CANVAS_WIDTH > this.maxWidth || CANVAS_HEIGHT > this.maxHeight) {
          reject('CanvasLoadNoSpace');
        } else {
          this.DOMNode.html(reader.result);
        }

        /* This call is needed in order to make the even onchange fires every time,
        even if the users selects the same file again */
        $(SEL_BTN_INPUT_CANVAS_MENU_LOAD).prop('value', '');

        resolve({
          width: document.getElementById(SEL_JS_CANVAS).rows[0].cells.length,
          height: $(SEL_CANVAS + ' tr').length,
        });
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
  CANVAS_TO_SAVE.find(SEL_PIXEL).css('width', '');
  CANVAS_TO_SAVE.find(SEL_PIXEL).css('padding-bottom', '');

  const canvasContent = CANVAS_TO_SAVE.html();

  const blob = new Blob([canvasContent], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, FILENAME_CANVAS_MENU_SAVE);
};

/**
 * @description Exports the canvas to an image file.
 *
 * @returns {Object} Promise
 */
Canvas.prototype.export = function() {
  return new Promise(resolve => {
    /* In order to make it easier for html2canvas,
    we move the pixel table to the left corner of the browser */
    this.DOMNode.addClass('pixel-canvas-export');
    this.DOMNode.removeClass('pixel-canvas');

    html2canvas(this.DOMNode[0], {
      x: this.DOMNode.left,
      y: this.DOMNode.top,
    }).then(canvas => {
      //Saves canvas to client
      saveAs(canvas.toDataURL(), FILENAME_CANVAS_MENU_EXPORT);

      //Moving the pixel table back to its original position
      this.DOMNode.removeClass('pixel-canvas-export');
      this.DOMNode.addClass('pixel-canvas');

      resolve(true);
    });
  });
};

/**
 * @description Wrapper for the export function.
 */
Canvas.prototype.exportCanvasWrapper = function() {
  /* It calls the functions sequentially by using promises
  This is needed for showing the spinner for the amount time
  pixelOdrom needs to export the canvas */

  window.spinner
    .show()
    .then(window.canvas.export())
    .then(window.spinner.hide());
};

export { Canvas };
