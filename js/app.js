/*
	In this file we use the expression pixelOdrom pixels to refer of the squares in the table (canvas).
	We do so to avoid confusion with CSS pixels
*/

/**
 *
 * Constants
 *
 */

const pixelCanvasSel = "#pixelCanvas";

const toolBrush = "paint-brush";
const toolEraser = "eraser";

const blankPixelColor = "#fff";
const defaultColorPickerColor = "#000";

const canvasAspectRatio = 1.5;

/*
	Since canvas can be resized and we are using % for the sizes,
	these pixel limits are only used for calculating the % of the main
	div that the canvas will take, so that pixels don't get too big or too small
*/

const minPixelSize = 10; //in CSS pixels
const maxPixelSize = 15; //in CSS pixels

const maxCanvasWithPO = 100; //in pixelOdrom pixels

const pixelPaddingCorrection = 0.1;

const cursorColor = "#888888";

const row = "<tr></tr>";
const column = '<td class="pixel"></td>';

/**
 * Dialog constants
 */

const toolBrushHTML = '<i class="fa fa-paint-brush"></i>';
const toolEraserHTML = '<i class="fa fa-eraser"></i>';
const createCanvasHTML = '<i class="fa fa-th"></i>';
const saveCanvasHTML = '<i class="fa fa-floppy-o"></i>';
const exportCanvasHTML = '<i class="fa fa-image"></i>';
const openCanvasHTML = '<i class="fa fa-folder-open"></i>';

const dialogHelpTitle = 'pixelOdrom help';

const dialogHelpText =  `<p class = "dialog-text-intro">pixelOdrom is a web tool for drawing pixel art.</p>
<ul class="dialog-list">
	<li class="dialog-list-element">Create a new canvas &nbsp;${createCanvasHTML} or open an existing one &nbsp;${openCanvasHTML}</li>
	<li class="dialog-list-element">Choose a color with the picker and use the &nbsp;${toolBrushHTML} for painting pixels.
	<p class="dialog-list-text-below">If you are using a mouse, you can also draw pixel lines.</p></li>
	<li class="dialog-list-element">By using the &nbsp;${toolEraserHTML}, you can erase pixels.
	<p class="dialog-list-text-below">If you are using a mouse, you can also erase multiple pixels in one stroke</p></li>
	<li class="dialog-list-element">Click on &nbsp;${saveCanvasHTML} to save your canvas to a local pixelOdrom file (*.pix) to continue your work later (note that every time you save the canvas, a new file will be created)</li>
	<li class="dialog-list-element">Click on &nbsp;${exportCanvasHTML} to export your canvas as an image</li>
</ul>`;

const dialogStartUpTitle = 'Welcome to pixelOdrom';

const dialogStartUpText = dialogHelpText + `<p>
	<input type="checkbox" id="dialogStartUpHide">
	<label for="dialogStartUpHide">I am already a pixelOdrom master. Don't show this again!</label>
</p>
`;

const dialogConfirmExportText = `<p class = "dialog-text">You are about to save your pixel art to an image file.</p>
<p class = "dialog-text">Depending on your browser configuration, the picture may start to download automatically and be saved into your download directory.</p>
<p class = "dialog-text">If your canvas is big, this process may take a couple of seconds to complete.</p>
<p class = "dialog-text">Would you like to export this canvas now?</p>`;

const dialogConfirmTitle = "Confirm";
const dialogErrorTitle = "Error";

/**
 *
 * Globals
 *
 */

let gbMouseIsDown = false;
let gbSelectedTool = toolBrush;

let gbSelectedColor = defaultColorPickerColor;

let gbCanvas;

let gbCurrentCanvasMaxWidthPO; //in pixelOdrom pixels
let gbCurrentCanvasMaxHeightPO; //in pixelOdrom pixels

let gbCurrentCanvasWidthPO; //in pixelOdrom pixels
let gbCurrentCanvasHeightPO; //in pixelOdrom pixels

