/*
*
* Constants
*
*/

const pixelCanvasSel = "#pixelCanvas";

const toolPaintBrush = "paint-brush";
const toolEraser = "eraser";

const BlankPixelColor = "#fff";

const canvasAspectRatio = 1.5;

/*
Since canvas can be resized and we are using % for the sizes,
these pixel limits are only used for calculating the % of the main
div that the canvas will take, so that pixels don't get too big or too small
*/

const minPixelSize = 10; // in CSS pixels
const maxPixelSize = 15; // in CSS pixels

const maxCanvasWithPO = 100;

const pixelPaddingCorrection = 10/100;

const cursorColor = "#888888";

const row = "<tr></tr>";
const column = '<td class="pixel"></td>';

/*
*
* Dialog constants
*
*/

const toolBrushHTML = '<i class="fa fa-paint-brush"></i>';
const toolEraserHTML = '<i class="fa fa-eraser"></i>';
const createCanvasHTML = '<i class="fa fa-th"></i>';
const saveCanvasHTML = '<i class="fa fa-floppy-o"></i>';
const openCanvasHTML = '<i class="fa fa-folder-open"></i>';


const dialogHelpTitle = 'pixelOdrom help';

const dialogHelpText =  `<p class = "dialog-text-intro">pixelOdrom is a web tool for drawing pixel art.</p>
<ul class="dialog-list">
	<li class="dialog-list-element">Create a new canvas &nbsp;${createCanvasHTML} or open an existing one &nbsp;${openCanvasHTML}</li>
	<li class="dialog-list-element">Choose a color with the picker and use the &nbsp;${toolBrushHTML} for painting pixels.
	<p class="dialog-list-text-below">If you are using a mouse, you can also draw pixel lines.</p></li>
	<li class="dialog-list-element">By using the &nbsp;${toolEraserHTML}, you can erase pixels.
	<p class="dialog-list-text-below">If you are using a mouse, you can also erase multiple pixels in one stroke.</p></li>
	<li class="dialog-list-element">Click on &nbsp;${saveCanvasHTML} to save your canvas to a local pixelOdrom file (*.pix) to continue your work later (note that every time you save the canvas, a new file will be created).</li>
</ul>`;

const dialogStartUpTitle = 'Welcome to pixelOdrom';

const dialogStartUpText = dialogHelpText + `<p>
	<input type="checkbox" id="dialogStartUpHide">
	<label for="dialogStartUpHide">I am already a pixelOdrom master. Don't show this again!</label>
</p>
`;

const dialogConfirmTitle = "Confirm";
const dialogErrorTitle = "Error";


/*
*
* Globals
*
*/

let gbMouseIsDown = false;
let gbSelectedTool = toolPaintBrush;

let gbSelectedColor = "#000"

let gbCanvas;

let gbCurrentCanvasMaxWidthPO; //in pixelOdrom pixels
let gbCurrentCanvasMaxHeightPO; //in pixelOdrom pixels

let gbCurrentCanvasWidthPO; //in pixelOdrom pixels
let gbCurrentCanvasHeightPO; //in pixelOdrom pixels

let gbMainWidthPx; //In CSS pixels

let gbCurrentCanvasWidth; //%


/*
*
* General
*
*/

function CSSPixelToNumber(CSSValue){
	 return parseInt(CSSValue.replace("px", ""));
}

function setGlobals(){

	gbCurrentCanvasWidthPO = parseInt($("#inputWidth").val());
	gbCurrentCanvasHeightPO = parseInt($("#inputHeight").val());

	gbMainWidthPx = parseInt($(".main").width());

	gbCurrentCanvasMaxWidthPO = Math.min(Math.floor(gbMainWidthPx/minPixelSize), maxCanvasWithPO);
	gbCurrentCanvasMaxHeightPO = Math.floor(gbCurrentCanvasMaxWidthPO*canvasAspectRatio);

	gbCanvas = $ ( pixelCanvasSel );

}

function goToHomePage(){
	if (isCanvasActive()){
		showConfirmDialog(dialogConfirmTitle, "Leaving the page will reset the canvas. Do you want to proceed?" , false, setUpPixelOdrom);
	}
	else{
		setUpPixelOdrom();
	}
}


