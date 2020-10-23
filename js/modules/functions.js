import { DEFAULT_PICKER_COLOR } from './constants.js';

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
 	 * @description Calculates the top position of the Tool box.
   *
   * @returns {Number} top position of the tool box.
 	 */
  getToolboxPositionTop: function () {
	  const TOOL_BOX_MARGIN_TOP = functions.CSSPixelToNumber($("#tool-box").css("marginTop"));
	  const TOOL_BOX_POSITION_TOP = $("#tool-box").position().top + TOOL_BOX_MARGIN_TOP;
	  return TOOL_BOX_POSITION_TOP;
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
	},

	/**
	 * @description Toggles the tool box.
	 *
	 * @param  {Boolean} show tells whether the tool box should be shown or hidden.
	 */
  showToolbox: function (show) {
		if (show) {
			$("#tool-box").removeClass("tool-box-hidden");
		}
		else {
			$("#tool-box").addClass("tool-box-hidden");
		}
	},

	/**
	 * @description Toggles the action box.
	 *
	 * @param {Boolean} show tells whether the action box should be shown or hidden.
	 */
	showActionbox: function (show) {
		if (show) {
			$("#action-box").removeClass("action-box-hidden");
		}
		else {
			$("#action-box").addClass("action-box-hidden");
		}
	},

	/**
	 * @description Sets the visibility of the help button.
	 */
	setBtnHelpVisibility: function () {
		if (!window.modal.isOpen() && (!window.spinner.isActive)) {

			window.setTimeout( function() {
				$("#btn-help").removeClass("btn-help-hidden");
				$("#btn-help").addClass("btn-help-visible");
			}, 100);
		}
		else{
			window.setTimeout( function() {
				$("#btn-help").removeClass("btn-help-visible");
				$("#btn-help").addClass("btn-help-hidden");
			}, 100);
		}
	},

	/**
	 * @description Sets the visibility of the back to top button.
	 */
	setBacktotopVisibility: function () {

		if ((($( window ).height() + $(window).scrollTop()) >= ($("body").outerHeight()/1.25)) &&
			(functions.getToolboxPositionTop()<=$(window).scrollTop()) && canvas.isActive &&
			(!window.modal.isOpen() &&(!window.spinner.isActive))) {

			window.setTimeout( function() {
				$("#btn-back-to-top").removeClass("btn-back-to-top-hidden");
				$("#btn-back-to-top").addClass("btn-back-to-top-visible");
			}, 100);
		}
		else{
			window.setTimeout( function() {
				$("#btn-back-to-top").removeClass("btn-back-to-top-visible");
				$("#btn-back-to-top").addClass("btn-back-to-top-hidden");
			}, 100);
		}
	},

	/**
	 * @description Sets the visibility of the side bar buttons.
	 */
  setBtnSidebarVisibility: function () {
		this.setBtnHelpVisibility();
		this.setBacktotopVisibility();
	},

	/**
	 * @description Opens the open file dialog (not a jQuery UI Dialog).
	 */
	showFileDialog: function () {

		/* We need to trigger this event manually, since we are using
		a button to activate a hidden input file field */

		$("#btn-load-canvas-input").trigger("click");
	},

	/**
	 * @description Initializes the color picker.
	 *
	 * @param  {String} inputColor Hexadecimal value of the color to be set.
	 */
	initializeColorPicker: function (inputColor) {

		window.drawingTool.color = inputColor;

		$("#color-picker").spectrum({
		    color: inputColor,
		    replacerClassName: "btn-color-picker",
				change: function(color) {
	        window.drawingTool.color = color.toHexString();
	        window.drawingTool.set(TOOL_BRUSH);
	    }
		});
	},

	/**
	 * @description Resets the input fields to their default values.
	 */
	resetInputFieldValues: function () {
		$("#inputWidth").val($("#input-width").prop("defaultValue"));
		$("#inputHeight").val($("#input-height").prop("defaultValue"));

		this.initializeColorPicker(DEFAULT_PICKER_COLOR);
	},

	/**
	 * @description Sets the value of the input fields
	 *
	 * @param  {Number} canvasWidth canvas width to be set to the input field.
	 * @param  {Number} canvasHeight canvas height to be set to the input field.
	 */
	setInputFieldValues: function (width, height) {
		$("#input-width").val(width);
		$("#input-height").val(height);
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
		scroll(0, functions.getToolboxPositionTop());
	},

	/**
   * @description Sets up the application.
   */
	setUpPixelOdrom: function () {
		functions.resetInputFieldValues();
		functions.showToolbox(false);
		functions.showActionbox(false);
		functions.setBtnSidebarVisibility();
		window.canvas.setVisibility(false);
	},

	/**
   * @description Wrapper for the create function.
   *
   * @param  {Array} canvasSize Width and height of the canvas.
   */
  createCanvasWrapper: function (canvasSize) {

		/* It calls the functions sequentially by using promises
	  This is needed for showing the spinner for the amount time
	  pixelOdrom needs to create the canvas

		We need the delay call, because otherwise the Spin is not shown */

	  if (canvasSize[0]*canvasSize[1]>1000) {
			window.spinner.show().
				then(delay.bind(1000)).
				then(window.canvas.create.bind(null, canvasSize)).
				then(window.spinner.hide());
		}
		else {
			window.canvas.create(canvasSize);
		}
	},

  /**
   * @description Wrapper for the export function.
   */
  exportCanvasWrapper: function () {

		/* It calls the functions sequentially by using promises
	  This is needed for showing the spinner for the amount time
	  pixelOdrom needs to export the canvas */

		window.spinner.show().
			then(window.canvas.export()).
			then(window.spinner.hide());
	},

	/**
   * @description Checks if the file to be imported contains a valid canvas.
   *
   * @returns {Boolean}
   */
	isValidCanvas: function (canvas) {
		let canvasCheck;

		if (canvas.length>0) {
			canvasCheck = canvas.filter("tr").get(0);

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