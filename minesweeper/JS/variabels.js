'use strict';

// SELECTORS
const elForm = document.querySelector('.form');
const elBoard = document.querySelector('.board');
const elApp = document.querySelector('.app');
const elLives = document.querySelector('.lives');
const elTimerBox = document.querySelector('.timer-box');
const elRestartBtn = document.querySelector('.btn-restart');
const elSafeClickAmount = document.querySelector('.safe-btn-box span');
const elManuallyCreate = document.querySelector('.manually-create-box');
const elRecord = document.querySelector('.record');
const elHints = document.querySelector('.hints-box');

//

const NUMS = {
	1: 'one',
	2: 'two',
	3: 'three',
	4: 'four',
	5: 'five',
	6: 'six',
	7: 'seven',
	8: 'eight',
};
const gLevels = {
	beginner: {
		size: 4,
		mines: 2,
	},
	medium: {
		size: 8,
		mines: 12,
	},
	expert: {
		size: 12,
		mines: 30,
	},
};

const gGameModes = {
	win: '😎',
	lose: `🤯`,
	start: '😃',
	minesSteps: {
		1: '🤒',
		2: '🤕',
	},
};
const MINE = '💣';
const MARKED_IMG = '<img class="img" src="img/flag.png" alt="flag" />';

const HIDDEN_COLOR = '#777';
var gEmptyPlaces = [];
var unopenedLocations = [];
var gBoard;
var timerInterval;
var gNumMarked = 0;
var safeClickedCount = 3;
var gIsSevenBoom = false;

var hintInterval;
var gHints;
var gMoves;
var gTurn;

var gLevel;
var gSize;
var gMines;
var gLives;
var gGame;
var gMinesLocations = [];

var gKeys = {};
var gIsManually;
