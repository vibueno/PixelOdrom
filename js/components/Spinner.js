/**
 * @module Spinner
 */

import { SPINNER } from '../constants.js';

/**
 * @constructor
 * @description Creates a new Spinner object.
 *
 */
let Spinner = function(){
    this.DOMNode = SPINNER;
    this.isActive = false;
 };

/**
 * @description Shows the spinner.
 */
Spinner.prototype.show = function () {
  //a promise is needed to stop async execution
  return new Promise((resolve) => {

    this.DOMNode.removeClass("spinner-container-hidden");
    this.DOMNode.addClass("spinner-container");

    $( 'body' ).css("overflow", "hidden");

    this.isActive = true;

    resolve(true);
  });
};

/**
 * @description Hides the spinner.
 */
Spinner.prototype.hide = function () {
  //a promise is needed to stop async execution
  return new Promise((resolve) => {

    this.DOMNode.addClass("spinner-container-hidden");
    this.DOMNode.removeClass("spinner-container");

    $ ( 'body' ).css("overflow", "auto");

    this.isActive = false;

    resolve(true);
  });
};

export { Spinner };