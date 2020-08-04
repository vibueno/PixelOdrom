const toolPaintBrush = 'paint-brush';
const toolEraser = 'eraser';
const toolEraserColor = '#ffffff'

let mouseIsDown = false;
let selectedTool = toolPaintBrush;


$(function() {


	function resetValues(){
		$('#inputHeight').val($('#inputHeight').prop("defaultValue"));
		$('#inputWidth').val($('#inputWidth').prop("defaultValue"));
		$('#colorPicker').val($('#colorPicker').prop("defaultValue"));
	}


	function createCanvas() {

		const gridHeight = $('#inputHeight').val();
		const gridWidth = $('#inputWidth').val();
		const grid = $ ('#pixelCanvas');
		const gridRows = $ ('#pixelCanvas tr');
		const row = '<tr></tr>';
		const column = '<td></td>';
		let lastRow;

		resetCanvas();

		for (let i=1; i<=gridHeight; i++){
			grid.append(row);
			lastRow = $('#pixelCanvas tr').last();

			for (let j=1; j<=gridWidth; j++){
				lastRow.append(column);
			}
		}
		showToolbox(true);
	}


	function resetCanvas(){
		const gridRows = $ ('#pixelCanvas tr');
		gridRows.remove();
	}


	function saveCanvas(){
		let pixelCanvas = $( "#pixelCanvas" );
		let resultDiv = $( "#result" );

		if (isCanvasActive()){

			html2canvas(pixelCanvas.get(0)).then(function (canvas) {
				let pixelImage = canvas.toDataURL("image/jpeg", 1);
				let downloadLink = $ ( '#downloadLink' );
				downloadLink.attr("href", pixelImage)
			}).then(function(){
				downloadLink.click();
			});
		}
	}


	function isCanvasActive(){
		return $('#pixelCanvas tr').length;
	}


	$('#btnSaveCanvas').click( saveCanvas );


	/*
	Creates the grid and prevents the form from submmiting,
	which would refresh the page and make the grid dissapear
	*/
	$('#sizePicker').submit( function(e){
		createCanvas();
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

	$('#btnResetCanvas').click(function() {
		resetCanvas();
		showToolbox(false);
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