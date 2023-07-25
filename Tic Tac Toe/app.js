const r = [];
const c = [];
const x = [];


for (let i = 1; i <= 9; i++) {
  r[i] = document.getElementById(`r${i}`);
  c[i] = document.getElementById(`c${i}`);
  x[i] = document.querySelectorAll(`.x${i}`);
}


const rectangles = document.querySelectorAll("rect");
const circles = document.querySelectorAll("circle");
const lines = document.querySelectorAll("line");
const info = document.getElementById('info');

const resetBtn = document.getElementById("reset");
const playAgainBtn = document.getElementById('play-again');
const closeBtn = document.getElementById('close');

const popup = document.getElementById('popup-container');
const finalMessage = document.getElementById('final-message');

const WINNING_COMBINATIONS = [
[1, 2, 3], [4, 5, 6], [7, 8, 9], // Rows
[1, 4, 7], [2, 5, 8], [3, 6, 9], // Columns
[1, 5, 9], [3, 5, 7]              // Diagonals
];
  
let board = Array.from({ length: 9 }, () => '');

let currentPlayer = 1;
let count = 0;
let gameStatus = 1;

let winLine;

const resetGame = () => {

	rectangles.forEach((r) => {
		r.value = '';
		r.style.fill = 'teal'
		r.style.opacity = 0.5; });

	circles.forEach((c) => { c.style.display = 'none' });

	lines.forEach((line) => { line.style.display = 'none'; });

	currentPlayer = 1;
	count = 0;
	gameStatus = 1;

	board = Array.from({ length: 9 }, () => '');

	info.innerText = 'Start the game';
}


resetGame();


const checkWinningCondition = () => {
	for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
	  const [a, b, c] = WINNING_COMBINATIONS[i];

	  winComb = WINNING_COMBINATIONS[i]

	  if (board[a-1] && board[a-1] === board[b-1] && board[a-1] === board[c-1]) {

		winLine = [winComb[0], winComb[1], winComb[2]];
		
		return { player: board[a-1] };
	  }
	}
	if (board.every((value) => value !== '')) {

	  return { player: null };
	}
	return null;
}

const updateBoard = (field) => {

board[field-1] = currentPlayer == 1 ? 'X' : 'O';

currentPlayer = currentPlayer == 1 ? 0 : 1;

}


class Field {

	constructor(field_number,r,c,x) {

		this.field_number = field_number;
		this.r = r;
		this.c = c;
		this.x = x		
	}
}


const showMessage = (winner) => {

	if(winner.player){

		winLineFormat(winLine);

		setTimeout( () => {
			info.innerText = `Gamer over: Player ${winner.player} won!`;
			finalMessage.innerText = `Player ${winner.player} won!`;
			popup.style.display = 'flex';
		}, 100);
	}
	else{
		setTimeout( () => {
			info.innerText = "Gamer over: Match Tie!";
			finalMessage.innerText = 'Match Tie!';
			popup.style.display = 'flex';
		}, 100);
	}

	gameStatus = 0

}


const orderInfo = () => {

	if (currentPlayer == 1) {
		info.innerText = "Player X Turn";
	}
	else {
		info.innerText = "Player O Turn";
	}

}


const winLineFormat = (winLine) => {

	rectangles.forEach(( r, index ) => {

		if(index+1 == winLine[0] || index+1 == winLine[1] || index+1 == winLine[2]){

			r.style.fill = 'limegreen'
		}

	})

}


playAgainBtn.addEventListener('click',() => {

    popup.style.display = 'none'
	resetGame()
})


closeBtn.addEventListener('click',() => {

    popup.style.display = 'none'
})


resetBtn.addEventListener('click', () => {

	resetGame();
})


const click = (field) => {

	if(field.r.value == '' && gameStatus == 1){

		if(currentPlayer == 1){
			field.x.forEach((line) => {
				line.style.display = 'block';
				line.style.stroke = 'white' });
			field.r.style.opacity = 1;
			field.r.value = 'X';
		 }
		else {
			field.c.style.display = 'block';
			field.c.style.stroke = 'white';
			field.r.style.opacity = 1;
			field.r.value = 'O';
		}

		count++ ;

		updateBoard(field.field_number);

		const winner = checkWinningCondition();

		if(count > 4 && winner){  showMessage(winner) }
		else{ orderInfo() }

	}

}


const mouseover = (field) => {

	if(field.r.value == '' && gameStatus == 1){

		field.r.style.opacity = 1;

		if(currentPlayer == 1){
			field.x.forEach((line) => { 
				line.style.display = 'block';
				line.style.stroke = '#3EA4A6';
			}) }
		else {
			field.c.style.display = 'block';
			field.c.style.stroke = '#3EA4A6'
		}
	}

}


const mouseout = (field) => {

	if(field.r.value == ''){

		field.r.style.opacity = 0.5;

		if(currentPlayer == 1){
			field.x.forEach((line) => { 
				line.style.display = 'none';
			}) }
		else {
			field.c.style.display = 'none';
		}

	}

}


const fields = [];

for (let i = 1; i <= 9; i++) {
  fields[i - 1] = new Field(i, r[i], c[i], x[i]);
}


const elements = [];

for (let i = 1; i <= 9; i++) {
  elements.push([r[i], c[i], x[i][0], x[i][1]]);
}

const events = ['click', 'mouseover', 'mouseout']


const eventFunction = (event, field) => {

	if(event == 'click'){ click(field) }
	else if (event == 'mouseover'){ mouseover(field) }
	else{ mouseout(field) }

}


for (let i = 0; i < elements.length; i++) {

	const field = fields[i];

	for (let j = 0; j < events.length; j++) {
	  elements[i].forEach((element) => {
		element.addEventListener(events[j], () => eventFunction(events[j], field));
	  });
	}
  }