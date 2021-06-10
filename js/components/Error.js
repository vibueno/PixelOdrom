/**
 * @module Error
 */

/**
 * @constructor
 * @description Creates a new CanvasInvalidProportions Error object.
 */
let CanvasInvalidProportions = function() {
  this.name = 'CanvasInvalidProportions';
};

CanvasInvalidProportions.prototype = Error.prototype;

/**
 * @constructor
 * @description Creates a new CanvasCreateNoSpace Error object.
 */
let CanvasCreateNoSpace = function() {
  this.name = 'CanvasCreateNoSpace';
};

CanvasCreateNoSpace.prototype = Error.prototype;

/**
 * @constructor
 * @description Creates a new CanvasLoadNoSpace Error object.
 */
let CanvasLoadNoSpace = function() {
  this.name = 'CanvasLoadNoSpace';
};

CanvasLoadNoSpace.prototype = Error.prototype;

export { CanvasInvalidProportions, CanvasCreateNoSpace, CanvasLoadNoSpace };
