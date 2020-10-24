import { functions } from '../functions.js';

/**
 * @constructor
 * @description Creates a new Spinner object.
 *
 */
let Spinner = function(){
	this.isActive = false;
};

/**
 * @description Shows the spinner.
 */
Spinner.prototype.show = function () {
	//a promise is needed to stop async execution
	return new Promise((resolve) => {

		$("#spinner-container").removeClass("spinner-container-hidden");

		$("#spinner-container").addClass("spinner-container");

		$("body").css("overflow", "hidden");

		this.isActive = true;

		resolve("Spin shown");
	});
};

/**
 * @description Hides the spinner.
 */
Spinner.prototype.hide = function () {
	//a promise is needed to stop async execution
	return new Promise((resolve) => {

		$("#spinner-container").addClass("spinner-container-hidden");
		$("#spinner-container").removeClass("spinner-container");

		$("body").css("overflow", "auto");

		this.isActive = false;

		resolve("Spin hidden");
	});
};

export { Spinner };