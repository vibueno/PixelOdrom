$(function() {

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

	/*
	e.preventDefault() prevents the form from submmiting, which would refresh the page,
	and make the grid dissapear
	*/
	$('#sizePicker').submit( function(e){
		makeGrid();
		e.preventDefault();
	});


	//Handling click event with event delegation
	$('#pixelCanvas').on('click', 'td', function() {
		$ ( this ).css( "background-color", $('#colorPicker').val());
	});


	$('#reset').click(function() {
		resetCanvas();
	});

	resetValues();

});