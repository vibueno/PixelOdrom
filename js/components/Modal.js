/**
 * @module Modal
 */

import { SEL_MODAL, MODAL_CONTENT } from '../constants.js';

/**
 * @constructor
 * @description Creates a new Modal object.
 */
let Modal = function() {
  this.DOMNode = $(SEL_MODAL);
  this.DOMNodeText = $(SEL_MODAL).first('p');
  this.title = null;
  this.buttons = null;
};

/**
 * @description Sets title text.
 * @param {String} text Text to be shown on the modal title bar.
 */
Modal.prototype.setTitle = function(title) {
  this.title = title;
};

/**
 * @description Sets modal text.
 * @param {String} text Text to be shown on the modal.
 * @param {String} isHTML Indicates whether the text should be treated as HTML.
 */
Modal.prototype.setText = function(text, isHTML) {
  if (isHTML) {
    this.DOMNodeText.html(text);
  } else {
    this.DOMNodeText.text(text);
  }
};

/**
 * @description Opens the modal.
 * @param {String} modalType    Indicates the type of modal to be shown.
 * @param {String} modalButtons Indicates which buttons should be shown on the modal.
 * @param {String} messageArgs  Arguments for completing a modal text template
 *
 * @return {Promise} Used if actions will be performed outside of this module.
 */
Modal.prototype.open = function(modalType, modalButtons, args) {
  let button1Label;
  let button2Label;

  this.buttons = {};

  return new Promise(resolve => {
    this.setTitle(MODAL_CONTENT[modalType].title);

    if (typeof args === 'object') {
      if (typeof args.messageArgs === 'object') {
        let modalTextTpl = MODAL_CONTENT[modalType].text;

        const makeTemplate = templateString => {
          /*jslint evil: true */

          /* The comment above is telling the JSHint to ignore the Function constructor call
          Even though this is supposed to be bad practise,
          I think this case is complicated enough to use it exceptionally.
          http://jslint.fantasy.codes/the-function-constructor-is-eval
          */
          return templateData =>
            new Function(
              `{${Object.keys(templateData).join(',')}}`,
              'return `' + templateString + '`'
            )(templateData);
        };

        const tpl = makeTemplate(modalTextTpl);
        const modalTextFilled = tpl(args.messageArgs);

        this.setText(modalTextFilled, true);
      } else {
        this.setText(MODAL_CONTENT[modalType].text, true);
      }
    } else {
      this.setText(MODAL_CONTENT[modalType].text, true);
    }

    switch (modalButtons) {
      case 'OK':
        button1Label = 'OK';

        if (args !== undefined) {
          if (args.button1Label !== undefined) {
            button1Label = args.button1Label;
          }
        }

        this.buttons[button1Label] = function() {
          this.DOMNode.dialog('close');
          resolve(true);
        }.bind(this);

        break;

      case 'yesNo':
        button1Label = 'Yes';
        button2Label = 'No';

        if (args !== undefined) {
          if (args.buttonLabels !== undefined) {
            if (args.buttonLabels.button1Label !== undefined) {
              button1Label = args.buttonLabels.button1Label;
            }

            if (args.buttonLabels.button2Label !== undefined) {
              button2Label = args.buttonLabels.button2Label;
            }
          }
        }

        this.buttons[button1Label] = function() {
          this.DOMNode.dialog('close');
          resolve(true);
        }.bind(this);

        this.buttons[button2Label] = function() {
          this.DOMNode.dialog('close');
          resolve(false);
        }.bind(this);
    }

    this.DOMNode.dialog({
      modal: true,
      title: this.title,
      buttons: this.buttons,
      resizable: false,
    })
      .parent()
      .removeClass('ui-state-error');
  });
};

/**
 * @description Checks whether the jQuery UI Dialog is open.
 *
 * @returns {Boolean} Tells whether the modal is open.
 */
Modal.prototype.isOpen = function() {
  /* We check first whether the dialog has been initialized
  https://stackoverflow.com/questions/15763909/jquery-ui-dialog-check-if-exists-by-instance-method */
  if (this.DOMNode.hasClass('ui-dialog-content')) {
    if (this.DOMNode.dialog('isOpen')) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

/**
 * @description Centers the modal
 */
Modal.prototype.center = function() {
  $(SEL_MODAL).dialog('option', 'position', {
    my: 'center',
    at: 'center',
    of: window,
  });
};

export { Modal };
