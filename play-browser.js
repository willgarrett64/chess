import { Game } from './resources/js/game/Game.js';


const pieceSetup = {
  w: [
    ['rook', 'w', 'a1'], ['rook', 'w', 'h1'], ['knight', 'w', 'b1'], ['knight', 'w', 'g1'], ['bishop', 'w', 'c1'], ['bishop', 'w', 'f1'], ['queen', 'w', 'd1'], ['king', 'w', 'e1'], ['pawn', 'w', 'a2'], ['pawn', 'w', 'b2'], ['pawn', 'w', 'c2'], ['pawn', 'w', 'd2'], ['pawn', 'w', 'e2'], ['pawn', 'w', 'f2'], ['pawn', 'w', 'g2'], ['pawn', 'w', 'h2']
  ],
  b: [
    ['rook', 'b', 'a8'], ['rook', 'b', 'h8'], ['knight', 'b', 'b8'], ['knight', 'b', 'g8'], ['bishop', 'b', 'c8'], ['bishop', 'b', 'f8'], ['queen', 'b', 'd8'], ['king', 'b', 'e8'], ['pawn', 'b', 'a7'], ['pawn', 'b', 'b7'], ['pawn', 'b', 'c7'], ['pawn', 'b', 'd7'], ['pawn', 'b', 'e7'], ['pawn', 'b', 'f7'], ['pawn', 'b', 'g7'], ['pawn', 'b', 'h7']
  ]
}
const Chess = new Game(pieceSetup);


function createBoard() {
  const boardEl = document.getElementById("board");

  const board = Chess.board.current;

  board.forEach(rank => {
    rank.forEach(square => {
      let squareEl = document.createElement('div');
      squareEl.id = square.id;
      if ((square.x + square.y) % 2 == 0) {
        squareEl.className = 'square white'
      } else {
        squareEl.className = 'square black'
      }
      squareEl.addEventListener('dragover', dragOver)
      squareEl.addEventListener("drop", drop)
      boardEl.appendChild(squareEl)

    })
  })
}

let pieceToMove;
let piece;
let allLegalMoves;

const dragStart = (e) => {
  pieceToMove = e.target;
  piece = Chess.board.getPieceById(pieceToMove.id);
  allLegalMoves = Chess.getAllLegalMoves();
  console.log(piece);
  console.log(pieceToMove.id);
}

const dragOver = (e) => {
  e.preventDefault();
}

const drop = (e) => {
  let targetSquare = e.target;
  const checkSquare = (target) => {
    for (let i = 0; i < target.classList.length; i++) {
      if (target.classList[i] === 'square') {
        return true;
      }
    }
    return false;
  }
  
  while (!checkSquare(targetSquare)) {
    targetSquare = targetSquare.parentElement;
  }

  let moves = allLegalMoves[pieceToMove.id];
  console.log(targetSquare.id);

  if (moves.findIndex(move => move.targetSquare == targetSquare.id) !== -1) {
    targetSquare.appendChild(pieceToMove);
    piece = null;
    pieceToMove = null;
    allLegalMoves = null;
  }

}



function setBoard() {
  Chess.board.setBoard();
  const allPieces = Chess.board.pieces;
  for (const color in allPieces) {
    allPieces[color].forEach(piece => {
      
      const pieceEl = document.createElement('img')
      const squareEl = document.getElementById(piece.AN)

      pieceEl.className = "piece"
      pieceEl.src = piece.src;
      pieceEl.id = piece.id

      pieceEl.draggable = true;

      pieceEl.addEventListener("dragstart", dragStart)

      squareEl.appendChild(pieceEl)

    })
  }
}

createBoard()
setBoard()