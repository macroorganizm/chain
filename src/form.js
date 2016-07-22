'use strict'

class Cell {
	constructor() {
		this.type = 'empty';
		this.relations = [];
	}
}

const CELL_IMAGES = {
	empty: 'redactor-empty-cell.png',
	spawner: 'redactor-spawner-cell.png',
	void: 'redactor-void-cell.png'
};

const CELL_TYPES = ['void', 'spawner', 'empty'];

let MATRIX = [];
let DIMMENSION;

function init() {
	DIMMENSION = parseInt(window.prompt('Input side dimmension(cells)'), 10);
	// DIMMENSION = 5;
	
	for (let i = 0; i < DIMMENSION; i++) {
		MATRIX[i] = [];
		for (let j = 0; j < DIMMENSION; j++) {
			MATRIX[i][j] = new Cell();
		}
	}
	renderTable();
}

function renderTable() {
	let tableString = '<table border="1" style="border: 1px solid;">'

	for (let i = 0; i < DIMMENSION; i++) {
		tableString += '<tr style="height: 25px;">';
		for (let j = 0; j < DIMMENSION; j++) {
			const cellId = `${i}_${j}`;
			tableString += `
			<td style="width: 25px;" id="${cellId}" onclick="markCell('${cellId}')">
				<img src="resources/images/${CELL_IMAGES[MATRIX[i][j].type]}">
			</td>`;
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
	const cellIndexes = cellId.split('_');
	const cell = {
		x: parseInt(cellIndexes[0], 10),
		y: parseInt(cellIndexes[1], 10)
	};
	const curentCell = MATRIX[cell.x][cell.y];

	let toolboxString = '<ul>';

	CELL_TYPES.forEach((type) => {
		const selection = (curentCell.type === type) ? 'checked' : '';
		toolboxString += `<li>
			<input type="radio" name="tool" ${selection} value='${type}' 
				onclick="changeCellType(${cell.x}, ${cell.y}, this.value)">${type}</li>`;
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
