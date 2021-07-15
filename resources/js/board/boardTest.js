const ChessPiece = require("../pieces/ChessPiece");
const { xyToAN, ANToXy } = require('./algebraicNotation');


//white pieces
const w = [
  ['rook', 'w', 'a1'], ['rook', 'w', 'h1'], ['knight', 'w', 'b1'], ['knight', 'w', 'g1'], ['bishop', 'w', 'c1'], ['bishop', 'w', 'f1'], ['queen', 'w', 'd1'], ['king', 'w', 'e1'], ['pawn', 'w', 'a2'], ['pawn', 'w', 'b2'], ['pawn', 'w', 'c2'], ['pawn', 'w', 'd2'], ['pawn', 'w', 'e2'], ['pawn', 'w', 'f2'], ['pawn', 'w', 'g2'], ['pawn', 'w', 'h2']
];
//black pieces
const b = [
  ['rook', 'b', 'a8'], ['rook', 'b', 'h8'], ['knight', 'b', 'b8'], ['knight', 'b', 'g8'], ['bishop', 'b', 'c8'], ['bishop', 'b', 'f8'], ['queen', 'b', 'd8'], ['king', 'b', 'e8'], ['pawn', 'b', 'a7'], ['pawn', 'b', 'b7'], ['pawn', 'b', 'c7'], ['pawn', 'b', 'd7'], ['pawn', 'b', 'e7'], ['pawn', 'b', 'f7'], ['pawn', 'b', 'g7'], ['pawn', 'b', 'h7']
];


const createPieces = (pieceSetup) => {
  const pieces = {w: [], b: []}; 
  pieceSetup.w.forEach(piece => {
    pieces.w.push(new ChessPiece(piece[0], piece[1], piece[2]))
  });
  pieceSetup.b.forEach(piece => {
    pieces.b.push(new ChessPiece(piece[0], piece[1], piece[2]))
  });
  return pieces;
}


// create and return an empty 8x8 2d array. In each index is an object with XY co-ordinates, the algebraic notation (AN) of the square, and the property "currentPiece". This is set to null by default.
const createBoard = () => {
  let board = new Array(8);
  for (var i = 0; i < 8; i++) {
    board[i] = new Array(8);
    for (var j = 0; j < 8; j++) {
      board[i][j] = {
        x: j,
        y: i,
        AN: xyToAN(j, i),
        id: xyToAN(j, i),
        currentPiece: null,
      };
    }
  }
  return board
}

// add a piece to the board array. The piece will have x and y co-ordinates to say where to add it.  
const addPieceToBoard = (board, piece) => {
  board[piece.y][piece.x].currentPiece = piece;
}


// set pieces onto the board
const setBoard = (pieces, board) => {
  pieces.w.forEach(piece => {
    addPieceToBoard(board, piece);
  })
  pieces.b.forEach(piece => {
    addPieceToBoard(board, piece);
  })
}


const forEachSquare = (board, color, callback) => {
  board.forEach(rank => {
    rank.forEach(square => {
      callback(square, color);
    })
  })
}

const printPieces = (square, color) => {
  const piece = square.currentPiece;
  if (piece) {
    if (piece.color === color) {
      console.log(piece);
    }
  }
}

module.exports = {
  createBoard: createBoard,
  createPieces: createPieces,
  setBoard: setBoard,
}