let gbMainWidthPx; //In CSS pixels

let gbCurrentCanvasWidth; //%

/**
 *
 * General functions
 *
 */

/**
 * Create a delay that can be used in a promise chain
 * @param  {[Number]} duration amount of time the delay will run
 */

function delay(duration) {
   return new Promise(function(resolve) {
       setTimeout(resolve, duration)
   });
}

/**
 * Converts a css value to Number
 * @param  {[String]} CSSValue value to be converted
 */

function CSSPixelToNumber(CSSValue){
	 return parseInt(CSSValue.replace("px", ""));
}

/**
 * Sets value of global variables
 */

function setGlobals(){

	gbCurrentCanvasWidthPO = parseInt($("#inputWidth").val());
	gbCurrentCanvasHeightPO = parseInt($("#inputHeight").val());

	gbMainWidthPx = parseInt($(".main").width());

	gbCurrentCanvasMaxWidthPO = Math.min(Math.floor(gbMainWidthPx/minPixelSize), maxCanvasWithPO);
	gbCurrentCanvasMaxHeightPO = Math.floor(gbCurrentCanvasMaxWidthPO*canvasAspectRatio);

	gbCanvas = $ ( pixelCanvasSel );

}

/**
 * Navigates to an empty page with no canvas
 */

function goToHomePage(){
	if (isCanvasActive()){
		showConfirmDialog(dialogConfirmTitle, "Leaving the page will reset the canvas. Do you want to proceed?" , false, setUpPixelOdrom);
	}
	else{
		setUpPixelOdrom();
	}
}

/**
 * Sets up the application
 */

function setUpPixelOdrom(){
	resetInputFieldValues();
	setGlobals();
	showToolbox(false);
	showActionbox(false);
	setBtnSidebarVisibility();
	showCanvas(false);
}

/**
 *
 * Spinner
 * It is used to tell the user the system is working on something
 * It is a full screen div, since we need to move the canvas
 * to the top-left corner before exporting it to an image
 * and we want to hide this to the user
 *
 */

/**
 * Shows the spinner
 */

function showSpin(){

	//a promise is needed to stop async execution
	return new Promise((resolve) => {

		$("#spinnerContainer").removeClass("spinner-container-hidden");

		$("#spinnerContainer").addClass("spinner-container");

		$("body").css("overflow", "hidden");

		setBtnSidebarVisibility();

		resolve("Spin shown");
	});
}

/**
 * Hides the spinner
 */

function hideSpin(){

	//a promise is needed to stop async execution
	return new Promise((resolve) => {

		$("#spinnerContainer").addClass("spinner-container-hidden");
		$("#spinnerContainer").removeClass("spinner-container");

		$("body").css("overflow", "auto");

		setBtnSidebarVisibility();

		resolve("Spin hidden");
	});
}

/**
 * Checks whether the spinner is being used
 */

function isSpinnerActive(){
	return $("#spinnerContainer").hasClass("spinner-container");
}

/**
 *
 * Dialogs
 *
 */

function showStartUpDialog(){

	$( "#dialog" ).attr('title', dialogStartUpTitle);

	$( "#dialog" ).first("p").html(dialogStartUpText);

	$( "#dialog" ).dialog({
		modal: true,
		buttons: {
    	"Get started!": function () {
        $(this).dialog("close");
      }
    },
    resizable: false
  });
}

/**
 * Opens the help dialog
 */

function showHelpDialog(){

	$( "#dialog" ).attr('title', dialogHelpTitle);

	$( "#dialog" ).first("p").html(dialogHelpText);

	$( "#dialog" ).dialog({
		modal: true,
		buttons: {
    	"Alright!": function () {
        $(this).dialog("close");
      }
    },
    resizable: false
  }).parent().removeClass("ui-state-error");
}

