'use strict';
localStorage.clear();

// BUTTON CLICKS
function cellClicked(elCell) {
	var curCoord = getCellCoord(elCell.id);
	// PLACING THE MINE
	if (gIsManually) {
		// Check if there is already a mine in this cell
		if (elCell.classList.contains('unopened')) {
			addClassMine(elCell);
			// Add a mines
			addMine(curCoord, true);
			// Updating the number of mines remain to place
			var minesRemain = gMines - gMinesLocations.length;

			elManuallyCreate.querySelector('span').innerText = `${
				minesRemain ? `${minesRemain} mines remain` : 'Touch a cell to start'
			}`;
		}
		return;
	}
	// The game has NOT STARTED yet
	if (!gGame.isOn && gGame.shownCount) return;
	gTurn++;
	// HINT mode
	if (gHints.isOn) {
		numOfNeighbor(gBoard, curCoord.i, curCoord.j, true);

		setTimeout(() => {
			gHints.isOn = false;
			undoClicked();
		}, 1000);
		return;
	}
	// TO START the game
	if (!gGame.isOn) startGame(curCoord, gMinesLocations.length === 0);
	// Curr cell
	var curCell = gBoard[curCoord.i][curCoord.j];
	console.log(curCell);
	// If there is a flag where we clicked
	if (curCell.isMarked) return;
	// If there is a MINE in the chosen cell
	if (curCell.isMine && !curCell.isShown) {
		stepOnMine(elCell, curCell, curCoord);
		return;
	}
	openCells(curCoord.i, curCoord.j);
}
// HINT CLICK function
function hintClicked() {
	// Check if there is any hints left or if the game already started
	if (!gHints.hints.length || !gGame.isOn) return;
	// Removing the hint
	gHints.hints.pop();
	// Updating the DOM
	elHints.innerText = `${gHints.hints.join(' ')}`;
	// Up
	gHints.isOn = true;
}
// SAFE CLICK function
function safeClickClicked() {
	if (!safeClickedCount || !gGame.isOn) return;
	elSafeClickAmount.innerText = `${--safeClickedCount} remain`;
	if (!safeClickedCount) elSafeClickAmount.style.color = `#d00000`;

	var idx = randomInt(unopenedLocations.length - 1, 0);

	var coord = unopenedLocations[idx];

	var el = document.querySelector(`${getSelector(coord)}`);
	el.style.backgroundColor = `red`;
	setTimeout(() => {
		el.style.backgroundColor = HIDDEN_COLOR;
	}, 1000);
}
// UNDO
function undoClicked() {
	if (!gGame.isOn || !gTurn) return;

	var prevMoves = gMoves[gTurn];
	for (var idx = 0; idx < prevMoves.length; idx++) {
		var { i, j } = prevMoves[idx];
		document.querySelector(getSelector({ i, j })).classList.add('unopened');
		gBoard[i][j].isShown = false;
		gGame.shownCount--;
		// MINE in the prev location
		if (gBoard[i][j].isMine) {
			gLives.push('❤️');
			elLives.innerText = gLives.join(' ');
		}
	}
	// Delete the property
	delete gMoves[gTurn];
	//
	gTurn--;
}
// 7 BOOM!
function sevenBoom() {
	gIsSevenBoom = true;
	init();
}
// MANUALLY CREATE function
function manuallyCreate() {
	gIsManually = true;
	elManuallyCreate.querySelector('span').innerText = `${
		gMines - gMinesLocations.length
	} mines remain`;
}
// RIGHT CLICK
function addMarked(elCell, e) {
	e.preventDefault();
	if (!gGame.isOn) return;
	var coord = getCellCoord(elCell.id);
	var cell = gBoard[coord.i][coord.j];
	if (cell.isShown) return;
	cell.isMarked = cell.isMarked ? false : true;
	if (cell.isMarked && cell.isMine) gNumMarked++;
	if (!cell.isMarked && cell.isMine) gNumMarked--;
	// Add/remove the img
	elCell.innerHTML = cell.isMarked ? MARKED_IMG : '';
	elCell.classList.toggle('marked');
	// Wining
	if (
		gNumMarked === gMines ||
		gNumMarked + document.querySelectorAll('.mine').length === gMines
	)
		gameOver(true);
}
////////////////////////////////
// OPEN
// OPEN CELLS
function openCells(i, j) {
	// Check
	if (isNotLegal(i, j)) return;

	var curCell = gBoard[i][j];
	// SHOW the current cell
	showACell(document.querySelector(getSelector({ i, j })), curCell, i, j);

	// if its not an empty cell
	if (curCell.minesAroundCount) return;

	openCells(i - 1, j) ||
		openCells(i, j - 1) ||
		openCells(i + 1, j) ||
		openCells(i, j + 1) ||
		openCells(i + 1, j + 1) ||
		openCells(i - 1, j + 1) ||
		openCells(i - 1, j - 1) ||
		openCells(i + 1, j - 1);
}
// START
function startGame(coord, isRegularStart) {
	if (isRegularStart) {
		// Removing the first cell from the empty array
		removeFromTheArray(coord, gEmptyPlaces);
		// creating an array that holds the bombs coords
		gMinesLocations = addMines(gIsSevenBoom);
		// updating the unopened array
		unopenedLocations = gEmptyPlaces.slice();
	}

	createBoard();
	renderBoard();
	gGame.isOn = true;
	// Removing the option of manually create
	elManuallyCreate.classList.add('hidden');

	// Start the timer
	renderTimer(new Date());
}
// GAME OVER
function gameOver(win = false) {
	clearInterval(timerInterval);
	gGame.isOn = false;
	elRestartBtn.innerText = win ? gGameModes.win : gGameModes.lose;
	if (win) {
		saveLocalScore(gGame.secsPassed, gLevel);
	}
	elRestartBtn.classList.add('end');
	elRestartBtn.addEventListener('animationend', () =>
		elRestartBtn.classList.remove('end')
	);
}
// MINES FUNCTIONS
function addMines(isSevenBoom = false) {
	const minesLocations = [];
	var copyEmpty = gEmptyPlaces.slice();
	var len = isSevenBoom ? copyEmpty.length : gMines;

	for (var idx = 0; idx < len; idx++) {
		var curIdx;
		if (isSevenBoom) {
			var i = copyEmpty[idx].i;
			var j = copyEmpty[idx].j;
			if (
				(i - 1) % 7 !== 0 &&
				(j - 1) % 7 !== 0 &&
				!('' + i + '' + j).includes('7')
			) {
				continue;
			}
			curIdx = idx;
			addMine({ i, j }, true);
		} else {
			curIdx = randomInt(gEmptyPlaces.length - 1, 0);
			addMine(gEmptyPlaces[curIdx]);
			gEmptyPlaces.splice(curIdx, 1);
		}
	}
	gIsSevenBoom = false;
	return minesLocations;
}

