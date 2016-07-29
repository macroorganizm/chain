'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cell = function () {
	function Cell() {
		_classCallCheck(this, Cell);

		this.type = 'empty';
		this.relations = {
			blocks: [],
			blocked: []
		};
		this.selectable = true;
	}

	_createClass(Cell, [{
		key: 'block',
		value: function block(blockedCell) {
			this.relations.blocks.push(blockedCell);
		}
	}, {
		key: 'blockedBy',
		value: function blockedBy(blockerCell) {
			this.relations.blocked.push(blockerCell);
		}
	}, {
		key: 'setSelectable',
		value: function setSelectable(isSelectable) {
			this.selectable = isSelectable;
		}
	}]);

	return Cell;
}();

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
			var cellId = getCellId(i, j);
			tableString += '\n\t\t\t<td style="width: 25px;" id="' + cellId + '" onclick="markCell(\'' + cellId + '\')">\n\t\t\t\t<img src="resources/images/' + CELL_IMAGES[MATRIX[i][j].type] + '">\n\t\t\t</td>';
		}
		tableString += '</tr>';
	}

	tableString += '</table>';
	document.getElementById('matrix').innerHTML = tableString;
}

var relationSetter = {
	isActive: false,
	blockerChain: {}
};
function markCell(cellId) {
	var cellIndexes = cellId.split('_');
	var cell = {
		row: parseInt(cellIndexes[0], 10),
		col: parseInt(cellIndexes[1], 10)
	};

	if (relationSetter.isActive) {
		setRelation(relationSetter.blockerChain, { row: cell.row, col: cell.col });
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
	var curentCell = MATRIX[cell.row][cell.col];
	console.log(curentCell);
	var toolboxString = '<ul>';

	CELL_TYPES.forEach(function (type) {
		var selection = curentCell.type === type ? 'checked' : '';
		toolboxString += '<li>\n\t\t\t<input type="radio" name="tool" ' + selection + ' value=\'' + type + '\' \n\t\t\t\tonclick="changeCellType(' + cell.row + ', ' + cell.col + ', this.value)">' + type + '</li>';
		// console.log(type, selection);
	});

	toolboxString += '</ul>';
	toolboxString += '<button onclick="toggleRelationSetter(' + cell.row + ', ' + cell.col + ')">Block</button>';
	toolboxString += '<button onclick="toggleSelectable(' + cell.row + ', ' + cell.col + ', true)">Set clickable</button>';
	toolboxString += '<button onclick="toggleSelectable(' + cell.row + ', ' + cell.col + ', false)">Deny clickable</button>';

	toolboxString += '<p>IS selectable: ' + curentCell.selectable + '</p>';
	toolboxString += '<p><b>Blocks:</b></p>';
	_.forEach(curentCell.relations.blocks, function (blockedCell, index) {
		toolboxString += '<p>\n\t\t\t' + blockedCell.row + '_' + blockedCell.col + '\n\t\t\t<button onclick="showCell(' + blockedCell.row + ', ' + blockedCell.col + ')">Show</button>\n\t\t\t<button onclick="removeBlock(' + cell.row + ', ' + cell.col + ', ' + index + ')">Remove Block</button>\n\t\t</p>';
	});

	toolboxString += '<p><b>Blocked by:</b></p>';
	_.forEach(curentCell.relations.blocked, function (blockerCell) {
		toolboxString += '<p>\n\t\t\t' + blockerCell.row + '_' + blockerCell.col + '\n\t\t\t<button onclick="showCell(' + blockerCell.row + ', ' + blockerCell.col + ')">Show</button>\n\t\t</p>';
	});

	document.getElementById('toolbar').innerHTML = toolboxString;
}

function showCell(row, col) {
	var cellId = getCellId(row, col);
	document.getElementById(cellId).style.outline = 'red 2px solid';
	setTimeout(function () {
		document.getElementById(cellId).style.outline = '';
	}, 1000);
}

function removeBlock(row, col, index) {
	var blockedCellCoordinates = MATRIX[row][col].relations.blocks[index];
	var blockerCellCoordinates = { row: row, col: col };

	var blockedCell = MATRIX[blockedCellCoordinates.row][blockedCellCoordinates.col];

	//list of all blockers for current blocked cell
	var blockedBy = blockedCell.relations.blocked;
	blockedBy.every(function (blocker, key) {
		if (_.isEqual(blocker, blockerCellCoordinates)) {
			MATRIX[blockedCellCoordinates.row][blockedCellCoordinates.col].relations.blocked.splice(key, 1);
			MATRIX[row][col].relations.blocks.splice(index, 1);
			return false;
		}
		return true;
	});
}

function getCellId(row, col) {
	return row + '_' + col;
}

function toggleRelationSetter(row, col) {
	if (relationSetter.isActive) {
		relationSetter.isActive = false;
		relationSetter.blockerChain = {};
		return;
	}
	relationSetter.isActive = true;
	relationSetter.blockerChain = { row: row, col: col };
}

function toggleSelectable(row, col, isSelectable) {
	MATRIX[row][col].setSelectable(isSelectable);
}

function setRelation(blocker, blocked, isStable) {
	MATRIX[blocker.row][blocker.col].block({ row: blocked.row, col: blocked.col });
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