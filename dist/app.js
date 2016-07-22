'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cell = function () {
	function Cell(type) {
		_classCallCheck(this, Cell);

		this.type = type;
		this.relations = [];
		this.contains = {};
	}

	_createClass(Cell, [{
		key: 'lodge',
		value: function lodge(bact) {
			this.type = 'bact';
			this.contains = bact;
		}
	}, {
		key: 'exile',
		value: function exile() {
			this.type = 'empty';
			this.contains = {};
		}
	}]);

	return Cell;
}();

var CELL_IMAGES = {
	empty: 'redactor-empty-cell.png',
	spawner: 'redactor-spawner-cell.png',
	void: 'redactor-void-cell.png'
};

var BACTS = [{ name: 'b1', image: 'b1.png' }, { name: 'b2', image: 'b2.png' }, { name: 'b3', image: 'b3.png' }, { name: 'b4', image: 'b4.png' }, { name: 'b5', image: 'b5.png' }];

var CELL_TYPES = ['void', 'spawner', 'empty', 'bact'];

var MATRIX = [];
var DIMMENSION = void 0;

function init() {
	var txt = '[[{"type":"spawner","relations":[]},{"type":"spawner","relations":[]},{"type":"spawner","relations":[]},{"type":"spawner","relations":[]},{"type":"spawner","relations":[]},{"type":"spawner","relations":[]},{"type":"spawner","relations":[]}],[{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]}],[{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]}],[{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]}],[{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"void","relations":[]},{"type":"empty","relations":[]},{"type":"void","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]}],[{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"spawner","relations":[]},{"type":"empty","relations":[]},{"type":"spawner","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]}],[{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]}]]';
	// MATRIX = JSON.parse(document.getElementById('setup-field').value);
	// const matrix = JSON.parse(document.getElementById('setup-field').value);
	var matrix = JSON.parse(txt);
	document.getElementById('setup-toolbar').style.display = 'none';
	DIMMENSION = matrix.length;

	for (var i = 0; i < DIMMENSION; i++) {
		MATRIX[i] = [];
		for (var j = 0; j < DIMMENSION; j++) {
			MATRIX[i][j] = new Cell(matrix[i][j].type);
		}
	}
	fillEmptyCells();
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function fillEmptyCells() {
	for (var i = DIMMENSION - 1; i > -1; i--) {
		top: for (var j = DIMMENSION - 1; j > -1; j--) {
			// console.log(MATRIX[i][j], MATRIX[i][j] !== 'empty');
			if (MATRIX[i][j].type !== 'empty') {
				continue;
			}
			//search spawner or bact above
			for (var row = i; row > -1; row--) {
				switch (MATRIX[row][j].type) {
					case 'empty':
						continue;
						break;
					case 'void':
						continue top;
						break;
					case 'bact':
						console.log(MATRIX[row][j]);
						MATRIX[i][j].lodge(MATRIX[row][j].contains);
						MATRIX[row][j].exile();
						continue top;
						break;
					case 'spawner':
						//spawn a new bact
						var newBactId = getRandomInt(0, BACTS.length);
						MATRIX[i][j].lodge(BACTS[newBactId]);
						continue top;
						break;
				}
			}
		}
	}
	renderTable();
}

function renderTable() {
	var tableString = '<table border="1" style="border: 1px solid;">';

	for (var i = 0; i < DIMMENSION; i++) {
		tableString += '<tr style="height: 25px;">';
		for (var j = 0; j < DIMMENSION; j++) {
			var img = MATRIX[i][j].type === 'bact' ? MATRIX[i][j].contains.image : CELL_IMAGES[MATRIX[i][j].type];

			var cellId = i + '_' + j;
			tableString += '\n\t\t\t<td style="width: 25px;" id="' + cellId + '" onclick="markCell(\'' + cellId + '\')">\n\t\t\t\t<img src="resources/images/' + img + '">\n\t\t\t</td>';
		}
		tableString += '</tr>';
	}

	tableString += '</table>';
	document.getElementById('matrix').innerHTML = tableString;

	if (chain.type) {
		chain.bacts.forEach(function (cellId) {
			var color = cellId === chain.last ? 'red' : 'green';
			document.getElementById(cellId).style.outline = color + ' 2px dotted';
		});
	}
}

var chain = {};
function markCell(cellId) {
	var cellIndexes = cellId.split('_');
	var cell = {
		x: parseInt(cellIndexes[0], 10),
		y: parseInt(cellIndexes[1], 10)
	};

	var currentCell = MATRIX[cell.x][cell.y];
	if (currentCell.type !== 'bact') {
		return;
	}
	if (!chain.type || chain.type !== currentCell.contains.name) {
		chain = {
			type: currentCell.contains.name
		};
		console.log('new');
	}

	if (chain.type === currentCell.contains.name) {

		if (!chain.last) {
			chain.bacts = [cellId];
			chain.last = cellId;
			renderTable();
			return;
		}

		if (chain.bacts.indexOf(cellId) >= 0) {
			releaseChain();
			return;
		}

		var lastInChain = chain.last.split('_');
		var lastCell = {
			x: parseInt(lastInChain[0], 10),
			y: parseInt(lastInChain[1], 10)
		};
		if (lastCell.x === cell.x && lastCell.y === cell.y + 1 || lastCell.x === cell.x && lastCell.y === cell.y - 1 || lastCell.y === cell.y && lastCell.x === cell.x + 1 || lastCell.y === cell.y && lastCell.x === cell.x - 1) {
			chain.bacts.push(cellId);
			chain.last = cellId;
			renderTable();
		} else {
			chain.bacts = [cellId];
			chain.last = cellId;
			renderTable();
			return;
		}
		// console.log(cell, lastCell);
	}

	// if (markCell.previous) {
	// 	document.getElementById(markCell.previous).style.outline = '';
	// }
	// markCell.previous = cellId;
	// console.dir(document.getElementById(cellId));

	// renderToolbox(cellId);
}

function releaseChain() {
	if (chain.bacts.length < 3) {
		return;
	}
	chain.bacts.forEach(function (cellId) {
		var item = cellId.split('_');
		var lastCell = {
			x: parseInt(item[0], 10),
			y: parseInt(item[1], 10)
		};
		var currentCell = MATRIX[lastCell.x][lastCell.y];
		currentCell.exile();
		chain = {};
		fillEmptyCells();
	});
}