// ADD MINE
function addMine(coord, toRemove = false) {
	gMinesLocations.push(coord);
	//Updating
	gBoard[coord.i][coord.j].isMine = true;
	// Removing from the array
	toRemove && removeFromTheArray(coord, gEmptyPlaces);

	if (gMinesLocations.length === gMines && gIsManually) {
		gIsManually = false;
		unopenedLocations = gEmptyPlaces.slice();

		// Removing the mark class
		var elMine = document.querySelectorAll('.mine');
		// Removing classes
		for (var i = 0; i < elMine.length; i++) {
			elMine[i].classList.remove('mine');
			elMine[i].classList.add('unopened');
		}
	}
}
function stepOnMine(elCell, cell, coords) {
	// Removing one life
	gLives.pop();
	// ADD classes
	addClassMine(elCell);
	if (!gLives.length) {
		gameOver();

		return;
	}
	var minesRevealed = document.querySelectorAll('.mine').length;
	elRestartBtn.innerText = `${gGameModes.minesSteps[minesRevealed]}`;

	gMoves[gTurn] = [{ i: coords.i, j: coords.j }];

	if (gNumMarked + minesRevealed === gMines && gNumMarked !== 0) {
		gameOver(true);
	}

	cell.isShown = true;
	gGame.shownCount++;
	elLives.innerText = `${gLives.join(' ')}`;
}
////////////////////////////////////////////////////////////////////////////////////////
// Create HINTS OBJ
function createHintObj() {
	return { hints: `💡 💡 💡`.split(' '), isOn: false };
}
// REMOVE an item from an array by
function removeFromTheArray(coord, arr) {
	for (var idx = 0; idx < arr.length; idx++) {
		var curCell = arr[idx];
		if (curCell.i !== coord.i || coord.j !== curCell.j) continue;
		return arr.splice(idx, 1);
	}
}

function isNotLegal(i, j) {
	return (
		i < 0 ||
		j < 0 ||
		i >= gBoard.length ||
		j >= gBoard[0].length ||
		gBoard[i][j].isMine ||
		gBoard[i][j].isShown ||
		gBoard[i][j].isMarked
	);
}
function addClassMine(el) {
	el.classList.remove('unopened');
	el.classList.add('mine');
}

function showACell(elCell, cell, i, j) {
	if (cell.isShown) return;
	elCell.classList.remove('unopened');
	// Updating the current cell isShown to true
	cell.isShown = true;
	// Updating the amount of cells that shown
	gGame.shownCount++;
	//Remove
	removeFromTheArray({ i, j }, unopenedLocations);
	// Update moves
	if (!gMoves[gTurn]) gMoves[gTurn] = [];
	gMoves[gTurn].push({ i, j });
}
