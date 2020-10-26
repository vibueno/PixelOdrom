/**
 * @module Modal
 */

import { MODAL, MODAL_CONTENT } from '../constants.js';

/**
 * @constructor
 * @description Creates a new Modal object.
 */
 let Modal = function(){
   this.DOMNode = $ ( MODAL );
   this.DOMNodeText = $( MODAL ).first('p');
   this.title = null;
   this.buttons = null;
 };

/**
 * @description Sets title text.
 * @param {String} text Text to be shown on the modal title bar.
 */
 Modal.prototype.setTitle = function (title) {
   this.title = title;
 };

/**
 * @description Sets modal text.
 * @param {String} text Text to be shown on the modal.
 * @param {String} isHTML Indicates whether the text should be treated as HTML.
 */
 Modal.prototype.setText = function (text, isHTML) {
   if (isHTML) {
    this.DOMNodeText.html( text );
  }
  else {
    this.DOMNodeText.text( text );
  }
};

/**
 * @description Opens the modal.
 * @param {String} modalType indicates the type of modal to be shown.
 * @param {String} modalButtons Indicates which buttons should be shown on the modal.
 *
 * @return {Promise} Used if actions will be performed outside of this module.
 */
Modal.prototype.open = function (modalType, modalButtons, args) {

  let button1Label;
  let button2Label;

  this.buttons = {};

  return new Promise((resolve) => {

    if (args!==undefined){

      if (args.title!==undefined) {
        this.setTitle(args.title);
      }
      else {
        this.setTitle(MODAL_CONTENT[modalType].title);
      }

      if (args.text!==undefined){
        this.setText(args.text);
      }
      else {
        this.setText(MODAL_CONTENT[modalType].text, true);
      }
    }
    else
    {
     this.setTitle(MODAL_CONTENT[modalType].title);
     this.setText(MODAL_CONTENT[modalType].text, true);
    }

    switch(modalButtons) {

    case 'OK':

      button1Label = 'OK';

      if (args!==undefined){
        if (args.button1Label!==undefined) {
         button1Label =args.button1Label;
       }
      }

      this.buttons[button1Label] = function () {
        this.DOMNode.dialog('close');
        resolve(true);
      }.bind(this);

      break;

    case 'yesNo':
      button1Label = 'Yes';
      button2Label = 'No';

      if (args!==undefined){
        if (args.button1Label!==undefined) {
          button1Label =args.button1Label;
        }

        if (args.button2Label!==undefined) {
          button2Label =args.button2Label;
        }
      }

      this.buttons[button1Label] = function () {
        this.DOMNode.dialog('close');
        resolve(true);
      }.bind(this);

      this.buttons[button2Label] = function () {
        this.DOMNode.dialog('close');
        resolve(false);
      }.bind(this);

    }

    this.DOMNode.dialog({
     modal: true,
     title: this.title,
     buttons: this.buttons,
     resizable: false
    }).parent().removeClass('ui-state-error');

  });
};

/**
 * @description Checks whether the jQuery UI Dialog is open.
 *
 * @returns {Boolean} Tells whether the modal is open.
 */
Modal.prototype.isOpen = function () {

  /* We check first whether the dialog has been initialized
  https://stackoverflow.com/questions/15763909/jquery-ui-dialog-check-if-exists-by-instance-method */
  if (this.DOMNode.hasClass('ui-dialog-content')) {
    if (this.DOMNode.dialog('isOpen')) {
      return true;
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
};

export { Modal };