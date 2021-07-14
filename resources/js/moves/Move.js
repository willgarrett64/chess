class Move {
  constructor(piece, targetSquare, board, canCapture) {
    this.piece = piece.id;
    this.startSquare = piece.AN;
    this.targetSquare = targetSquare;
    this.capture = this.getCapture(targetSquare, board);
    this.canCapture = canCapture;
    this.targetPiece = this.getTargetPiece(targetSquare, board);
    this.moveAN = this.getMoveAN(piece, targetSquare, board)
  }

  // calculate whether the move is a capture or not
  getCapture(targetSquare, board) {
    if (board.getSquare(targetSquare).currentPiece) {
      return true;
    } else {
      return false;
    }
  }

  // if the move is a capture, get the target piece's id, else return null
  getTargetPiece(targetSquare, board) {
    const square = board.getSquare(targetSquare);
    if (square.currentPiece) {
      return square.currentPiece.id;
    } else {
      return null
    }
  }

  // get the algebraic notation for the move - read the following link for more info: https://en.wikipedia.org/wiki/Algebraic_notation_(chess)#Notation_for_moves
  getMoveAN(piece, targetSquare, board) {
    const pieceNotation = piece.id[1];
    if (pieceNotation === 'P') {
      // pawn moves aren't started with the letter 'p'
      return ((this.getCapture(targetSquare, board) ? piece.AN[0] + 'x' : '') + targetSquare)
    } else {
      // all other moves start with the letter of the piece moving
      return (pieceNotation + (this.getCapture(targetSquare, board) ? 'x' : '') + targetSquare)
    }
  }
}

module.exports = Move;