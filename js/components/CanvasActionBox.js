/**
 * @constructor
 * @description Creates a new Canvas Action Box object.
 *
 */
let CanvasActionBox = function(){
	this.DOMNode = $('#action-box');
	this.DOMNodeCanvasReset = $('#btn-reset-canvas');
	this.DOMNodeCanvasSave = $('#btn-save-canvas');
	this.DOMNodeCanvasExport = $('#btn-export-canvas');
};

/**
 * @description Shows or hides the action box.
 *
 * @param {Boolean} visible tells whether the action box should be shown or hidden.
 */
CanvasActionBox.prototype.setVisibility = function (visible) {
	if (visible) {
		this.DOMNode.removeClass('action-box-hidden');
	}
	else {
		this.DOMNode.addClass('action-box-hidden');
	}
};

export { CanvasActionBox };