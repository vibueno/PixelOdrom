function CanvasInvalidProportions() {
  this.name = "CanvasInvalidProportions";
}

CanvasInvalidProportions.prototype = Error.prototype;

function CanvasNoSpace() {
  this.name = "CanvasNoSpace";
}

CanvasNoSpace.prototype = Error.prototype;

export { CanvasInvalidProportions, CanvasNoSpace };