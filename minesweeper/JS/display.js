'use strict';

// BOARD
function renderBoard() {
	elBoard.innerHTML = '';
	var strHtml = '';
	for (var i = 0; i < gSize; i++) {
		strHtml += '<tr>';
		for (var j = 0; j < gSize; j++) {
			var curCell = gBoard[i][j].isMine ? MINE : gBoard[i][j].minesAroundCount;
			var className = !curCell || curCell === MINE ? '' : NUMS[curCell];
			strHtml += `<td id="cell-${i}-${j}" class="unopened ${className}" onclick="cellClicked(this) " oncontextmenu="addMarked(this,event)">${
				curCell || ''
			}</td>`;
		}
		strHtml += '</tr>';
	}
	elBoard.innerHTML = strHtml;
	elApp.classList.remove('hidden');
}

// TIMER
function renderTimer(start) {
	function time() {
		var sec = Math.floor((+new Date() - start) / 1000);
		var min = ('' + Math.floor(sec / 60)).padStart(2, 0);
		elTimerBox.innerText = `${min}:${('' + (sec % 60)).padStart(2, 0)}`;
		gGame.secsPassed++;
	}
	timerInterval = setInterval(time, 1000);
}

function renderRecords() {
	const records = getLocalRecords();
	for (const key in records) renderRecord(records[key], key);
}
function renderRecord(record, level) {
	var elRecord = document.querySelector(`.record-${level} span`);
	elRecord.innerText = record;
}
