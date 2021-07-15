const { xyToAN, ANToXy } = require('./algebraicNotation');
const { createBoard, createPieces, setBoard } = require('../board/boardTest');

class Board {
  constructor(pieces) {
    this.current = this.createBoard();
    this.history = [];
    this.pieces = pieces;
  }

  // create an empty 8x8 2d-array. In each element is an object with XY co-ordinates, the algebraic notation (AN) of the square, and the property "currentPiece". This is set to null when no piece is present.
  createBoard() {
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
  addPieceToBoard(piece) {
    this.current[piece.y][piece.x].currentPiece = piece;
  }

  // set pieces onto the board
  setBoard() {
    this.pieces.w.forEach(piece => {
      this.addPieceToBoard(piece);
    })
    this.pieces.b.forEach(piece => {
      this.addPieceToBoard(piece);
    })
  }

  // move a piece on the board
  movePiece(move) {
    const piece = this.getPieceById(move.piece);
    const startSquare = this.getSquare(piece.AN);
    const targetSquare = this.getSquare(move.targetSquare);

    // change the piece's x, y and AN properties
    piece.move(move.targetSquare);
    
    // remove the piece from the board's initial square and place it in the new square
    startSquare.currentPiece = null;
    targetSquare.currentPiece = piece;
    
    // if the move is a capture, call the captured piece's setCaptured method
    if (move.capture) {
      const targetPiece = this.getPieceById(move.targetPiece);
      targetPiece.setCaptured();
    }
  }

  // return a piece by its ID - an example ID is 'bRa8', which is the black(b) rook(R) that starts on square a8.
  getPieceById(id) {
    const color = id[0];
    const piece = this.pieces[color].find(piece => piece.id === id);
    return piece;
  }

  // return the square on the board by taking in the algebraic notation (AN)
  getSquare(AN) {
    const tX = ANToXy(AN)[0];
    const tY = ANToXy(AN)[1];
    return this.current[tY][tX];
  }

  // return the piece in a square given the x-y co-ordinates
  getPieceInSquare(x, y) {
    if (this.current[y][x].currentPiece) {
      return this.current[y][x].currentPiece;
    } else {
      return null
    }
  }
}

module.exports = Board;