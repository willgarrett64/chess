/* 
Move Type Key:
m - move
c - capture
e - en-passant
d - pawn push 2 spaces (on its first move)
q - queen side castle
k - king side castle
*/



class Move {
  constructor(moveType, piece, targetSquare, board, canCapture, enPassant) {
    this.moveType = moveType; 
    this.piece = piece.id;
    this.startSquare = piece.AN;
    this.targetSquare = targetSquare;
    this.capture = this.getCapture(targetSquare, board, enPassant);
    this.canCapture = canCapture ? true : false;
    this.enPassant = enPassant;
    this.targetPiece = this.getTargetPiece(targetSquare, board, enPassant);
    this.moveAN = this.getMoveAN(piece, targetSquare, board)
  }

  // calculate whether the move is a capture or not
  getCapture(targetSquare, board, enPassant) {
    if (board.getSquare(targetSquare).currentPiece) {
      return true;
    } else if (enPassant) {
      return true;
    } else {
      return false;
    }
  }

  // if the move is a capture, get the target piece's id, else return null
  getTargetPiece(targetSquare, board, enPassant) {
    // if the move is an en-passant capture, get the square of the pawn that will be captured
    let epTargetSquare;
    if (enPassant) {
      switch (targetSquare[1]) {
        case '6':
          epTargetSquare = targetSquare[0] + '5';
          break;
        case '3':
          epTargetSquare = targetSquare[0] + '4';
          break;
      }
    }

    const square = board.getSquare(epTargetSquare || targetSquare);
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