/**
 * Opens the confirm dialog
 * @param  {[String]} dialogTitle    Text for the title of the dialog
 * @param  {[String]} dialogContent  Text for the content of the dialog
 * @param  {[Boolean]} isHTMLcontent Tells whether the content of the dialog is HTML
 * @param  {[String]} callback       Callback function
 * @param  {[Array]} callbackParams  Parameters for the callback function
 */

function showConfirmDialog(dialogTitle, dialogContent, isHTMLcontent, callback, callbackParams){

	$( "#dialog" ).attr('title', dialogTitle);

	if (isHTMLcontent){
		$( "#dialog" ).first("p").html(dialogContent);
	}
	else{
		$( "#dialog" ).first("p").text(dialogContent);
	}

	$( "#dialog" ).dialog({
		modal: true,
		buttons: {
    	"Yes": function () {
        $(this).dialog("close");
        callback(callbackParams);
      },
      "No": function () {
        $(this).dialog("close");
      },
    },
    resizable: false
  }).parent().removeClass("ui-state-error");
}

/**
 * Opens the information dialog
 * @param  {[String]} dialogTitle    Text for the title of the dialog
 * @param  {[String]} dialogContent  Text for the content of the dialog
 * @param  {[Boolean]} isHTMLcontent Tells whether the content of the dialog is HTML
 */

function showInfoDialog(dialogTitle, dialogContent, isHTMLcontent){

	$( "#dialog" ).attr('title', dialogTitle);

	if (isHTMLcontent){
		$( "#dialog" ).first("p").html(dialogContent);
	}
	else{
		$( "#dialog" ).first("p").text(dialogContent);
	}

	$( "#dialog" ).dialog({
		modal: true,
		buttons: {
    	"OK": function () {
        $(this).dialog("close");
      }
    },
    resizable: false
  }).parent().removeClass("ui-state-error");
}

/**
 * Opens the error dialog
 * @param  {[String]} dialogTitle    Text for the title of the dialog
 * @param  {[String]} dialogContent  Text for the content of the dialog
 * @param  {[Boolean]} isHTMLcontent Tells whether the content of the dialog is HTML
 */

function showErrorDialog(dialogTitle, dialogContent, isHTMLcontent){

	$( "#dialog" ).attr('title', dialogTitle);

	if (isHTMLcontent){
		$( "#dialog" ).first("p").html(dialogContent);
	}
	else{
		$( "#dialog" ).first("p").text(dialogContent);
	}

	$( "#dialog" ).dialog({
		modal: true,
		buttons: {
    	"OK": function () {
        $(this).dialog("close");
      }
    },
    resizable: false
  }).parent().addClass("ui-state-error");
}

/**
 * Opens the open file dialog (not a jQuery UI Dialog)
 */

function showFileDialog(){
	/*
	 We need to trigger this event manually, since we are using
	 a button to activate a hidden input file field
	*/
	$("#btnLoadCanvasInput").trigger("click");
}

/**
 * Checks whether the jQuery UI Dialog is open
 */

function isDialogOpen(){

	/*
	 We check first whether the dialog has been initialized
	 https://stackoverflow.com/questions/15763909/jquery-ui-dialog-check-if-exists-by-instance-method
	*/

	if ($("#dialog").hasClass('ui-dialog-content')){
		if ($("#dialog").dialog("isOpen")){
			return true;
		}
		else
		{
			return false;
		}
	}
	else{
		return false;
	}
}

/**
 *
 * Input fields
 *
 */

/**
 * Resets the input fields to their default values
 */

function resetInputFieldValues(){
	$("#inputWidth").val($("#inputWidth").prop("defaultValue"));
	$("#inputHeight").val($("#inputHeight").prop("defaultValue"));

	InitializeColorPicker(defaultColorPickerColor);
}

/**
 * Sets the value of the input fields
 * @param  {Number} canvasWidth canvas width to be set to the input field
 * @param  {Number} canvasHeight canvas height to be set to the input field
 */

function setInputFieldValues(canvasWidth, canvasHeight){
	$("#inputWidth").val(canvasWidth);
	$("#inputHeight").val(canvasHeight);
}

