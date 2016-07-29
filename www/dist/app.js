'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cell = function () {
	function Cell(type, relations, selectable) {
		_classCallCheck(this, Cell);

		this.type = type;
		this.relations = relations;
		this.selectable = selectable;
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

var DELAY = 50;

var BACTS = [{ name: 'b1', image: 'b1.png' }, { name: 'b2', image: 'b2.png' }, { name: 'b3', image: 'b3.png' }, { name: 'b4', image: 'b4.png' }, { name: 'b5', image: 'b5.png' }];

var CELL_TYPES = ['void', 'spawner', 'empty', 'bact'];
var BACTS_TYPES = CELL_TYPES.length;

var MATRIX = [];
var DIMMENSION = void 0;

function init() {
	// const txt = `[[{"type":"spawner","relations":[]},{"type":"spawner","relations":[]},{"type":"spawner","relations":[]},{"type":"spawner","relations":[]},{"type":"spawner","relations":[]},{"type":"spawner","relations":[]},{"type":"spawner","relations":[]}],[{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]}],[{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]}],[{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]}],[{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]}],[{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]}],[{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]},{"type":"empty","relations":[]}]]`;
	// MATRIX = JSON.parse(document.getElementById('setup-field').value);
	var matrix = JSON.parse(document.getElementById('setup-field').value);
	// const matrix = JSON.parse(txt);
	document.getElementById('setup-toolbar').style.display = 'none';
	DIMMENSION = matrix.length;

	for (var i = 0; i < DIMMENSION; i++) {
		MATRIX[i] = [];
		for (var j = 0; j < DIMMENSION; j++) {
			var newCell = new Cell(matrix[i][j].type, matrix[i][j].relations, matrix[i][j].selectable);
			MATRIX[i][j] = newCell;
			if (newCell.type === 'empty') {
				var newBactId = getRandomInt(0, BACTS_TYPES);
				MATRIX[i][j].lodge(BACTS[newBactId]);
			}
		}
	}
	renderTable();
	// fillEmptyCells('instant');
	// let moves = [];
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

var spawners = [];
var moves = [];
function fillEmptyCells(way) {
	moves = [];
	for (var i = DIMMENSION - 2; i > -1; i--) {
		//beginning from 2 row, cuz bact cant drop from first row
		for (var j = DIMMENSION - 1; j > -1; j--) {
			if (MATRIX[i][j].type !== 'bact') {
				if (MATRIX[i][j].type === 'spawner') {
					spawners.push({ col: j, row: i });
				}
				continue;
			}
			dropBact(i, j);
		}
	}

	spawn();

	if (way && way === 'instant') {
		renderTable();
	} else {
		animateBactsFalling();
	}
}

function spawn() {
	if (spawners.length === 0) {
		return;
	}

	var currentSpawner = spawners.shift();
	if (MATRIX[currentSpawner.row + 1][currentSpawner.col].type === 'empty') {
		var newBactId = getRandomInt(0, BACTS_TYPES);

		//spawn new bact under spawner
		MATRIX[currentSpawner.row + 1][currentSpawner.col].lodge(BACTS[newBactId]);
		moves.push({ from: null, to: currentSpawner.row + 1 + '_' + currentSpawner.col, bact: BACTS[newBactId] });
		dropBact(currentSpawner.row + 1, currentSpawner.col);
		if (MATRIX[currentSpawner.row + 1][currentSpawner.col].type === 'empty') {
			spawners.push(currentSpawner);
		}
	}

	spawn();
}

function animateBactsFalling() {
	if (!moves || moves.length === 0) {
		return;
	}
	var currentMove = moves.shift();
	if (currentMove.from) {
		document.getElementById(currentMove.from).style.outline = 'green 2px dotted';
	}
	// console.log(11, currentMove);
	setTimeout(_doAnimate, DELAY, currentMove);
}

function _doAnimate(move) {
	// console.log(move);
	if (move.from) {
		document.getElementById(move.from).style.outline = '';
		document.getElementById(move.from).innerHTML = '<img src="resources/images/' + CELL_IMAGES.empty + '">';
	}
	document.getElementById(move.to).innerHTML = '<img src="resources/images/' + move.bact.image + '">';

	setTimeout(animateBactsFalling, DELAY);
}

function dropBact(row, col) {
	if (!MATRIX[row + 1]) {
		//bottom row
		return;
	}
	// console.log(MATRIX[row][col]);
	if (MATRIX[row][col].relations.blocked.length > 0) {
		//bottom row
		return;
	}
	if (MATRIX[row + 1][col].type === 'empty') {
		moves.push({ from: row + '_' + col, to: row + 1 + '_' + col, bact: MATRIX[row][col].contains });
		MATRIX[row + 1][col].lodge(MATRIX[row][col].contains);
		MATRIX[row][col].exile();
		return dropBact(row + 1, col);
	}
	if (MATRIX[row + 1][col - 1] && MATRIX[row + 1][col - 1].type === 'empty') {
		if (MATRIX[row][col - 1].type === 'bact') {
			return;
		}
		moves.push({ from: row + '_' + col, to: row + 1 + '_' + (col - 1), bact: MATRIX[row][col].contains });
		MATRIX[row + 1][col - 1].lodge(MATRIX[row][col].contains);
		MATRIX[row][col].exile();

		return dropBact(row + 1, col - 1);
	}
	if (MATRIX[row + 1][col + 1] && MATRIX[row + 1][col + 1].type === 'empty') {
		if (MATRIX[row][col + 1].type === 'bact') {
			return;
		}
		moves.push({ from: row + '_' + col, to: row + 1 + '_' + (col + 1), bact: MATRIX[row][col].contains });
		MATRIX[row + 1][col + 1].lodge(MATRIX[row][col].contains);
		MATRIX[row][col].exile();
		return dropBact(row + 1, col + 1);
	}
	return;
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
}

var chain = {};
function markCell(cellId) {
	var cellIndexes = cellId.split('_');
	var cell = {
		x: parseInt(cellIndexes[0], 10),
		y: parseInt(cellIndexes[1], 10)
	};

	var currentCell = MATRIX[cell.x][cell.y];
	console.log('select: ', currentCell);
	if (!currentCell.selectable) {
		showBlockers(currentCell);
		return;
	}

	if (currentCell.type !== 'bact') {
		return;
	}
	if (!chain.type || chain.type !== currentCell.contains.name) {
		unmarkChain();
		chain = {
			type: currentCell.contains.name
		};
	}

	if (chain.type === currentCell.contains.name) {

		if (!chain.last) {
			chain.bacts = [cellId];
			chain.last = cellId;
			markChain();
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
			markChain();
		} else {
			unmarkChain();
			chain.bacts = [cellId];
			chain.last = cellId;
			markChain();
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

function markChain() {
	chain.bacts.forEach(function (cellId) {
		var color = cellId === chain.last ? 'red' : 'green';
		document.getElementById(cellId).style.outline = color + ' 2px dotted';
	});
}

function unmarkChain() {
	if (!chain.bacts || chain.bacts.length === 0) {
		return;
	}
	chain.bacts.forEach(function (cellId) {
		document.getElementById(cellId).style.outline = '';
	});
}

function releaseChain() {
	if (chain.bacts.length < 3) {
		return;
	}
	unmarkChain();
	chain.bacts.forEach(function (cellId) {
		var item = cellId.split('_');
		var corrdinates = {
			row: parseInt(item[0], 10),
			col: parseInt(item[1], 10)
		};
		var currentCell = MATRIX[corrdinates.row][corrdinates.col];
		if (currentCell.relations.blocks.length > 0) {
			releaseRelations(currentCell, corrdinates);
		}
		currentCell.exile();
		document.getElementById(cellId).innerHTML = '<img src="resources/images/' + CELL_IMAGES.empty + '">';
	});
	chain = {};
	fillEmptyCells();
}

function showBlockers(cell) {
	if (cell.relations.blocked && cell.relations.blocked.length > 0) {
		cell.relations.blocked.forEach(function (blocker) {
			var cellId = blocker.row + '_' + blocker.col;
			document.getElementById(cellId).style.outline = 'red 2px solid';
			setTimeout(function (cell) {
				document.getElementById(cellId).style.outline = '';
			}, 1000, cell);
		});
	}
}

/**
cell {Cell} - released cell in chain
cellCoordinates {row: number, col: number}

1. Мы храним все реализованные связи в виде стр_столб. Для того, чтобы не срабатывали одинаковые связи зи раз(если, например, яч. 4_6
имеет три ОДИНАКОВЫЕ связи, типа двойной цепи)
1. мы пробегаемся по массиву ячеек БЛОКИРУЕМЫХ "убитой" клеткой. Если таковая связь уже была, то пропускаем
2. Для каждой БЛОКИРОВАННОЙ клетки, из ЕЕ МАССИВА БЛОКИРУЮЩИХ находим соответствующий индекс блокера и удаляем его(блокер)
3. После этого(нахождения и удаления) - записываем ключ БЛОКИРОВАННОЙ ячейки В МАССИВЕ БЛОКЕРА и переходим к новой итерации по 
БЛОКИРОВАННЫМ
*/
function releaseRelations(cell, cellCoordinates) {
	var filteredRelations = [];

	var blockerKeys = []; //indexes of released relations for BLOCKER cell

	//iterate through BLOCKER relations
	_.forEach(cell.relations.blocks, function (relation, blockerKey) {

		//one unique relation per one chain release. E.g. if one cell have double(3/4/5..) relations to another(or same) cell
		//and was released, that will be destroyed only one of this relations
		var relationString = relation.row + '_' + relation.col;
		console.log(relationString);
		if (filteredRelations.indexOf(relationString) !== -1) {
			console.log('forbid');
			return;
		}
		console.log('pass');

		filteredRelations.push(relationString);
		var blockedCell = MATRIX[relation.row][relation.col];

		//list of all blockers for current blocked cell
		var blockedBy = blockedCell.relations.blocked;
		blockedBy.every(function (blocker, blockedKey) {
			if (_.isEqual(blocker, cellCoordinates)) {
				MATRIX[relation.row][relation.col].relations.blocked.splice(blockedKey, 1);
				if (MATRIX[relation.row][relation.col].relations.blocked.length === 0) {

					console.log('old', MATRIX[relation.row][relation.col].selectable);

					MATRIX[relation.row][relation.col].selectable = true;
					console.log('new', MATRIX[relation.row][relation.col].selectable);
				}
				blockerKeys.push(blockerKey);
				console.log('catch');
				return false;
			}
			return true;
		});
	});
	// MATRIX[cellCoordinates.row][cellCoordinates.col].relations.blocks = [];
	_.forEach(blockerKeys, function (key) {
		MATRIX[cellCoordinates.row][cellCoordinates.col].relations.blocks.splice(key, 1);
	});
}