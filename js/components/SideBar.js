/**
 * @module SideBar
 */

import { SEL_SIDEBAR_HELP, SEL_SIDEBAR_BACK_TO_TOP } from '../constants.js';

/**
 * @constructor
 * @description Creates a new SideBar object.
 *
 */
let SideBar = function() {
  this.DOMNodeBtnHelp = $(SEL_SIDEBAR_HELP);
  this.DOMNodeBtnBackToTop = $(SEL_SIDEBAR_BACK_TO_TOP);
};

/**
 * @description Sets the visibility of the help button.
 * @param {Boolean} visible Indicates whether the button should be shown or hidden.
 */
SideBar.prototype.setHelpVisibility = function(visible) {
  if (visible) {
    /* We use the parameter self in order not to lose 'this'
    in the function call inside window.setTimeout */
    window.setTimeout(
      function(self) {
        self.DOMNodeBtnHelp.removeClass('btn-help-hidden');
        self.DOMNodeBtnHelp.addClass('btn-help-visible');
      },
      100,
      this
    );
  } else {
    /* We use the parameter self in order not to lose 'this'
    in the function call inside window.setTimeout */
    window.setTimeout(
      function(self) {
        self.DOMNodeBtnHelp.removeClass('btn-help-visible');
        self.DOMNodeBtnHelp.addClass('btn-help-hidden');
      },
      100,
      this
    );
  }
};

/**
 * @description Sets the visibility of the back to top button.
 * @param {Boolean} visible Indicates whether the button should be shown or hidden.
 */
SideBar.prototype.setBacktotopVisibility = function(visible) {
  if (visible) {
    /* We use the parameter self in order not to lose 'this'
    in the function call inside window.setTimeout */
    window.setTimeout(
      function(self) {
        self.DOMNodeBtnBackToTop.removeClass('btn-back-to-top-hidden');
        self.DOMNodeBtnBackToTop.addClass('btn-back-to-top-visible');
      },
      100,
      this
    );
  } else {
    /* We use the parameter self in order not to lose 'this'
    in the function call inside window.setTimeout */
    window.setTimeout(
      function(self) {
        self.DOMNodeBtnBackToTop.removeClass('btn-back-to-top-visible');
        self.DOMNodeBtnBackToTop.addClass('btn-back-to-top-hidden');
      },
      100,
      this
    );
  }
};

export { SideBar };