/**
 * Initializes the color picker
 * @param  {String} inputColor Hexadecimal value of the color to be set
 */

function InitializeColorPicker(inputColor){

	gbSelectedColor = inputColor;

	$("#colorPicker").spectrum({
	    color: inputColor,
	    replacerClassName: "btnColorPicker",
			change: function(color) {
        gbSelectedColor = color.toHexString();
        selectTool(toolBrush);
    }
	});
}

/**
 *
 * Toolbox
 *
 */

/**
 * Calculates the top position of the Tool box
 * @return  {Number}  top position of the tool box
 */

function getToolboxPositionTop(){
	const toolboxMarginTop = CSSPixelToNumber($("#toolbox").css("marginTop"));
	const toolboxPositionTop = $("#toolbox").position().top + toolboxMarginTop;
	return toolboxPositionTop;
}

/**
 * Scrolls to the top of the toolbox
 */

function scrollToToolboxTop(){
	scroll(0, getToolboxPositionTop());
}

/**
 *
 * Canvas
 *
 */

 /**
 * Toggles the canvas
 * @param  {Boolean} show tells whether the canvas should be shown
 */

function showCanvas(show){

	if (show){
		gbCanvas.removeClass("pixel-canvas-hidden");
		gbCanvas.addClass("pixel-canvas");
	}
	else
	{
		gbCanvas.addClass("pixel-canvas-hidden");
		gbCanvas.removeClass("pixel-canvas");
	}

}

/**
 * Prepares the canvas
 * @param  {[Number]} canvasWidthPO canvas width in pixelOdrom pixels
 * @param  {[Number]} canvasHeightPO canvas height in pixelOdrom pixels
 */

function setUpCanvas(canvasWidthPO, canvasHeightPO){

	let canvasCSSWidth;
	let pixelSize;

	const pixelBroderSize = $(".pixel").css("border-left-width");
	pixelBorderSize = (typeof myVar === 'undefined')? 0: CSSPixelToNumber(pixelBroderSize);

	const totalBordersSize = pixelBorderSize * gbCurrentCanvasHeightPO;
	const maxCanvasWidthPx = gbMainWidthPx-totalBordersSize;

	setGlobals();

	/*
		Here we calculate the % of the space available that we will use for the canvas,
	 	so that the pixels have a reasonable size.
	 	The side effects of not doing so would be:
	 	A too wide canvas and small amount of pixels results in too large pixels
	 	A too small canvas a large amount of pixels would result in too small pixels
	*/

	for (let i=100;i>=1;i-=1){

		canvasCSSWidth = i;
		pixelSize = ((maxCanvasWidthPx / 100) * i) / canvasWidthPO;

		if ((((maxCanvasWidthPx / 100) * i) / canvasWidthPO)<=maxPixelSize){
			break;
		}

	}

	gbCanvas.css("width", (canvasCSSWidth+"%"));
	gbCurrentCanvasWidth = canvasCSSWidth;

	setInputFieldValues(canvasWidthPO, canvasHeightPO);

	setGlobals();

	setUpPixel(maxCanvasWidthPx);

	showToolbox(true);
	showActionbox(true);
	selectTool(toolBrush);
	showCanvas(true);

}

/**
 * Set ups the pixelOdrom pixels in the canvas
 * @param  {[Number]} maxCanvasWidthPx maximal width of the canvas in CSS pixels
 */

function setUpPixel(maxCanvasWidthPx){

	const maxCanvasWidthPercent = (maxCanvasWidthPx/gbMainWidthPx)*100;

	let pixelWidth = maxCanvasWidthPercent/gbCurrentCanvasWidthPO;

	let padding = pixelWidth;
	padding = padding - padding*pixelPaddingCorrection;

	gbCanvas.find(".pixel").width(pixelWidth+"%");
	gbCanvas.find(".pixel").css("padding-bottom", padding+"%");

}

/**
 * Checks whether the canvas can be created
 * @param  {[Array]} canvasSize Width and height of the canvas
 */

