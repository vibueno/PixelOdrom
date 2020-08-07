const toolPaintBrush = 'paint-brush';
const toolEraser = 'eraser';
const toolEraserColor = '#ffffff';

const numPixelThreshold1 = 50;
const numPixelThreshold2 = 100;
const numPixelThreshold3 = 500;
const numPixelThreshold4 = 1000;

let mouseIsDown = false;
let selectedTool = toolPaintBrush;


$(function() {

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

	function resetValues(){
		$('#inputWidth').val($('#inputWidth').prop("defaultValue"));
		$('#inputHeight').val($('#inputHeight').prop("defaultValue"));
		$('#colorPicker').val($('#colorPicker').prop("defaultValue"));
	}


	function createCanvas(height, width) {

		const canvasWidth = $('#inputWidth').val();
		const canvasHeight = $('#inputHeight').val();

		const numpixels = canvasWidth*canvasHeight;
		const canvas = $ ('#pixelCanvas');
		const canvasRows = $ ('#pixelCanvas tr');
		const row = '<tr></tr>';
		const column = '<td></td>';
		let lastRow;

		resetCanvas();

		for (let i=1; i<=canvasHeight; i++){
			canvas.append(row);
			lastRow = $('#pixelCanvas tr').last();

			for (let j=1; j<=canvasWidth; j++){
				lastRow.append(column);
			}
		}

		switch(true) {
		  case (numpixels>=numPixelThreshold1 && numpixels<=numPixelThreshold2):
		  	canvas.find('tr').addClass('tr-l');
		    canvas.find('td').addClass('td-l');
		    break;
		  case (numpixels>=numPixelThreshold2 && numpixels<=numPixelThreshold3):
		  	canvas.find('tr').addClass('tr-m');
		    canvas.find('td').addClass('td-m');
		    break;
		  case (numpixels>=numPixelThreshold3 && numpixels<=numPixelThreshold4):
		  	canvas.find('tr').addClass('tr-s');
		    canvas.find('td').addClass('td-s');
		    break;
		  case (numpixels>numPixelThreshold4):
		  	canvas.find('tr').addClass('tr-xs');
		    canvas.find('td').addClass('td-xs');
		    break;
		  default:
		  	canvas.find('tr').addClass('tr-xl');
		    canvas.find('td').addClass('td-xl');
		}

		showToolbox(true);
		selectedTool = toolPaintBrush;
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
		const canvasRows = $ ('#pixelCanvas tr');
		canvasRows.remove();
	}


	function saveCanvas(){
		let pixelCanvas = $( "#pixelCanvas" );
		let resultDiv = $( "#result" );

		html2canvas(pixelCanvas.get(0)).then(function (canvas) {
			let pixelImage = canvas.toDataURL("image/jpeg", 1);
			let downloadLink = $ ( '#downloadLink' );
			downloadLink.attr("href", pixelImage)
		}).then(function(){
			downloadLink.click();
		});
	}


	function isCanvasActive(){
		return $('#pixelCanvas tr').length;
	}

	$('#btnSaveCanvas').click( function(){
		if (isCanvasActive()){
			showConfirmDialog("Confirm", "Are you sure that you want to save this canvas?", saveCanvas);
		}
	});


	/*
	Creates the canvas and prevents the form from submmiting,
	which would refresh the page and make the canvas dissapear
	*/

	$('#sizePicker').submit( function(e){

		const canvasWidth = $('#inputWidth').val();
		const canvasHeight = $('#inputHeight').val();

		if (!canvasPropCorrect($('#inputHeight').val(), $('#inputWidth').val())){
			showInfoDialog('Information', 'The proportions selected are not allowed. Canvas height cannot be more than double the width and vice versa.');
		}
		else
		{
			const dialogMsg = `Are you sure that you want to create a new ${canvasWidth}x${canvasHeight} canvas?`;
			showConfirmDialog("Confirm", dialogMsg, createCanvas);
		}

		e.preventDefault();

	});


	$('#colorPicker').change( function(e){
		selectTool(toolPaintBrush);
	});


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
	Handling canvas events with delegation
	*/
	$('#pixelCanvas').on('mousedown', 'td', function() {
		mouseIsDown=true;
		paintPixel(this);
	});

	$('#pixelCanvas').on('mouseover', 'td', function() {
		if (mouseIsDown){
			paintPixel(this);
		}
	});

	$('#pixelCanvas').on('mouseover', function() {
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
	$('#pixelCanvas').on('dragstart', function (e) {
		e.preventDefault();
	});


	function btnResetCanvasClick(){
		resetCanvas();
		showToolbox(false);
	}

	$('#btnResetCanvas').click(function() {
		if (isCanvasActive()){
			showConfirmDialog("Confirm", "Are you sure that you want to reset this canvas?", btnResetCanvasClick);
		}
	});

	$('#btnToolPaintBrush').click(function() {
		selectTool(toolPaintBrush);
	});

	$('#btnToolEraser').click(function() {
		selectTool(toolEraser);
	});

	resetValues();
	showToolbox(false);

});