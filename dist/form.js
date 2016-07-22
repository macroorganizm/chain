'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cell = function Cell() {
	_classCallCheck(this, Cell);

	this.type = 'empty';
	this.relations = [];
};

var CELL_IMAGES = {
	empty: 'redactor-empty-cell.png',
	spawner: 'redactor-spawner-cell.png',
	void: 'redactor-void-cell.png'
};

var CELL_TYPES = ['void', 'spawner', 'empty'];

var MATRIX = [];
var DIMMENSION = void 0;

function init() {
	DIMMENSION = parseInt(window.prompt('Input side dimmension(cells)'), 10);
	// DIMMENSION = 5;

	for (var i = 0; i < DIMMENSION; i++) {
		MATRIX[i] = [];
		for (var j = 0; j < DIMMENSION; j++) {
			MATRIX[i][j] = new Cell();
		}
	}
	renderTable();
}

function renderTable() {
	var tableString = '<table border="1" style="border: 1px solid;">';

	for (var i = 0; i < DIMMENSION; i++) {
		tableString += '<tr style="height: 25px;">';
		for (var j = 0; j < DIMMENSION; j++) {
			var cellId = i + '_' + j;
			tableString += '\n\t\t\t<td style="width: 25px;" id="' + cellId + '" onclick="markCell(\'' + cellId + '\')">\n\t\t\t\t<img src="resources/images/' + CELL_IMAGES[MATRIX[i][j].type] + '">\n\t\t\t</td>';
		}
		tableString += '</tr>';
	}

	tableString += '</table>';
	document.getElementById('matrix').innerHTML = tableString;
}

function markCell(cellId) {
	if (markCell.previous) {
		document.getElementById(markCell.previous).style.outline = '';
	}
	markCell.previous = cellId;
	console.dir(document.getElementById(cellId));
	document.getElementById(cellId).style.outline = 'green 2px dotted';
	renderToolbox(cellId);
}

function renderToolbox(cellId) {
	var cellIndexes = cellId.split('_');
	var cell = {
		x: parseInt(cellIndexes[0], 10),
		y: parseInt(cellIndexes[1], 10)
	};
	var curentCell = MATRIX[cell.x][cell.y];

	var toolboxString = '<ul>';

	CELL_TYPES.forEach(function (type) {
		var selection = curentCell.type === type ? 'checked' : '';
		toolboxString += '<li>\n\t\t\t<input type="radio" name="tool" ' + selection + ' value=\'' + type + '\' \n\t\t\t\tonclick="changeCellType(' + cell.x + ', ' + cell.y + ', this.value)">' + type + '</li>';
		// console.log(type, selection);
	});

	toolboxString += '</ul>';

	document.getElementById('toolbar').innerHTML = toolboxString;
}

function changeCellType(cellX, cellY, newType) {
	MATRIX[cellX][cellY].type = newType;
	renderTable();
}

function generateGameSetup() {
	document.getElementById('toolbar').innerHTML = '';
	document.getElementById('matrix').innerHTML = JSON.stringify(MATRIX);
}