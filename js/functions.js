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
		 return parseInt(CSSValue.replace('px', ''));
	},

	/**
   * @description Navigates to an empty page with no canvas.
   */
 	goToHomePage: function () {
		if (window.canvas.isActive) {
			window.modal.open('pageLeave');
		}
		else{
			functions.setUpPixelOdrom();
		}
	},

	/**
	 * @description Opens the open file dialog (not a jQuery UI Dialog).
	 */
	showFileDialog: function () {

		/* We need to trigger this event manually, since we are using
		a button to activate a hidden input file field */

		$('#btn-load-canvas-input').trigger('click');
	},

	/**
	 * @description Scrolls to top of window
	 *
	 */
	scrollTop: function () {
		scroll(0, 0);
	},

	/**
	 * @description Scrolls to top of toolbox
	 *
	 */
	scrollToolboxTop: function () {
		scroll(0, window.canvasToolBox.getPositionTop());
	},

	/**
   * @description Checks if the file to be imported contains a valid canvas.
   *
   * @returns {Boolean}
   */
	isValidCanvas: function (canvas) {
		let canvasCheck;

		if (canvas.length>0) {
			canvasCheck = canvas.filter('tr').get(0);

			if (canvasCheck === canvas.get(0)) {
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

};

export { functions };