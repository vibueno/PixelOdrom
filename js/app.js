/*
*
* Constants
*
*/

const pixelCanvasSel = '#pixelCanvas';

const toolPaintBrush = 'paint-brush';
const toolEraser = 'eraser';

const numPixelThreshold1 = 50;
const numPixelThreshold2 = 100;
const numPixelThreshold3 = 500;

const cursorColor='#888888';

const row = '<tr></tr>';
const column = '<td></td>';

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

function setUpPixelOdrom(){
	resetValues();
	showToolbox(false);
	showActionbox(false);
}

/*
*
* Dialogs
*
*/

function showConfirmDialog(title, text, callback){

	$( '#dialog' ).attr('title', title);
	$( '#dialog' ).first('p').text(text);

	$( '#dialog' ).dialog({
		modal: true,
		buttons: {
    	'Yes': function () {
        $(this).dialog('close');
        callback();
      },
      'No': function () {
        $(this).dialog('close');
      }
    }
  });
}


function showInfoDialog(title, text){

	$( '#dialog' ).attr('title', title);
	$( '#dialog' ).first('p').text(text);

	$( '#dialog' ).dialog({
		modal: true,
		buttons: {
    	'OK': function () {
        $(this).dialog('close');
      }
    }
  });
}

function showFileDialog(){
	/*
	We need to trigger this event manually, since we are using
	a button to activate a hidden input file field
	*/
	$('#btnLoadCanvasInput').trigger('click');
}


/*
*
* Input fields
*
*/


function resetValues(){
	$('#inputWidth').val($('#inputWidth').prop('defaultValue'));
	$('#inputHeight').val($('#inputHeight').prop('defaultValue'));
	$('#colorPicker').val($('#colorPicker').prop('defaultValue'));
}


/*
*
* Canvas
*
*/

function getCanvasNumPixelX(canvas){
	const canvasNumPixX = parseInt(canvas.find('tr:first td').length);

	return canvasNumPixX;
}

function getCanvasNumPixelY(canvas){
	const canvasNumPixY = parseInt(canvas.find('tr:first td').length);

	return canvasNumPixY;
}

function getCanvasNumPixel(canvas){
	const canvasNumPixX = getCanvasNumPixelX(canvas);
	const canvasNumPixY = getCanvasNumPixelY(canvas);

	const numpixels = canvasNumPixX*canvasNumPixY;

	return numpixels;
}

function setUpCanvas(){

	const canvas = $ ( pixelCanvasSel );

	addPixelClass(canvas);

	showToolbox(true);
	showActionbox(true);
	selectTool(toolPaintBrush);
	canvas.removeClass('pixel-canvas-hidden');
	canvas.addClass('pixel-canvas');
}

function enoughSpaceForCanvas(canvasNumPixX, canvasNumPixY){

	const canvas = $ ( pixelCanvasSel );

	const bodyWidth = parseInt($('body').css('width').replace('px', ''));

	deleteCanvas();

	canvas.append(row);
	lastRow = $(pixelCanvasSel + ' tr').last();
	for (i=1;i<canvasNumPixX;i++){
		lastRow.append(column);
	}

	addPixelClass(canvas);

	const pixelWidth = parseInt(canvas.find('tr td:first-child').first().css('height').replace('px', ''));

	if (pixelWidth*canvasNumPixX > bodyWidth-100){
		deleteCanvas();
		return false;
	}
	else
	{
		deleteCanvas();
		return true;
	}
}

function createCanvas() {

	const canvas = $ ( pixelCanvasSel );
	let lastRow;

	const canvasNumPixX = parseInt($('#inputWidth').val());
	const canvasNumPixY = parseInt($('#inputHeight').val());

	const numpixels = parseInt($('#inputHeight').val());


	if (!enoughSpaceForCanvas(canvasNumPixX, canvasNumPixY)){
		deleteCanvas();
		setUpPixelOdrom();
		showInfoDialog('Canvas too big', 'The selected canvas is too big for the available space.');
	}
	else
	{

		deleteCanvas();

		for (let i=1; i<=canvasNumPixY; i++){
			canvas.append(row);
			lastRow = $(pixelCanvasSel + ' tr').last();

			for (let j=1; j<=canvasNumPixX; j++){
				lastRow.append(column);
			}
		}

		setUpCanvas(numpixels);

	}
}


function canvasPropCorrect(width, height){

	const proportions = width/height;

	if (proportions>=0.5 && proportions <=2){
		return true;
	}
	else{
		return false;
	}

}

function deleteCanvas(){
	const canvas = $ (pixelCanvasSel);
	const canvasRows = $ (pixelCanvasSel + ' tr');

	canvasRows.remove();
	canvas.addClass('pixel-canvas-hidden');
	canvas.removeClass('pixel-canvas');
}


function resetCanvas(){
	const canvas = $ (pixelCanvasSel);
	canvas.find('tr td').removeAttr('style');
}


function saveCanvas(){

	const canvas = $(pixelCanvasSel);

	//We need to clone, so that we don't modify the DOM
	const canvasToSave = canvas.clone();

	//removing classes since they are not needed
	canvasToSave.find('tr').removeAttr('class');
	canvasToSave.find('tr td').removeAttr('class');

	const canvasContent = canvasToSave.html();

  const blob = new Blob([canvasContent], {type: 'text/plain;charset=utf-8'});
  saveAs(blob, 'canvas.pix');

}