function createCanvasCheck(canvasSize) {

	setGlobals();

	const canvasWidth = canvasSize [0];
	const canvasHeight = canvasSize [1];

	const maxCanvasPixel=[gbCurrentCanvasMaxWidthPO, gbCurrentCanvasMaxHeightPO];

	if (canvasWidth > gbCurrentCanvasMaxWidthPO || canvasHeight >  gbCurrentCanvasMaxHeightPO){
		showCanvas(true);
		showConfirmDialog("Canvas too big", `The dimensions selected exceed the available space.
			Would you like to create the biggest possible canvas (width: ${gbCurrentCanvasMaxWidthPO}, height: ${gbCurrentCanvasMaxHeightPO})?`,
			false,
			createCanvasWrapper, maxCanvasPixel);
	}
	else
	{
		createCanvasWrapper(canvasSize);
	}
}

/**
 * Creates the canvas
 * @param  {[Array]} canvasSize Width and height of the canvas
 * @param  {[Boolean]} scrollToCanvas tells whether to navigate to the canvas after creation
 */

function createCanvas(canvasSize, scrollToCanvas=true){

	return new Promise((resolve) => {

		const canvasWidth = canvasSize [0];
		const canvasHeight = canvasSize [1];

		deleteCanvas();

		for (let i=1; i<=canvasHeight; i++){
			gbCanvas.append(row);
			let lastRow = $(pixelCanvasSel + " tr").last();

			for (let j=1; j<=canvasWidth; j++){
				lastRow.append(column);
			}
		}

		setUpCanvas(canvasWidth, canvasHeight);

		if (scrollToCanvas){
			scroll(0, getToolboxPositionTop());
		}

		resolve ("Canvas created");
	});
}

/**
 * Wrapper for the create function
 * @param  {[Array]} canvasSize Width and height of the canvas
 */

function createCanvasWrapper(canvasSize){

	/*
  	It calls the functions sequentially by using promises
  	This is needed for showing the spinner for the amount time
  	pixelOdrom needs to create the canvas

		We need the delay call, because otherwise the Spin is not shown

  */

  if (canvasSize[0]*canvasSize[1]>1000){
		showSpin().then(delay.bind(1000)).then(createCanvas.bind(null, canvasSize)).then(hideSpin);
	}
	else
	{
		createCanvas(canvasSize);
	}
}

/**
 * Checks if the canvas width/height relation is allowed
 * @param  {[Number]} widthPO width of the canvas in pixelOdrom pixels
 * @param  {[Number]} heightPO height of the canvas in pixelOdrom pixels
 */

function canvasPropCorrect(widthPO, heightPO){

	const proportion = widthPO/heightPO;

	if (proportion>=(canvasAspectRatio/4) && proportion <=canvasAspectRatio){
		return true;
	}
	else{
		return false;
	}

}

/**
 * Deletes the canvas from the DOM
 */

function deleteCanvas(){

	const canvasRows = $ (pixelCanvasSel + " tr");

	canvasRows.remove();
	showCanvas(false);
}

/**
 * Resets all pixels to their initial color
 */

function resetCanvas(){
	gbCanvas.find(".pixel").css("background-color", blankPixelColor);
	scrollToToolboxTop();
}

/**
 * Saves the canvas to a .*pix file
 */

function saveCanvas(){

	//We need to clone the canvas, so that we don"t modify the DOM
	const canvasToSave = gbCanvas.clone();

	//removing styles since they should be calculated when loading
	canvasToSave.find(".pixel").css("width", "");
	canvasToSave.find(".pixel").css("padding-bottom", "");

	const canvasContent = canvasToSave.html();

  const blob = new Blob([canvasContent], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "canvas.pix");

}

/**
 * Exports the canvas to an image file
 */

