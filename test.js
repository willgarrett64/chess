const { xyToAN, ANToXy } = require('./resources/js/board/algebraicNotation');
const { isInBounds, getPieceInSquare, getPseudoMoves, getAllPseudoMoves, printAllPseudoMoves } = require('./resources/js/moves/moves');

// Import pieces
const Pawn = require('./resources/js/pieces/pawn');
const Bishop = require('./resources/js/pieces/bishop');
const Knight = require('./resources/js/pieces/knight');
const Rook = require('./resources/js/pieces/rook');
const Queen = require('./resources/js/pieces/queen');
const King = require('./resources/js/pieces/king');



//white pieces
const a1r = new Rook('w', 'a1');
const h1r = new Rook('w', 'h1');
const b1n = new Knight('w', 'b1');
const g1n = new Knight('w', 'g1');
const c1b = new Bishop('w', 'c1');
const f1b = new Bishop('w', 'f1');
const d1q = new Queen('w', 'd1');
const e1k = new King('w', 'e1');

const a2p = new Pawn('w', 'a2');
const b2p = new Pawn('w', 'b2');
const c2p = new Pawn('w', 'c2');
const d2p = new Pawn('w', 'd2');
const e2p = new Pawn('w', 'e2');
const f2p = new Pawn('w', 'f2');
const g2p = new Pawn('w', 'g2');
const h2p = new Pawn('w', 'h2');

//black pieces
const a8r = new Rook('b', 'a8');
const h8r = new Rook('b', 'h8');
const b8n = new Knight('b', 'b8');
const g8n = new Knight('b', 'g8');
const c8b = new Bishop('b', 'c8');
const f8b = new Bishop('b', 'f8');
const d8q = new Queen('b', 'd8');
const e8k = new King('b', 'e8');

const a7p = new Pawn('b', 'a7');
const b7p = new Pawn('b', 'b7');
const c7p = new Pawn('b', 'c7');
const d7p = new Pawn('b', 'd7');
const e7p = new Pawn('b', 'e7');
const f7p = new Pawn('b', 'f7');
const g7p = new Pawn('b', 'g7');
const h7p = new Pawn('b', 'h7');


const whitePieces = [a1r, h1r, b1n, g1n, c1b, f1b, d1q, e1k, a2p, b2p, c2p, d2p, e2p, f2p, g2p, h2p];
const blackPieces = [a8r, h8r, b8n, g8n, c8b, f8b, d8q, e8k, a7p, b7p, c7p, d7p, e7p, f7p, g7p, h7p];
const allPieces = [whitePieces, blackPieces];


const createBoard = () => {
  let board = new Array(8);
  for (var i = 0; i < 8; i++) {
    board[i] = new Array(8);
    for (var j = 0; j < 8; j++) {
      board[i][j] = {
        x: j,
        y: i,
        algNot: xyToAN(j, i),
        currentPiece: null,
      };
    }
  }
  return board
}



// add piece to board 
const addToBoard = (piece) => {
  board[piece.y][piece.x].currentPiece = piece;
}

const updateBoard = (piece, newSquare) => {
  const x = piece.x;
  const y = piece.y;
  const newX = ANToXy(newSquare)[0];
  const newY = ANToXy(newSquare)[1];
  
  piece.setNewPosition(newSquare);

  board[y][x].currentPiece = null;
  board[newY][newX].currentPiece = piece;

  turn = turn === 'w' ? 'b' : 'w';
}

const resetBoard = () => {
  allPieces.forEach(color => {
    color.forEach(piece => {
      addToBoard(piece)
    })
  })
}

global.board = createBoard();
global.turn = 'w';


//TESTING
resetBoard();
console.log(board);
printAllPseudoMoves()

updateBoard(e2p, 'e4');
console.log(board);
printAllPseudoMoves()

updateBoard(d7p, 'd5');
console.log(board); 
printAllPseudoMoves()