function isValidCanvas(canvas){

	if (canvas.length>0){

		const canvasCheck = canvas.filter('tr').get(0);

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
  		showInfoDialog('Wrong format', 'The selected file does not contain a valid canvas.');
  	}
  	else
  	{
	  	canvas.html(canvasToImport);

	  	if (!enoughSpaceForCanvas(getCanvasNumPixelX(canvas), getCanvasNumPixelY(canvas))){
				deleteCanvas();
				setUpPixelOdrom();
				showInfoDialog('Canvas too big', 'The selected canvas is too big for the available space.');
			}
			else
			{
				canvas.html(reader.result);
				setUpCanvas();
				$('#inputWidth').val(getCanvasNumPixelX(canvas));
				$('#inputHeight').val(getCanvasNumPixelY(canvas));
			}
		}

  };

  reader.onerror = function() {
    showInfoDialog('Error', `There was an error while trying to read the file: ${reader.error}`);
  };

  /*This call is needed in order to make the even onchange fire every time,
  even if the users selects the same file again
  */
  $('#btnLoadCanvasInput').prop('value', '');

}

function isCanvasActive(){
	return $(pixelCanvasSel + ' tr').length;
}


function addPixelClass(canvas){

	const numpixels = getCanvasNumPixel(canvas);

	switch(true) {
  case (numpixels>=numPixelThreshold1 && numpixels<=numPixelThreshold2):
  	canvas.find('tr').addClass('tr-l');
    canvas.find('td').addClass('td-l');
    break;
  case (numpixels>=numPixelThreshold2 && numpixels<=numPixelThreshold3):
  	canvas.find('tr').addClass('tr-m');
    canvas.find('td').addClass('td-m');
    break;
  case (numpixels>=numPixelThreshold3):
  	canvas.find('tr').addClass('tr-s');
    canvas.find('td').addClass('td-s');
    break;
  default:
  	canvas.find('tr').addClass('tr-xl');
    canvas.find('td').addClass('td-xl');

  }
}

function paintPixel(pixel){
	if ((selectedTool) == toolPaintBrush){
		$ ( pixel ).css( 'background-color', $('#colorPicker').val());
	}
	else
	{
		$ ( pixel ).removeAttr('style');
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
	  	$( '#btnToolEraser').removeClass('btn-pressed');
	    $( '#btnToolPaintBrush').addClass('btn-pressed');
	    break;
	  case toolEraser:
	  	$( '#btnToolPaintBrush').removeClass('btn-pressed');
	  	$( '#btnToolEraser').addClass('btn-pressed');
	    break;
	}

}


function showToolbox(show){
	if (show){
		$('#toolbox').removeClass('toolbox-hidden');
	}
	else
	{
		$('#toolbox').addClass('toolbox-hidden');
	}
}


/*
*
* Action box
*
*/

function showActionbox(show){
	if (show){
		$('#actionbox').removeClass('actionbox-hidden');
	}
	else
	{
		$('#actionbox').addClass('actionbox-hidden');
	}
}

function btnResetCanvasClick(){
	resetCanvas();
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
	* Canvas events
	*
	*/


	$('#sizePicker').submit( function(e){

		const canvasWidth = $('#inputWidth').val();
		const canvasHeight = $('#inputHeight').val();

		if (!canvasPropCorrect(canvasHeight, canvasWidth)){
			showInfoDialog('Information', 'The proportions selected are not allowed: canvas height cannot be more than twice the width and vice versa.');
		}
		else
		{
			const dialogMsg = `Are you sure that you want to create a new ${canvasWidth}x${canvasHeight} canvas?`;
			showConfirmDialog('Confirm', dialogMsg, createCanvas);
		}

		e.preventDefault();

	});

	$('#btnLoadCanvas').click( function(e){

		const dialogMsg = 'Are you sure that you want to load a previously saved canvas?';
		showConfirmDialog('Confirm', dialogMsg, showFileDialog);

	});


	$('#colorPicker').change( function(e){
		selectTool(toolPaintBrush);
	});


	/*
	Handling canvas events with delegation
	*/
	$( pixelCanvasSel ).on('mousedown', 'td', function() {
		mouseIsDown=true;
		paintPixel(this);
	});

	$( pixelCanvasSel ).on('mouseover', 'td', function() {
		if (mouseIsDown){
			paintPixel(this);
		}
	});

	$( pixelCanvasSel ).on('mouseover', function(e) {

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
	$(document).on('mouseup', function() {
		mouseIsDown=false;
	});


	/*
	Prevents dragging on already painted pixels,
	which otherwise may behave together like an image
	*/
	$( pixelCanvasSel ).on('dragstart', function (e) {
		e.preventDefault();
	});


	/*
	*
	* Action box events
	*
	*/

	$('#btnResetCanvas').click(function() {
		if (isCanvasActive()){
			showConfirmDialog('Confirm', 'Are you sure that you want to reset this canvas?', btnResetCanvasClick);
		}
	});

	$('#btnSaveCanvas').click( function(){
		if (isCanvasActive()){
			showConfirmDialog('Confirm', 'Are you sure that you want to save this canvas?', saveCanvas);
		}
	});


	/*
	*
	* Toolbox events
	*
	*/

	$('#btnToolPaintBrush').click(function() {
		selectTool(toolPaintBrush);
	});


	$('#btnToolEraser').click(function() {
		selectTool(toolEraser);
	});


	/*
	*
	* Initial calls
	*
	*/
	setUpPixelOdrom();

});