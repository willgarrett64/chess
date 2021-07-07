const { xyToAN, ANToXy } = require('./resources/js/board/algebraicNotation');
const { isInBounds, getPieceInSquare, getPseudoMoves, getAllPseudoMoves, printAllPseudoMoves } = require('./resources/js/moves/moves');

// Import pieces
const ChessPiece = require('./resources/js/pieces/ChessPiece');


//white pieces
const a1r = new ChessPiece('rook', 'w', 'a1');
const h1r = new ChessPiece('rook', 'w', 'h1');
const b1n = new ChessPiece('knight', 'w', 'b1');
const g1n = new ChessPiece('knight', 'w', 'g1');
const c1b = new ChessPiece('bishop', 'w', 'c1');
const f1b = new ChessPiece('bishop', 'w', 'f1');
const d1q = new ChessPiece('queen', 'w', 'd1');
const e1k = new ChessPiece('king', 'w', 'e1');

const a2p = new ChessPiece('pawn', 'w', 'a2');
const b2p = new ChessPiece('pawn', 'w', 'b2');
const c2p = new ChessPiece('pawn', 'w', 'c2');
const d2p = new ChessPiece('pawn', 'w', 'd2');
const e2p = new ChessPiece('pawn', 'w', 'e2');
const f2p = new ChessPiece('pawn', 'w', 'f2');
const g2p = new ChessPiece('pawn', 'w', 'g2');
const h2p = new ChessPiece('pawn', 'w', 'h2');

//black pieces
const a8r = new ChessPiece('rook', 'b', 'a8');
const h8r = new ChessPiece('rook', 'b', 'h8');
const b8n = new ChessPiece('knight', 'b', 'b8');
const g8n = new ChessPiece('knight', 'b', 'g8');
const c8b = new ChessPiece('bishop', 'b', 'c8');
const f8b = new ChessPiece('bishop', 'b', 'f8');
const d8q = new ChessPiece('queen', 'b', 'd8');
const e8k = new ChessPiece('king', 'b', 'e8');

const a7p = new ChessPiece('pawn', 'b', 'a7');
const b7p = new ChessPiece('pawn', 'b', 'b7');
const c7p = new ChessPiece('pawn', 'b', 'c7');
const d7p = new ChessPiece('pawn', 'b', 'd7');
const e7p = new ChessPiece('pawn', 'b', 'e7');
const f7p = new ChessPiece('pawn', 'b', 'f7');
const g7p = new ChessPiece('pawn', 'b', 'g7');
const h7p = new ChessPiece('pawn', 'b', 'h7');


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
