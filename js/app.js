/*
*
* Constants
*
*/

const pixelCanvasSel = "#pixelCanvas";

const toolPaintBrush = "paint-brush";
const toolEraser = "eraser";

const canvasWidthThreshold1 = 25;
const canvasWidthThreshold2 = 50;
const canvasWidthThreshold3 = 75;

const canvasAspectRatio = 1.5;

const canvasCorrectionFactor = 1/1.2;

const smallestPixelClassRow = "tr-s";
const smallestPixelClassColumn = "td-s";

const cursorColor="#888888";

const row = "<tr></tr>";
const column = "<td></td>";

/*
*
* Globals
*
*/

let mouseIsDown = false;
let selectedTool = toolPaintBrush;

/*
*
* General
*
*/

function goToHomePage(){
	if (isCanvasActive()){
		showConfirmDialog("Confirm", "Leaving the page will reset the canvas. Do you want to proceed?" , false, setUpPixelOdrom);
	}
	else{
		setUpPixelOdrom();
	}
}


function setUpPixelOdrom(){
	resetValues();
	showToolbox(false);
	showActionbox(false);
	showCanvas(false);
}

/*
function getMainDivPositionTop(){
	const mainDivMarginTop = parseInt($(".main").css("marginTop").replace("px", ""));
	const mainDivPositionTop = $(".main").position().top + mainDivMarginTop;
	return mainDivPositionTop;
}
*/

/*
*
* Dialogs
*
*/

function showStartUpDialog(){

	const dialogTitle = 'Welcome to pixelOdrom';

	const toolBrushHTML = '<i class="fa fa-paint-brush"></i>';
	const toolEraserHTML = '<i class="fa fa-eraser"></i>';
	const createCanvasHTML = '<i class="fa fa-th"></i>';
	const saveCanvasHTML = '<i class="fa fa-floppy-o"></i>';
	const openCanvasHTML = '<i class="fa fa-folder-open"></i>';

	const dialogText = `<p class = "dialog-text-intro">pixelOdrom is a tool for creating pixel art.</p>
	<ul class="dialog-list">
		<li class="dialog-list-element">Create a new canvas &nbsp;${createCanvasHTML} or open an existing one &nbsp;${openCanvasHTML}</li>
		<li class="dialog-list-element">Choose a color with the picker and use the &nbsp;${toolBrushHTML} for painting pixels.
		<p class="dialog-list-text-below">If you are using a mouse, you can also paint pixel lines</p></li>
		<li class="dialog-list-element">By using the &nbsp;${toolEraserHTML}, you can erase pixels.
		<p class="dialog-list-text-below">If you are using a mouse, you can also delete multiple pixels in one go</p></li>
		<li class="dialog-list-element">Click on &nbsp;${saveCanvasHTML} to save your canvas to a local file pixelOdrom file (*.pix) to continue your work later</li>
	</ul>
`;

	$( "#dialog" ).attr('title', dialogTitle);

	$( "#dialog" ).first("p").html(dialogText);

	$( "#dialog" ).dialog({
		modal: true,
		buttons: {
    	"Get started!": function () {
        $(this).dialog("close");
      }
    },
    minWidth: "240"
  });
}


function showConfirmDialog(dialogTitle, dialogContent, isHTMLcontent, callback, callbackParams){

	$( "#dialog" ).dialog('option', 'title', dialogTitle);

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
      }
    }
  });
}


function showInfoDialog(dialogTitle, dialogContent, isHTMLcontent){

	$( "#dialog" ).dialog('option', 'title', dialogTitle);

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
    }
  });
}


function showFileDialog(){
	/*
	We need to trigger this event manually, since we are using
	a button to activate a hidden input file field
	*/
	$("#btnLoadCanvasInput").trigger("click");
}


function isDialogOpen(){
	if ($('#dialog').dialog('isOpen')){
		return true;
	}
	else
	{
		return false;
	}
}


/*
*
* Input fields
*
*/


function resetValues(){
	$("#inputWidth").val($("#inputWidth").prop("defaultValue"));
	$("#inputHeight").val($("#inputHeight").prop("defaultValue"));
	$("#colorPicker").val($("#colorPicker").prop("defaultValue"));
}

function setInputFieldValues(canvasWidth, canvasHeight){
	$("#inputWidth").val(canvasWidth);
	$("#inputHeight").val(canvasHeight);
}

/*
*
* Toolbox
*
*/

function getToolboxPositionTop(){
	const toolboxMarginTop = parseInt($("#toolbox").css("marginTop").replace("px", ""));
	const toolboxPositionTop = $("#toolbox").position().top + toolboxMarginTop;
	return toolboxPositionTop;
}


/*
*
* Canvas
*
*/

