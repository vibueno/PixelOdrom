/**
  * @module functions
  */

let functions = {

	/**
	 * @description Creates a delay that can be used in a promise chain.
	 * @param  {Number} duration amount of time the delay will run.
	 *
	 * @returns {Object} Promise
	 */
	delay: function (duration) {
	   return new Promise(function(resolve) {
	       setTimeout(resolve, duration);
	   });
	},

	/**
	 * @description Converts a css value to Number.
	 * @param  {String} CSSValue value to be converted.
	 *
	 * @returns {Number} converted value
	 */
	CSSPixelToNumber: function (CSSValue) {
		 return parseInt(CSSValue.replace("px", ""));
	},

	/**
	 * @description Scrolls to the set position
	 */
	scrollTo: function (position) {
		scroll(0, position);
	},

	/**
   * @description Navigates to an empty page with no canvas.
   */
 	goToHomePage: function () {
		if (isCanvasActive()) {
			showConfirmDialog(DIALOG_CONFIRM_TITLE, "Leaving the page will reset the canvas. Do you want to proceed?" , false, setUpPixelOdrom);
		}
		else{
			setUpPixelOdrom();
		}
	}
};

export { functions };