function setUpPixelOdrom(){
	resetInputFieldValues();
	setGlobals();
	showToolbox(false);
	showActionbox(false);
	setBtnSidebarVisibility();
	showCanvas(false);
}

/*
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
  }).parent().removeClass("ui-state-error");;
}


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


function showFileDialog(){
	/*
	We need to trigger this event manually, since we are using
	a button to activate a hidden input file field
	*/
	$("#btnLoadCanvasInput").trigger("click");
}


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


/*
*
* Input fields
*
*/


function resetInputFieldValues(){
	$("#inputWidth").val($("#inputWidth").prop("defaultValue"));
	$("#inputHeight").val($("#inputHeight").prop("defaultValue"));

	InitializeColorPicker("#000");
}

function setInputFieldValues(canvasWidth, canvasHeight){
	$("#inputWidth").val(canvasWidth);
	$("#inputHeight").val(canvasHeight);
}

function InitializeColorPicker(inputColor){

	gbSelectedColor = inputColor;

	$("#colorPicker").spectrum({
	    color: inputColor,
	    replacerClassName: "btnColorPicker",
			change: function(color) {
        gbSelectedColor = color.toHexString();
        selectTool(toolPaintBrush);
    }
	});
}

/*
*
* Toolbox
*
*/

function getToolboxPositionTop(){
	const toolboxMarginTop = CSSPixelToNumber($("#toolbox").css("marginTop"));
	const toolboxPositionTop = $("#toolbox").position().top + toolboxMarginTop;
	return toolboxPositionTop;
}


/*
*
* Canvas
*
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

function setUpCanvas(canvasWidthPO, canvasHeightPO){

	let canvasCSSWidth;
	let pixelSize;

	const pixelBorderSize = CSSPixelToNumber($ (".pixel").css("border-left-width"));
	const totalBordersSize = pixelBorderSize * gbCurrentCanvasHeightPO;
	const maxCanvasWidthPx = gbMainWidthPx-totalBordersSize;

	setGlobals();

	/*
	Here we calculate the % of the space available that we will use for the canvas,
	so that the pixels have a reasonable size.
	Otherwise:
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
	selectTool(toolPaintBrush);
	showCanvas(true);

}

function setUpPixel(maxCanvasWidthPx){

	const maxCanvasWidthPercent = (maxCanvasWidthPx/gbMainWidthPx)*100;

	let pixelWidth = maxCanvasWidthPercent/gbCurrentCanvasWidthPO;

	let padding = pixelWidth;
	padding = padding - padding*pixelPaddingCorrection;

	gbCanvas.find(".pixel").width(pixelWidth+"%");
	gbCanvas.find(".pixel").css("padding-bottom", padding+"%");

}


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
			createCanvas, maxCanvasPixel);
	}
	else
	{
		createCanvas(canvasSize);
	}
}


function createCanvas(canvasSize, scrollToCanvas=true){

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
}


function canvasPropCorrect(width, height){

	const proportions = width/height;

	if (proportions>=(canvasAspectRatio/4) && proportions <=canvasAspectRatio){
		return true;
	}
	else{
		return false;
	}

}

function deleteCanvas(){

	const canvasRows = $ (pixelCanvasSel + " tr");

	canvasRows.remove();
	showCanvas(false);
}


function resetCanvas(){
	gbCanvas.find(".pixel").css("background-color", BlankPixelColor);
}


function saveCanvas(){

	//We need to clone the canvas, so that we don"t modify the DOM
	const canvasToSave = gbCanvas.clone();

	//removing styles since they should be calculated when loading
	canvasToSave.find('tr td').css("width", "");
	canvasToSave.find('tr td').css("padding-bottom", "");

	const canvasContent = canvasToSave.html();

  const blob = new Blob([canvasContent], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "canvas.pix");

}

function exportCanvas(){
	alert("TODO");
}


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
					showInfoDialog("Canvas too big", "The selected canvas is too big for the available space. If you created this canvas on another device, please make sure you use a similar one to edit it.", false);

				}
				else
				{
					gbCanvas.html(reader.result);
					$("#inputWidth").val(canvasWidth);
					$("#inputHeight").val(canvasHeight);

					setUpCanvas(canvasWidth, canvasHeight);

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

  /*This call is needed in order to make the even onchange fire every time,
  even if the users selects the same file again
  */
  $("#btnLoadCanvasInput").prop("value", "");

}