function showCanvas(show){

	const canvas = $ ( pixelCanvasSel );

	if (show){
		canvas.removeClass("pixel-canvas-hidden");
		canvas.addClass("pixel-canvas");
	}
	else
	{
		canvas.addClass("pixel-canvas-hidden");
		canvas.removeClass("pixel-canvas");
	}

}


function getCanvasNumPixelX(canvas){
	const canvasNumPixX = parseInt(canvas.find("tr:first td").length);

	return canvasNumPixX;
}

function getCanvasNumPixelY(canvas){
	const canvasNumPixY = parseInt(canvas.find("tr:first td").length);

	return canvasNumPixY;
}

function getCanvasNumPixel(canvas){
	const canvasNumPixX = getCanvasNumPixelX(canvas);
	const canvasNumPixY = getCanvasNumPixelY(canvas);

	const numpixels = canvasNumPixX*canvasNumPixY;

	return numpixels;
}


function setUpCanvas(canvasWidth, canvasHeight){

	const canvas = $ ( pixelCanvasSel );

	addPixelClass(canvas);

	showToolbox(true);
	showActionbox(true);
	selectTool(toolPaintBrush);
	showCanvas(true);

	setInputFieldValues(canvasWidth, canvasHeight);
}


function maxCanvasSize (){

	const canvas = $ ( pixelCanvasSel );

	const canvasBackup = canvas.clone();

	const availableWidth = parseInt($(".main").width());

	deleteCanvas();

	canvas.append(row);
	lastRow = $(pixelCanvasSel + " tr").last();

	lastRow.append(column);

	$(pixelCanvasSel + " tr").addClass(smallestPixelClassRow);
	$(pixelCanvasSel + " tr td").addClass(smallestPixelClassColumn);

	const pixelWidth = parseInt(canvas.find('tr:nth-child(1) > td').width());

	let maxCanvasWidth = availableWidth / pixelWidth;

	/*
	We use this correction factor, because otherwise for some reason,
	we are creating more pixels than we should for the available width
	*/
	maxCanvasWidth = Math.floor(maxCanvasWidth - Math.pow(maxCanvasWidth, canvasCorrectionFactor));

	let maxCanvasHeight = maxCanvasWidth*canvasAspectRatio;

	canvas.html(canvasBackup.html());

	return [maxCanvasWidth, maxCanvasHeight];

}


function createCanvasCheck(canvasSize) {

	const canvasWidth = canvasSize [0];
	const canvasHeight = canvasSize [1];

	let lastRow;

	let maxCanvasPixel = maxCanvasSize();

	if (canvasWidth > maxCanvasPixel[0] || canvasHeight >  maxCanvasPixel[1]){
		showCanvas(true);
		showConfirmDialog("Canvas too big", `The dimensions selected exceed the available space.
			Would you like to create the biggest possible canvas (width: ${maxCanvasPixel[0]}px, height: ${maxCanvasPixel[1]}px)?`,
			false,
			createCanvas, maxCanvasPixel);
	}
	else
	{
		createCanvas(canvasSize);
	}
}


function createCanvas(canvasSize){

	let canvas = $ ( pixelCanvasSel );

	const canvasWidth = canvasSize [0];
	const canvasHeight = canvasSize [1];

	deleteCanvas();

	for (let i=1; i<=canvasHeight; i++){
		canvas.append(row);
		lastRow = $(pixelCanvasSel + " tr").last();

		for (let j=1; j<=canvasWidth; j++){
			lastRow.append(column);
		}
	}

	setUpCanvas(canvasWidth, canvasHeight);
	scroll(0, getToolboxPositionTop());
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
	const canvas = $ (pixelCanvasSel);
	const canvasRows = $ (pixelCanvasSel + " tr");

	canvasRows.remove();
	showCanvas(false);
}


function resetCanvas(){
	const canvas = $ (pixelCanvasSel);
	canvas.find("tr td").removeAttr("style");
}


function saveCanvas(){

	const canvas = $(pixelCanvasSel);

	//We need to clone, so that we don"t modify the DOM
	const canvasToSave = canvas.clone();

	//removing classes since they are not needed
	canvasToSave.find("tr").removeAttr("class");
	canvasToSave.find("tr td").removeAttr("class");

	const canvasContent = canvasToSave.html();

  const blob = new Blob([canvasContent], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "canvas.pix");

}

