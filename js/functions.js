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
	},

	/**
	 * @description Calculates the top position of an HTML node.
	 *
	 * @returns {Number} top position of the node.
	 */
	getNodePositionTop: function (id) {
	  const TOOL_BOX_MARGIN_TOP = functions.CSSPixelToNumber($(id).css('marginTop'));
	  const TOOL_BOX_POSITION_TOP = $(id).position().top + TOOL_BOX_MARGIN_TOP;
	  return TOOL_BOX_POSITION_TOP;
	},

	/**
	 * @description Scrolls to the set position
	 *
	 * @returns {Number} top position of the node.
	 */
	scrollTo: function (position) {
			window.scroll(0, position);
	}
};

export { functions };