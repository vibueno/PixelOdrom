$(function() {

	let mouseIsDown = false;

	function resetValues(){

		$('#inputHeight').val($('#inputHeight').prop("defaultValue"));
		$('#inputWidth').val($('#inputWidth').prop("defaultValue"));
		$('#colorPicker').val($('#colorPicker').prop("defaultValue"));

	}

	function resetCanvas(){
		const gridRows = $ ('#pixelCanvas tr');
		gridRows.remove();
	}

	function makeGrid() {

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
	}


	$('#btnSaveCanvas').click(function(){

	 	let pixelCanvas = $( "#pixelCanvas" );
		let resultDiv = $( "#result" );

    html2canvas(pixelCanvas.get(0)).then(function (canvas) {
      let pixelImage = canvas.toDataURL("image/jpeg", 1);
      let downloadLink = $ ( '#downloadLink' );
      downloadLink.attr("href", pixelImage)
		}).then(function(){
			downloadLink.click();
		});
  });

	/*
	Creates the grid and prevents the form from submmiting,
	which would refresh the page and make the grid dissapear
	*/
	$('#sizePicker').submit( function(e){
		makeGrid();
		e.preventDefault();
	});


	/*
	Handling canvas events with delegation
	*/

	$('#pixelCanvas').on('mousedown', 'td', function() {
		$ ( this ).css( "background-color", $('#colorPicker').val());
		mouseIsDown=true;
	});

	$('#pixelCanvas').on('mouseover', 'td', function() {
		if (mouseIsDown){
			$ ( this ).css( "background-color", $('#colorPicker').val());
		}
	});

	/*
	In this case, we must use the document and not the canvas,
	because the user may release the mouse outside the canvas
	*/
	$(document).on('mouseup', function() {
		mouseIsDown=false;
	});


	/*
	Prevents dragging on already painting pixels,
	which otherwise may behave together like an image
	*/
	$('#pixelCanvas').on('dragstart', function (e) {
    e.preventDefault();
	});


	$('#btnResetCanvas').click(function() {
		resetCanvas();
	});

	resetValues();

});