function isValidCanvas(canvas){

	if (canvas.length>0){

		const canvasCheck = canvas.filter("tr").get(0);

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

	const canvas = $ (pixelCanvasSel);

	const file = input.files[0];
  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function(){

  	let readerResult = reader.result;
  	let canvasToImport= $(readerResult);

  	if (!isValidCanvas(canvasToImport)){
  		showInfoDialog("Wrong format", "The selected file does not contain a valid canvas.", false);
  	}
  	else
  	{

			const canvasWidth = canvasToImport.first().find("td").length;
			const canvasHeight = canvasToImport.length;

			let maxCanvasPixel = maxCanvasSize();

			if (canvasWidth > maxCanvasPixel[0] || canvasHeight >  maxCanvasPixel[1]){
				showInfoDialog("Canvas too big", "The selected canvas is too big for the available space. If you created this canvas on another device, please make sure you use a similar one to edit it.", false);
			}
			else
			{
				canvas.html(reader.result);
				setUpCanvas(canvasWidth, canvasHeight);

				$("#inputWidth").val(canvasWidth);
				$("#inputHeight").val(canvasHeight);
			}
		}

  };

  reader.onerror = function() {
    showInfoDialog("Error", `There was an error while trying to read the file: ${reader.error}`, false);
  };

  /*This call is needed in order to make the even onchange fire every time,
  even if the users selects the same file again
  */
  $("#btnLoadCanvasInput").prop("value", "");

}

function isCanvasActive(){
	return $(pixelCanvasSel + " tr").length;
}


function addPixelClass(canvas){

	canvasWidth = canvas.find ("tr:first td").length;

	switch(true) {
  case (canvasWidth>=canvasWidthThreshold1 && canvasWidth<=canvasWidthThreshold2):
  	canvas.find("tr").addClass("tr-l");
    canvas.find("td").addClass("td-l");
    break;
  case (canvasWidth>=canvasWidthThreshold2 && canvasWidth<=canvasWidthThreshold3):
  	canvas.find("tr").addClass("tr-m");
    canvas.find("td").addClass("td-m");
    break;
  case (canvasWidth>=canvasWidthThreshold3):
  	canvas.find("tr").addClass("tr-s");
    canvas.find("td").addClass("td-s");
    break;
  default:
  	canvas.find("tr").addClass("tr-xl");
    canvas.find("td").addClass("td-xl");
  }
}

function paintPixel(pixel){
	if ((selectedTool) == toolPaintBrush){
		$ ( pixel ).css( "background-color", $("#colorPicker").val());
	}
	else
	{
		$ ( pixel ).removeAttr("style");
	}
}


/*
*
* Toolbox
*
*/

function selectTool(tool){
	selectedTool = tool;

	switch(selectedTool) {
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
	};
}

/*
*
* Help
*
*/

function setBtnHelpVisibility(){

	if /*(($(window).scrollTop() >= getMainDivPositionTop()) &&*/
		(!isDialogOpen()) /*)*/ {

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
	};
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
			showConfirmDialog("Confirm", dialogMsg, false, createCanvasCheck, canvasSize);
		}

		e.preventDefault();

	});

	$("#btnLoadCanvas").click( function(e){

		const dialogMsg = "Are you sure that you want to load a previously saved canvas?";
		showConfirmDialog("Confirm", dialogMsg, false, showFileDialog);

	});


	$("#colorPicker").change( function(e){
		selectTool(toolPaintBrush);
	});


	/*
	Handling canvas events with delegation
	*/
	$( pixelCanvasSel ).on("mousedown", "td", function() {
		mouseIsDown=true;
		paintPixel(this);
	});

	$( pixelCanvasSel ).on("mouseover", "td", function() {
		if (mouseIsDown){
			paintPixel(this);
		}
	});

	$( pixelCanvasSel ).on("mouseover", function(e) {

		if (selectedTool==toolPaintBrush)
		{
			cursorHotspot=[2, 15];
		}
		else
		{
			cursorHotspot=[2, 15];
		}

		$( this ).awesomeCursor(selectedTool, {
			hotspot: cursorHotspot,
			color: cursorColor
		});

	});


	/*
	In this case, we must use the document and not the canvas,
	because the user may release the mouse outside the canvas
	*/
	$(document).on("mouseup", function() {
		mouseIsDown=false;
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
			showConfirmDialog("Confirm", "Are you sure that you want to reset this canvas?", false, btnResetCanvasClick);
		}
	});

	$("#btnSaveCanvas").click( function(){
		if (isCanvasActive()){
			showConfirmDialog("Confirm", "Are you sure that you want to save this canvas?", false, saveCanvas);
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
		function( event, ui ) {
			setBtnSidebarVisibility();
		}
	);

		$( "#dialog" ).on( "dialogclose",
		function( event, ui ) {
			setBtnSidebarVisibility();
		}
	);


	/*
	*
	* Help events
	*
	*/

	$("#btnHelp").click(function() {
		showStartUpDialog();
	});


	/*
	*
	* Initial calls
	*
	*/

	showStartUpDialog();
	setUpPixelOdrom();

	const canvasSizeDefault = [$("#inputWidth").prop("defaultValue"), $("#inputHeight").prop("defaultValue")];

	createCanvas(canvasSizeDefault);

});