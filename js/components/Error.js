/**
 * @module Error
 */

/**
 * @constructor
 * @description Creates a new CanvasInvalidProportions Error object.
 */
let CanvasInvalidProportions = function () {
  this.name = "CanvasInvalidProportions";
}

CanvasInvalidProportions.prototype = Error.prototype;

/**
 * @constructor
 * @description Creates a new CanvasNoSpace Error object.
 */
let CanvasNoSpace = function () {
  this.name = "CanvasNoSpace";
}

CanvasNoSpace.prototype = Error.prototype;

export { CanvasInvalidProportions, CanvasNoSpace };