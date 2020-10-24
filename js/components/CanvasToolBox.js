import { TOOL_BRUSH, DEFAULT_PICKER_COLOR } from '../constants.js';
import { functions } from '../functions.js';

import { DrawingTool } from './DrawingTool.js';

/**
 * @constructor
 * @description Creates a new Canvas Toolbox object.
 *
 */
let CanvasToolBox = function(){
	this.DOMNode = $('#tool-box');
	this.DOMNodeColorPicker = $('#color-picker');
	this.DOMNodeBrush = $('#btn-tool-brush');
	this.DOMNodeEraser = $('#btn-tool-eraser');
	this.drawingTool = new DrawingTool();

	this.initColorPicker(DEFAULT_PICKER_COLOR);
};

/**
 * @description Shows or hides the tool box.
 *
 * @param  {Boolean} visible tells whether the tool box should be shown or hidden.
 */
CanvasToolBox.prototype.setVisibility = function (visible) {
	if (visible) {
		this.DOMNode.removeClass('tool-box-hidden');
	}
	else {
		this.DOMNode.addClass('tool-box-hidden');
	}
};

/**
 * @description Initializes the color picker.
 *
 * @param  {String} inputColor Hexadecimal value of the color to be set.
 */
CanvasToolBox.prototype.initColorPicker = function (inputColor) {

	this.drawingTool.color = inputColor;

	$('#color-picker').spectrum({
	    color: inputColor,
	    replacerClassName: 'btn-color-picker',
			change: function(color) {
        this.drawingTool.color = color.toHexString();
        this.drawingTool.set(TOOL_BRUSH);
    }.bind(this)
	});
};

/**
 * @description Calculates the top position of the Tool box.
 *
 * @returns {Number} top position of the tool box.
 */
CanvasToolBox.prototype.getPositionTop = function () {
  const TOOL_BOX_MARGIN_TOP = functions.CSSPixelToNumber(this.DOMNode.css('marginTop'));
  const TOOL_BOX_POSITION_TOP = this.DOMNode.position().top + TOOL_BOX_MARGIN_TOP;
  return TOOL_BOX_POSITION_TOP;
};

export { CanvasToolBox };