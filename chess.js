/*
THE BOARD
8 * 8 two dimensional array [y][x]
- [0][0] = square a1 (black, bottom left)
- [7][7] = square h8 (black, top right)

- square is black if (x + y) === 0 or even 
- square is white if (x + y) === odd


MOVEMENT RULES
Pawn
- White: can move [y - 1]
- White: can take [y - 1][x +/- 1]
- Black: can move [y + 1]
- Black: can take [y + 1][x +/- 1]

if(initialPosition === True)
- White: can move [y - 2]
- Black: can move [y + 2]

if(
  white: [y === 5][x]
  black: [y === 4][x]
  &&
  opponent.lastMove === pawn move to:
  - black[y === white[y]][x === white[x +/- 1]]
  - white[y === black[y]][x === black[x +/- 1]]
)
- White: can take [y - 1][x +/- 1]
- Black: can take [y + 1][x +/- 1]

if(y === 0 (for white) or y === 7 (for black))
- pawn becomes queen


Knight
- Both: can move and take [y +/- 2][x +/- 1]
- Both: can move and take [y +/- 1][x +/- 2]

- Can ignore any pieces in the way (can jump over them)


Bishop
- Both: can move and take [y +/- n][x +/- n]
(where n is the number of squares you move on a diagonal)

Rook
- Both: can move and take [y +/- n][x +/- m]
(where n is the number of squares you move up and down the board, and m is number of squares left to right)


Queen
- Both: can move and take [y +/- n][x +/- n]  (when moving diagonally)
- Both: can move and take [y +/- n][x +/- m]  (when moving up, down, side to side)


King
- Both: can move and take [y +/- 1][x +/- 1]  (when moving diagnoally)
- Both: can move and take [y +/- 1]  (when moving up/down)
- Both: can move and take [x +/- 1]  (when moving left/right)


Castling
if(king.initPos && rook.initPos  AND   positions inbetween king and rook are blank)
- White: king can move to [6][0] and rook to [5][0]  or  king to [2][0] and rook to [3][0]
- Black: king can move to [6][7] and rook to [5][7]  or  king to [2][7] and rook to [3][7]

if(king.check  (before or after castle) OR  any square king passes through is under threat)
- can't castle




FUNCTOINS
createBoard()


*/


const wpawn = {
  colour: 'white',
  piece: 'pawn',
  src: './images/pieces/white-pawn.png',
  x: 0,
  y: 0,
  initPos: true
}

const wbishop = {
  colour: 'white',
  piece: 'bishop',
  src: './images/pieces/white-bishop.png',
  x: 0,
  y: 0,
}

const wrook = {
  colour: 'white',
  piece: 'rook',
  src: './images/pieces/white-rook.png',
  x: 0,
  y: 0,
}

const wknight = {
  colour: 'white',
  piece: 'knight',
  src: './images/pieces/white-knight.png',
  x: 0,
  y: 0,
}

const wking = {
  colour: 'white',
  piece: 'king',
  src: './images/pieces/white-king.png',
  x: 0,
  y: 0,
}

const wqueen = {
  colour: 'white',
  piece: 'queen',
  src: './images/pieces/white-queen.png',
  x: 0,
  y: 0,
}

const bpawn = {
  colour: 'black',
  piece: 'pawn',
  src: './images/pieces/black-pawn.png',
  x: 0,
  y: 0,
}

const bbishop = {
  colour: 'black',
  piece: 'bishop',
  src: './images/pieces/black-bishop.png',
  x: 0,
  y: 0,
}

const brook = {
  colour: 'black',
  piece: 'rook',
  src: './images/pieces/black-rook.png',
  x: 0,
  y: 0,
}

const bknight = {
  colour: 'black',
  piece: 'knight',
  src: './images/pieces/black-knight.png',
  x: 0,
  y: 0,
}

const bking = {
  colour: 'black',
  piece: 'king',
  src: './images/pieces/black-king.png',
  x: 0,
  y: 0,
}

const bqueen = {
  colour: 'black',
  piece: 'queen',
  src: './images/pieces/black-queen.png',
  x: 0,
  y: 0,
}




const initSetup = [
  [brook, bknight, bbishop, bqueen, bking, bbishop, bknight, brook],
  [bpawn, bpawn, bpawn, bpawn, bpawn, bpawn, bpawn, bpawn],
  [], [], [], [],
  [wpawn, wpawn, wpawn, wpawn, wpawn, wpawn, wpawn, wpawn],
  [wrook, wknight, wbishop, wqueen, wking, wbishop, wknight, wrook]
]



function createBoard() {
  const board = document.getElementById("board")
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      let square = document.createElement('div')
      if ((x + y) % 2 == 0) {
        square.className = 'square white'
      } else {
        square.className = 'square black'
      }

      const cols = 'abcdefgh'
      const idy = 8 - y;
      const idx = cols[x];
      square.id = `${idx}${idy}`;
      
      square.addEventListener('dragover', dragOver)
      square.addEventListener("drop", drop)

      board.appendChild(square)
    }
  }
}

let pieceToMove;

const dragStart = (e) => {
  pieceToMove = e.target;
  console.log(pieceToMove.id);

  // document.getElementById(newSquare).appendChild(e.target);
}

const dragOver = (e) => {
  e.preventDefault();
}

const drop = (e) => {
  const newSquare = e.target;
  console.log(newSquare.id);
  console.log(pieceToMove);
  
  newSquare.appendChild(pieceToMove);
  pieceToMove = null;
}



function setBoard() {
  for (let y = 0; y < 8; y++) {
    if (y < 2 || y > 5) {
      for (let x = 0; x < 8; x++) {
        const cols = 'abcdefgh'
        const idy = 8 - y;
        const idx = cols[x];
        const id = `${idx}${idy}`;
        const square = document.getElementById(id)
        const piece = document.createElement('img')
        piece.className = "piece"
        piece.src = initSetup[y][x].src;
        piece.id = `piece ${id}`

        piece.draggable = true;

        piece.addEventListener("dragstart", dragStart)

        square.appendChild(piece)
      }
    } 
  }
}

createBoard()
setBoard()