function isCanvasActive(){
	return $(pixelCanvasSel + " tr").length;
}

function paintPixel(pixel){
	if ((gbSelectedTool) == toolPaintBrush){
		$ ( pixel ).css( "background-color", gbSelectedColor);
	}
	else
	{
		$ ( pixel ).css( "background-color", BlankPixelColor);
	}
}


/*
*
* Toolbox
*
*/

function selectTool(tool){
	gbSelectedTool = tool;

	switch(gbSelectedTool) {
	  case toolPaintBrush:
	  	$( "#btnToolEraser").removeClass("btn-pressed");
	    $( "#btnToolPaintBrush").addClass("btn-pressed");
	    break;
	  case toolEraser:
	  	$( "#btnToolPaintBrush").removeClass("btn-pressed");
	  	$( "#btnToolEraser").addClass("btn-pressed");
	    break;
	}

}


function showToolbox(show){
	if (show){
		$("#toolbox").removeClass("toolbox-hidden");
	}
	else
	{
		$("#toolbox").addClass("toolbox-hidden");
	}
}


/*
*
* Action box
*
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

function btnResetCanvasClick(){
	resetCanvas();
}

/*
*
* Side bar buttons
*
*/

/*
*
* Back to top
*
*/

function setBacktotopVisibility(){

	if ((($( window ).height() + $(window).scrollTop()) >= ($("body").outerHeight()/1.25)) &&
		(getToolboxPositionTop()<=$(window).scrollTop()) && isCanvasActive() &&
		(!isDialogOpen())) {

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

/*
*
* Help
*
*/

function setBtnHelpVisibility(){

	if (!isDialogOpen()) {

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

function setBtnSidebarVisibility(){
	setBtnHelpVisibility();
	setBacktotopVisibility();
}

/*
*
* document.ready
*
*/

$(function() {

	/*
	*
	* Events
	*
	*/

	/*
	*
	* General events
	*
	*/

	$(document).scroll(function() {
		setBtnSidebarVisibility();
	});

	$(window).resize(function() {
		setBtnSidebarVisibility();
	});

	/*
	*
	* Canvas events
	*
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
	Handling canvas events with delegation
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

	$( pixelCanvasSel ).on("mouseover", function() {

		let cursorHotspot;

		if (gbSelectedTool==toolPaintBrush)
		{
			cursorHotspot=[2, 15];
		}
		else
		{
			cursorHotspot=[2, 15];
		}

		$( this ).awesomeCursor(gbSelectedTool, {
			hotspot: cursorHotspot,
			color: cursorColor
		});

	});


	/*
	In this case, we must use the document and not the canvas,
	because the user may release the mouse outside the canvas
	*/
	$(document).on("mouseup", function() {
		gbMouseIsDown=false;
	});


	/*
	Prevents dragging on already painted pixels,
	which otherwise may behave together like an image
	*/
	$( pixelCanvasSel ).on("dragstart", function (e) {
		e.preventDefault();
	});


	/*
	*
	* Action box events
	*
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
			showConfirmDialog(dialogConfirmTitle, "Are you sure that you want to export this canvas as an image?", false, exportCanvas);
		}
	});


	/*
	*
	* Toolbox events
	*
	*/

	$("#btnToolPaintBrush").click(function() {
		selectTool(toolPaintBrush);
	});


	$("#btnToolEraser").click(function() {
		selectTool(toolEraser);
	});

	/*
	*
	* Back to top events
	*
	*/

	$("#btnBacktoTop").click(function() {
		if (isCanvasActive()){
			scroll(0, getToolboxPositionTop());
		}
		else
		{
			scroll(0,0);
		}
	});


	/*
	*
	* Dialog events
	*
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


	/*
	*
	* Help events
	*
	*/

	$("#btnHelp").click(function() {
		showHelpDialog();
	});


	/*
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