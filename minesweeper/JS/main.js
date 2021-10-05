'use strict';

function init() {
	renderRecords();
	gHints = createHintObj();
	elHints.innerText = `${gHints.hints.join(' ')}`;
	gLives = `❤️ ❤️ ❤️`.split(' ');
	elLives.innerText = `${gLives.join(' ')}`;
	elRestartBtn.innerText = gGameModes.start;
	gGame = createGameObj();

	elManuallyCreate.classList.add('hidden');
	elApp.classList.add('hidden');
	elForm.classList.remove('hidden');

	// Resetting the timer
	elTimerBox.innerText = `00:00`;
	clearInterval(timerInterval);
	//
	gMinesLocations = [];
	gMoves = {};

	safeClickedCount = 3;
	gNumMarked = 0;

	gTurn = 0;
	gIsManually = false;
}

// BUTTON CLICKS
function checkboxClicked(elCell, level) {
	gLevel = level;
	gSize = gLevels[level].size;
	gMines = gLevels[level].mines;
	// Removing the check sign
	elCell.checked = false;
	if (level === 'beginner') {
		gLives = ['❤️'];
		elLives.innerText = `${gLives.join(' ')}`;
	}
	//
	elManuallyCreate.classList.remove('hidden');
	//
	elForm.classList.add('hidden');

	// Creating the board in the chosen size
	gBoard = createMat(gSize, gSize);

	gEmptyPlaces = emptyLocations();
	unopenedLocations = gEmptyPlaces.slice();

	renderBoard();
}
/////////
// FUNCTIONS

function createBoard() {
	for (var i = 0; i < gSize; i++) {
		for (var j = 0; j < gSize; j++) {
			if (gBoard[i][j].isMine) continue;
			gBoard[i][j].minesAroundCount = numOfNeighbor(gBoard, i, j);
		}
	}
}

////////////
// Auxiliary function
function emptyLocations() {
	var board = [];
	for (var i = 0; i < gSize; i++) {
		for (var j = 0; j < gSize; j++) board.push({ i, j });
	}
	return board;
}

function createGameObj() {
	return { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 };
}
