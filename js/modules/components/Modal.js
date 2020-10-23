import { MODAL_CONTENT } from '../constants.js';

/**
 * @constructor
 * @description Creates a new Modal object.
 *
 */
let Modal = function(){
	this.DOMNode = $( "#dialog" );
	this.DOMNodeText = $( "#dialog" ).first("p");
	this.title;
	this.buttons = null;
}

/**
 * @description Sets title text.
 *
 * @param {String} text text to be shown on the modal title bar.
 */
Modal.prototype.setTitle = function (title) {
	this.title = title;
};

/**
 * @description Sets modal text.
 *
 * @param {String} text text to be shown on the modal.
 * @param {String} isHTML indicates whether the text should be treated as HTML.
 */
Modal.prototype.setText = function (text, isHTML) {
	isHTML? this.DOMNodeText.html( text ): this.DOMNodeText.text( text );
};

/**
 * @description Opens the modal.
 *
 * @param {String} modalType indicates the type of modal to be shown.
 */
Modal.prototype.open = function (modalType, args) {

	if (args.title===undefined){
		this.setTitle(MODAL_CONTENT[modalType].title);
	}

	args.title===undefined?
		this.setTitle(MODAL_CONTENT[modalType].title):
		this.setTitle(args.title);

	args.text===undefined?
		this.setText(MODAL_CONTENT[modalType].text, true):
		this.setText(args.text);

	switch(modalType) {
	  case 'help':
	  	this.buttons = { "Alright!": function () { window.modal.DOMNode.dialog("close");}}
	    break;
	  case 'startUp':
			this.buttons = {"Get started!": function () { window.modal.DOMNode.dialog("close");}}
	    break;
	  case 'pageLeave':
	  	this.buttons = {
	  		"Yes": function () {
	  					   functions.setUpPixelOdrom();
	  						 window.modal.DOMNode.dialog("close");
      				 },
      	"No":  function () {
        			 	 window.modal.DOMNode.dialog("close");
      				 }
    	}
	    break;
	  case 'canvasCreate':
	  	this.buttons = {
	  		"Yes": function () {
	  						 window.canvas.checkCreate(args.callbackArgs.width, args.callbackArgs.height);
	  						 window.modal.DOMNode.dialog("close");
      				 },
      	"No":  function () {
        				 window.modal.DOMNode.dialog("close");
      				 }
    	}
	    break;
	  case 'canvasLoad':
	  	this.buttons = {
	  		"Yes": function () {
	  						 functions.showFileDialog();
	  						 window.modal.DOMNode.dialog("close");
      				 },
      	"No":  function () {
        				 window.modal.DOMNode.dialog("close");
      				 }
    	}
	    break;
	  case 'canvasSave':
	  	this.buttons = {
	  		"Yes": function () {
	  						 window.canvas.save();
	  						 window.modal.DOMNode.dialog("close");
      				 },
      	"No":  function () {
        				 window.modal.DOMNode.dialog("close");
      				 }
    	}
	    break;
	   case 'canvasReset':
	  	this.buttons = {
	  		"Yes": function () {
	  					   window.canvas.reset();
	  					   window.modal.DOMNode.dialog("close");
      				 },
      	"No":  function () {
        				 window.modal.DOMNode.dialog("close");
      				 }
    	}
	    break;
	  case 'canvasExport':
	  	this.buttons = {
	  		"Yes": function () {
        				 functions.exportCanvasWrapper();
        				 window.modal.DOMNode.dialog("close");
      				 },
      	"No":  function () {
        				 window.modal.DOMNode.dialog("close");
      				 }
    	}
	    break;
	  case 'info':
	  case 'error':
	  	this.buttons = {
	  		"OK": function () {
	  			window.modal.DOMNode.dialog("close");
	  		}
	  	}
	    break;
	}

	this.DOMNode.dialog({
		modal: true,
		title: this.title,
		buttons: this.buttons,
    resizable: false
  }).parent().removeClass("ui-state-error");

};

/**
 * @description Checks whether the jQuery UI Dialog is open.
 *
 * @returns {Boolean}
 */
Modal.prototype.isOpen = function () {

	/* We check first whether the dialog has been initialized
	https://stackoverflow.com/questions/15763909/jquery-ui-dialog-check-if-exists-by-instance-method */
	if (this.DOMNode.hasClass('ui-dialog-content')) {
		if (this.DOMNode.dialog("isOpen")) {
			return true;
		}
		else {
			return false;
		}
	}
	else {
		return false;
	}
}

export { Modal };