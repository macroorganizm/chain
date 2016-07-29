'use strict'

class Cell {
	constructor() {
		this.type = 'empty';
		this.relations = {
			blocks: [],
			blocked: []
		};
		this.selectable = true;
	}
	block(blockedCell) {
		this.relations.blocks.push(blockedCell);
	}
	blockedBy(blockerCell) {
		this.relations.blocked.push(blockerCell);
	}
	setSelectable(isSelectable) {
		this.selectable = isSelectable;
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
			const cellId = getCellId(i, j);
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

let relationSetter = {
	isActive: false,
	blockerChain: {}
};
function markCell(cellId) {
	const cellIndexes = cellId.split('_');
	const cell = {
		row: parseInt(cellIndexes[0], 10),
		col: parseInt(cellIndexes[1], 10)
	};

	if (relationSetter.isActive) {
		setRelation(relationSetter.blockerChain, {row: cell.row, col: cell.col});
		toggleRelationSetter();
		return;
	}

	if (markCell.previous) {
		document.getElementById(markCell.previous).style.outline = '';
	}
	markCell.previous = cellId;
	document.getElementById(cellId).style.outline = 'green 2px dotted';
	renderToolbox(cell);
}

function renderToolbox(cell) {
	// const cellIndexes = cellId.split('_');
	// const cell = {
	// 	row: parseInt(cellIndexes[0], 10),
	// 	col: parseInt(cellIndexes[1], 10)
	// };
	const curentCell = MATRIX[cell.row][cell.col];
	console.log(curentCell);
	let toolboxString = '<ul>';

	CELL_TYPES.forEach((type) => {
		const selection = (curentCell.type === type) ? 'checked' : '';
		toolboxString += `<li>
			<input type="radio" name="tool" ${selection} value='${type}' 
				onclick="changeCellType(${cell.row}, ${cell.col}, this.value)">${type}</li>`;
		// console.log(type, selection);
	});

	toolboxString += '</ul>';
	toolboxString += `<button onclick="toggleRelationSetter(${cell.row}, ${cell.col})">Block</button>`
	toolboxString += `<button onclick="toggleSelectable(${cell.row}, ${cell.col}, true)">Set clickable</button>`
	toolboxString += `<button onclick="toggleSelectable(${cell.row}, ${cell.col}, false)">Deny clickable</button>`

	toolboxString += `<p>IS selectable: ${curentCell.selectable}</p>`;
	toolboxString += `<p><b>Blocks:</b></p>`;
	_.forEach(curentCell.relations.blocks, (blockedCell, index) => {
		toolboxString += `<p>
			${blockedCell.row}_${blockedCell.col}
			<button onclick="showCell(${blockedCell.row}, ${blockedCell.col})">Show</button>
			<button onclick="removeBlock(${cell.row}, ${cell.col}, ${index})">Remove Block</button>
		</p>`;
	});

	toolboxString += `<p><b>Blocked by:</b></p>`;
	_.forEach(curentCell.relations.blocked, (blockerCell) => {
		toolboxString += `<p>
			${blockerCell.row}_${blockerCell.col}
			<button onclick="showCell(${blockerCell.row}, ${blockerCell.col})">Show</button>
		</p>`;
	});



	document.getElementById('toolbar').innerHTML = toolboxString;
}

function showCell(row, col) {
	const cellId = getCellId(row, col);
	document.getElementById(cellId).style.outline = 'red 2px solid';
	setTimeout(() => {
		document.getElementById(cellId).style.outline = '';
	}, 1000);
}

function removeBlock(row, col, index) {
	const blockedCellCoordinates = MATRIX[row][col].relations.blocks[index];
	const blockerCellCoordinates = {row, col};

	const blockedCell = MATRIX[blockedCellCoordinates.row][blockedCellCoordinates.col];

		//list of all blockers for current blocked cell
		const blockedBy = blockedCell.relations.blocked;
		blockedBy.every((blocker, key) => {
			if (_.isEqual(blocker, blockerCellCoordinates)) {
				MATRIX[blockedCellCoordinates.row][blockedCellCoordinates.col].relations.blocked.splice(key, 1);
				MATRIX[row][col].relations.blocks.splice(index, 1);
				return false;
			}
			return true;
		});

}

function getCellId(row, col) {
	return `${row}_${col}`;
}

function toggleRelationSetter(row, col) {
	if (relationSetter.isActive) {
		relationSetter.isActive = false;
		relationSetter.blockerChain = {};
		return;
	}
	relationSetter.isActive = true;
	relationSetter.blockerChain = {row, col};
}

function toggleSelectable(row, col, isSelectable) {
	MATRIX[row][col].setSelectable(isSelectable);
}

function setRelation(blocker, blocked, isStable) {
	MATRIX[blocker.row][blocker.col].block({row: blocked.row, col: blocked.col});
	MATRIX[blocked.row][blocked.col].blockedBy(blocker);
}

function changeCellType(cellX, cellY, newType) {
	MATRIX[cellX][cellY].type = newType;
	renderTable();
}

function generateGameSetup() {
	document.getElementById('toolbar').innerHTML = '';
	document.getElementById('matrix').innerHTML = JSON.stringify(MATRIX);
}
