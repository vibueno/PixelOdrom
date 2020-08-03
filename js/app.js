$(function() {
	function makeGrid() {

		const gridHeight = $('#inputHeight').val();
		const gridWidth = $('#inputWidth').val();
		const grid = $ ('#pixelCanvas');
		const gridRows = $ ('#pixelCanvas tr');
		const row = '<tr></tr>';
		const column = '<td></td>';
		let lastRow;

		gridRows.remove();

		for (let i=1; i<=gridHeight; i++){
			grid.append(row);
			lastRow = $('#pixelCanvas tr').last();

			for (let j=1; j<=gridWidth; j++){
				lastRow.append(column);
			}
		}
	}

	/*
	e.preventDefault() prevents the form from submmiting and therefore refreshing the page,
	which would make the grid dissapear
	*/
	$('#sizePicker').on('submit', function(e){
		makeGrid();
		e.preventDefault();
	});
});