function exportCanvas(){

	return new Promise((resolve) => {

		/*
		 In order to make it easier for html2canvas,
		 we move the pixel table to the left corner of the browser
		*/

		$(pixelCanvasSel).addClass("pixel-canvas-export");
		$(pixelCanvasSel).removeClass("pixel-canvas");

		html2canvas(document.querySelector("#pixelCanvas"),
			{x: $("#pixelCanvas").left,
			y: $("#pixelCanvas").top})
		.then(canvas => {

			//Shows canvas at the bottom of the page
		  //document.body.appendChild(canvas)

		  //Saves canvas to client
			saveAs(canvas.toDataURL(), 'pixelOdrom.png');

			/*
			Moving the pixel table back to its original position
			*/

			$(pixelCanvasSel).removeClass("pixel-canvas-export");
			$(pixelCanvasSel).addClass("pixel-canvas");

			resolve ("Exported canvas");

		});
	});
}

/**
 * Wrapper for the export function
 */

function exportCanvasWrapper(){

	/*
  	It calls the functions sequentially by using promises
  	This is needed for showing the spinner for the amount time
  	pixelOdrom needs to export the canvas
  */

	showSpin().then(exportCanvas).then(hideSpin);
}

/**
 * Checks if the file to be imported contains a valid canvas
 */

