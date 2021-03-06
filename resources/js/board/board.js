import { xyToAN, ANToXy } from './algebraicNotation.js';

class Board {
  constructor(pieces) {
    this.current = this.createBoard();
    this.history = {moveHistory: [], boardHistory: []};
    this.pieces = pieces;
    this.captured = {w: [], b: []};
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
      if (!piece.captured) {
        this.addPieceToBoard(piece);
      }
    })
    this.pieces.b.forEach(piece => {
      if (!piece.captured) {
        this.addPieceToBoard(piece);
      }
    })
  }

  // move a piece on the board
  movePiece(move) {
    // update history
    this.addHistory(move);

    // access useful move properties
    const piece = move.piece;
    const startSquare = this.getSquare(piece.AN);
    const targetSquare = this.getSquare(move.targetSquare);

    // update the piece's x, y and AN properties
    piece.move(move.targetSquare);
    
    // remove the piece from the board's initial square and place it in the new square
    startSquare.currentPiece = null;
    targetSquare.currentPiece = piece;
    
    // if the move is a capture, call the captured piece's setCaptured method
    if (move.capture) {
      const targetPiece = this.getPieceById(move.targetPiece);
      targetPiece.setCaptured();
      this.addCaptured(targetPiece);
    }

    // if the move is en-passant, remove the captured pawn from the board (for normal captures, the captured piece is already removed)
    if (move.moveType === 'e') {
      // get the y co-ordinates of where the pawn that will be captured is (which is not the same as the capturing pawn's target square)
      let tY;
      switch (targetSquare.y) {
        case 5:
          tY = 4;
          break;
        case 2:
          tY = 3;
          break;
      }
      this.current[tY][targetSquare.x].currentPiece = null;
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

  // add captured pieces to list
  addCaptured(piece) {
    const order = {'P': 1, 'N': 2, 'B': 3, 'R': 4, 'Q': 5}
    const color = piece.color;
    // add captured piece to this.captured in order (pawns, knights, bishops, queen)
    this.captured[color].push(piece);
    this.captured[color].sort((a, b) => {
      return order[a.typeCode] - order[b.typeCode];
    })
  }

  // add move to history
  addHistory(move) {
    // add copy of the current board to boardHistory
    const boardCopy = this.copyBoard();
    this.history.boardHistory.push(boardCopy);

    // add move to moveHistory
    this.history.moveHistory.push(move);
  }

  // make a deep copy of the current board (used when creating board history) - as the ...spread functionality only makes a shallow copy (one layer deep), we need to make a copy of each nested array/object
  copyBoard() {
    const boardCopy = [];
    this.current.forEach(rank => {
      //make copy of each rank
      const rankCopy = [];
      rank.forEach(square => {
        // make copy of each square
        const squareCopy = { ...square }
        // make copy of each piece (if there is one)
        let pieceCopy = square.currentPiece ? { ...square.currentPiece } : null;
        squareCopy.currentPiece = pieceCopy;
        rankCopy.push(squareCopy)
      })
      boardCopy.push(rankCopy);
    })
    return boardCopy;
  }
}

export {Board};