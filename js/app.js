$(function() {

	const pixelCanvasSel = '#pixelCanvas';

	const toolPaintBrush = 'paint-brush';
	const toolEraser = 'eraser';
	const toolEraserColor = '#ffffff';

	const numPixelThreshold1 = 50;
	const numPixelThreshold2 = 100;
	const numPixelThreshold3 = 500;

	let mouseIsDown = false;
	let selectedTool = toolPaintBrush;

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
	    	"Yes": function () {
	        $(this).dialog('close');
	        callback();
	      },
	      "No": function () {
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
	    	"OK": function () {
	        $(this).dialog('close');
	      }
	    }
	  });
	}


	/*
	*
	* Input fields
	*
	*/


	function resetValues(){
		$('#inputWidth').val($('#inputWidth').prop("defaultValue"));
		$('#inputHeight').val($('#inputHeight').prop("defaultValue"));
		$('#colorPicker').val($('#colorPicker').prop("defaultValue"));
	}


	/*
	*
	* Canvas
	*
	*/

	function createCanvas() {

		const canvasNumPixX = parseInt($('#inputWidth').val());
		const canvasNumPixY = parseInt($('#inputHeight').val());

		const numpixels = canvasNumPixX*canvasNumPixY;
		const canvas = $ ( pixelCanvasSel );
		const row = '<tr></tr>';
		const column = '<td></td>';
		let lastRow;

		resetCanvas();

		canvas.append(row);
		lastRow = $(pixelCanvasSel + ' tr').last();
		lastRow.append(column);

		addPixelClass(canvas, numpixels);

		const pixelWidth = parseInt(canvas.find("tr td:first-child").first().css("height").replace('px', ''));
		const bodyWidth = parseInt($("body").css("width").replace('px', ''));

		console.log(pixelWidth);
		console.log(canvasNumPixX);
		console.log(bodyWidth-60);

		if (pixelWidth*canvasNumPixX > bodyWidth-100){
			showInfoDialog("Canvas too big", "The selected canvas is too big for the available space.");
			resetCanvas();
		}
		else
		{

			resetCanvas();

			for (let i=1; i<=canvasNumPixY; i++){
				canvas.append(row);
				lastRow = $(pixelCanvasSel + ' tr').last();

				for (let j=1; j<=canvasNumPixX; j++){
					lastRow.append(column);
				}
			}

			addPixelClass(canvas, numpixels);

			showToolbox(true);
			showActionbox(true);
			selectedTool = toolPaintBrush;
			canvas.removeClass('pixel-canvas-hidden');
			canvas.addClass('pixel-canvas');
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


	function resetCanvas(){
		const canvas = $ (pixelCanvasSel);
		const canvasRows = $ (pixelCanvasSel + ' tr');

		canvasRows.remove();
		canvas.addClass('pixel-canvas-hidden');
		canvas.removeClass('pixel-canvas');
	}


	function saveCanvas(){

		canvasContent = $(pixelCanvasSel).html();
		console.log (canvasContent);

    const blob = new Blob([canvasContent], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "canvas.pix");

	}

	function loadCanvas(){
		$("#btnCreateCanvasInput").trigger('click');
	}


	function readTextFile(file)
	{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
      if(rawFile.readyState === 4)
      {
        if(rawFile.status === 200 || rawFile.status == 0)
        {
          var allText = rawFile.responseText;
          alert(allText);
        }
      }
    }
    rawFile.send(null);
	}

	function isCanvasActive(){
		return $(pixelCanvasSel + ' tr').length;
	}

	$('#btnSaveCanvas').click( function(){
		if (isCanvasActive()){
			showConfirmDialog("Confirm", "Are you sure that you want to save this canvas?", saveCanvas);
		}
	});

	function addPixelClass(canvas, numpixels){

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
			$ ( pixel ).css( "background-color", $('#colorPicker').val());
		}
		else
		{
			$ ( pixel ).css( "background-color", toolEraserColor);
		}
	}

	/*
	*
	* Toolbox
	*
	*/

	function selectTool(tool){
		selectedTool = tool;
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
		showToolbox(false);
		showActionbox(false);
	}

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


	/*
	Creates the canvas and prevents the form from submmiting,
	which would refresh the page and make the canvas dissapear
	*/

	$('#btnCreateCanvas').click( function(e){

		const canvasWidth = $('#inputWidth').val();
		const canvasHeight = $('#inputHeight').val();

		if (!canvasPropCorrect(canvasHeight, canvasWidth)){
			showInfoDialog('Information', 'The proportions selected are not allowed. Canvas height cannot be more than double the width and vice versa.');
		}
		else
		{
			const dialogMsg = `Are you sure that you want to create a new ${canvasWidth}x${canvasHeight} canvas?`;
			showConfirmDialog("Confirm", dialogMsg, createCanvas);
		}

	});

	$('#btnLoadCanvas').click( function(e){

		const dialogMsg = "Are you sure that you want to load a previously saved canvas?";
		showConfirmDialog("Confirm", dialogMsg, loadCanvas);

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

	$( pixelCanvasSel ).on('mouseover', function() {
		$( this ).awesomeCursor(selectedTool, {
			hotspot: [2, 15]
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
			showConfirmDialog("Confirm", "Are you sure that you want to reset this canvas?", btnResetCanvasClick);
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

	resetValues();
	showToolbox(false);
	showActionbox(false);

});


$("i").click(function () {

});

$('input[type="file"]').on('change', function() {
  var val = $(this).val();
  $(this).siblings('span').text(val);
})