function isValidCanvas(canvas){
	let canvasCheck;

	if (canvas.length>0){

		canvasCheck = canvas.filter("tr").get(0);

		if (canvasCheck === canvas.get(0)){
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}

}

/**
 * Loads a canvas
 * @param  {[File]} file containing the canvas to be imported
 */

function loadCanvas(input){

	const file = input.files[0];
  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function(){

  	let readerResult = reader.result;

  	try{
			let canvasToImport= $(readerResult);

	  	if (!isValidCanvas(canvasToImport)){
	  		showInfoDialog("Wrong format", "The selected file does not contain a valid canvas.", false);
	  	}
	  	else
	  	{

	  		setGlobals();

				const canvasWidth = canvasToImport.first().find(".pixel").length;
				const canvasHeight = canvasToImport.length;

				if (canvasWidth > gbCurrentCanvasMaxWidthPO || canvasHeight >  gbCurrentCanvasMaxHeightPO){
					let dialogMsg = `The selected canvas is too big for the available space.
						If you created this canvas on another device, please make sure you use a similar one
						to edit it.`

					showInfoDialog("Canvas too big", dialogMsg, false);
				}
				else
				{
					gbCanvas.html(reader.result);
					$("#inputWidth").val(canvasWidth);
					$("#inputHeight").val(canvasHeight);

					setUpCanvas(canvasWidth, canvasHeight);
					scrollToToolboxTop();

				}
			}
		}
		catch(e){
			let shortErrorMessage = (e.message.length>500)?e.message.substring(0,499)+"...":e.message;

			showErrorDialog(dialogErrorTitle, `There was an error while trying to load the canvas: ${shortErrorMessage}`, false);
		}
  };

  reader.onerror = function() {
    showErrorDialog(dialogErrorTitle, `There was an error while trying to load the canvas: ${reader.error}`, false);
  };

  /*
  	This call is needed in order to make the even onchange fire every time,
  	even if the users selects the same file again
  */
  $("#btnLoadCanvasInput").prop("value", "");

}

/**
 * Checks whether there is an active canvas
 */

function isCanvasActive(){
	return $(pixelCanvasSel + " tr").length;
}

/**
 * Paints or erases a pixel
 * @param  {[jQuery Selector]} pixel pixelOdrom pixel to be painted or erased
 */

function paintPixel(pixel){

	if ((gbSelectedTool) == toolBrush){
		$ ( pixel ).css( "background-color", gbSelectedColor);
	}
	else
	{
		$ ( pixel ).css( "background-color", blankPixelColor);
	}
}

/**
 *
 * Toolbox
 *
 */

/**
 * Changes the active tool
 * @param  {[String]} tool tool to be set as active
 */

function selectTool(tool){
	gbSelectedTool = tool;

	switch(gbSelectedTool) {
	  case toolBrush:
	  	$( "#btnToolEraser").removeClass("btn-pressed");
	    $( "#btnToolBrush").addClass("btn-pressed");
	    break;
	  case toolEraser:
	  	$( "#btnToolBrush").removeClass("btn-pressed");
	  	$( "#btnToolEraser").addClass("btn-pressed");
	    break;
	}

}

/**
 * Toggles the tool box
 * @param  {[Boolean]} show tells whether the tool box should be shown or hidden
 */

function showToolbox(show){
	if (show){
		$("#toolbox").removeClass("toolbox-hidden");
	}
	else
	{
		$("#toolbox").addClass("toolbox-hidden");
	}
}

/**
 *
 * Action box
 *
 */

/**
 * Toggles the action box
 * @param  {[Boolean]} show tells whether the action box should be shown or hidden
 */

function showActionbox(show){
	if (show){
		$("#actionbox").removeClass("actionbox-hidden");
	}
	else
	{
		$("#actionbox").addClass("actionbox-hidden");
	}
}

/**
 * Functionality of the reset canvas button
 */

function btnResetCanvasClick(){
	resetCanvas();
}

/**
 *
 * Side bar buttons
 *
 */

/**
 * Back to top
 */

/**
 * Sets the visibility of the back to top button
 */

function setBacktotopVisibility(){

	if ((($( window ).height() + $(window).scrollTop()) >= ($("body").outerHeight()/1.25)) &&
		(getToolboxPositionTop()<=$(window).scrollTop()) && isCanvasActive() &&
		(!isDialogOpen() &&(!isSpinnerActive()))) {

		window.setTimeout( function() {
			$("#btnBacktoTop").removeClass("btn-backtotop-hidden");
			$("#btnBacktoTop").addClass("btn-backtotop-visible");
		}, 100);
	}
	else{
		window.setTimeout( function() {
			$("#btnBacktoTop").removeClass("btn-backtotop-visible");
			$("#btnBacktoTop").addClass("btn-backtotop-hidden");
		}, 100);
	}
}

/**
 * Help
 */

/**
 * Sets the visibility of the help button
 */

function setBtnHelpVisibility(){

	if (!isDialogOpen() && (!isSpinnerActive())) {

		window.setTimeout( function() {
			$("#btnHelp").removeClass("btn-help-hidden");
			$("#btnHelp").addClass("btn-help-visible");
		}, 100);
	}
	else{
		window.setTimeout( function() {
			$("#btnHelp").removeClass("btn-help-visible");
			$("#btnHelp").addClass("btn-help-hidden");
		}, 100);
	}
}

/**
 * Sets the visibility of the side bar buttons
 */

function setBtnSidebarVisibility(){
	setBtnHelpVisibility();
	setBacktotopVisibility();
}

/**
 * document.ready
 */

$(function() {

	/**
	 *
	 * Events
	 *
	 */

	/**
	 * General events
	 */

	$(document).scroll(function() {
		setBtnSidebarVisibility();
	});

	$(window).resize(function() {
		setBtnSidebarVisibility();
	});

	/**
	 * Canvas events
	 */

	$("#sizePicker").submit( function(e){

		const canvasWidth = parseInt($("#inputWidth").val());
		const canvasHeight = parseInt($("#inputHeight").val());
		const canvasSize =[canvasWidth, canvasHeight];

		if (!canvasPropCorrect(canvasHeight, canvasWidth)){
			showInfoDialog("Information", `The proportions selected are not allowed: the max. allowed aspect ratio is 1:${canvasAspectRatio}.`, false);
		}
		else
		{
			const dialogMsg = `Are you sure that you want to create a new ${canvasWidth}x${canvasHeight} canvas?`;
			showConfirmDialog(dialogConfirmTitle, dialogMsg, false, createCanvasCheck, canvasSize);
		}

		e.preventDefault();

	});

	$("#btnLoadCanvas").click( function(){

		const dialogMsg = "Are you sure that you want to load a previously saved canvas?";
		showConfirmDialog(dialogConfirmTitle, dialogMsg, false, showFileDialog);

	});

	/*
	 Event delegation
	*/

	$( pixelCanvasSel ).on("mousedown", "td", function() {
		gbMouseIsDown=true;
		paintPixel(this);
	});

	$( pixelCanvasSel ).on("mouseover", "td", function() {
		if (gbMouseIsDown){
			paintPixel(this);
		}
	});

	$( pixelCanvasSel ).on("mouseenter", function() {

		$( this ).awesomeCursor(gbSelectedTool, {
			hotspot: [2, 15],
			color: cursorColor
		});

	});

	/**
	 * Resets the cursor and deletes unneeded divs created by jQuery Awesome Cursor.
   *
   * One div is created every time a cursor is shown.
   * By removing the divs, we keep the DOM cleaner and make the application faster
   * Beware: since the selector is neither id nor class,
   * this may produce unexpected results if other divs with the same style are used
   */

	$( pixelCanvasSel ).on("mouseleave", function() {

		$( this ).css('cursor', '');

		let invisibleViv = $( 'div[style="position: absolute; left: -9999px; top: -9999px;"]' );
		invisibleViv.remove();

	});

	/**
	 * In this case, we must use the document and not the canvas,
	 * because the user may release the mouse outside the canvas
	 */

	$(document).on("mouseup", function() {
		gbMouseIsDown=false;
	});


	/**
	 * Prevents dragging on already painted pixels,
	 * which otherwise may behave together like an image
	 */

	$( pixelCanvasSel ).on("dragstart", function (e) {
		e.preventDefault();
	});

	/**
	 * Action box events
	 */

	$("#btnResetCanvas").click(function() {
		if (isCanvasActive()){
			showConfirmDialog(dialogConfirmTitle, "Are you sure that you want to reset this canvas?", false, btnResetCanvasClick);
		}
	});

	$("#btnSaveCanvas").click( function(){
		if (isCanvasActive()){
			showConfirmDialog(dialogConfirmTitle, "Are you sure that you want to save this canvas?", false, saveCanvas);
		}
	});

	$("#btnExportCanvas").click( function(){
		if (isCanvasActive()){
			showConfirmDialog(dialogConfirmTitle, dialogConfirmExportText, true, exportCanvasWrapper);
		}
	});

	/**
	 * Toolbox events
	 */

	$("#btnToolBrush").click(function() {
		selectTool(toolBrush);
	});

	$("#btnToolEraser").click(function() {
		selectTool(toolEraser);
	});

	/**
	 * Back to top events
	 */

	$("#btnBacktoTop").click(function() {
		if (isCanvasActive()){
			scrollToToolboxTop();
		}
		else
		{
			scroll(0,0);
		}
	});

	/**
	 * Dialog events
	 */

	$( "#dialog" ).on( "dialogopen",
		function( ) {
			setBtnSidebarVisibility();
		}
	);

	$( "#dialog" ).on( "dialogclose",
		function( ) {
			setBtnSidebarVisibility();
		}
	);

	$("#dialog").on ("change", "#dialogStartUpHide",
		function( ) {

			try {
				if ($("#dialogNotShowAgain").is(":checked")){
					localStorage.setItem('dialogStartUpHide', true);
				}
				else
				{
					localStorage.setItem('dialogStartUpHide', false);
				}
			}
			catch(e) {
				showErrorDialog(dialogErrorTitle, `There was an error trying to access the local storage: ${e.message}`, false);
			}
		}
	);

	/**
	 * Help events
	 */

	$("#btnHelp").click(function() {
		showHelpDialog();
	});

	/**
	 *
	 * Initial calls
	 *
	 */

	if (!localStorage.dialogStartUpHide) {
		showStartUpDialog();
	}

	setUpPixelOdrom();
	createCanvas([$("#inputWidth").prop("defaultValue"), $("#inputHeight").prop("defaultValue")], false);
});