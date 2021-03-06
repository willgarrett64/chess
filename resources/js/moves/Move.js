/* 
Move Type Key:
m - move
c - capture
e - en-passant
d - double pawn push (allowed on its first move only)
q - queen side castling
k - king side castling
r - rook move during castling
*/



class Move {
  constructor(moveType, piece, targetSquare, board, canCapture) {
    this.moveType = moveType;
    this.piece = piece;
    this.startSquare = piece.AN;
    this.targetSquare = targetSquare;
    this.capture = this.getCapture(targetSquare, board, moveType);
    this.promotion = this.getPromotion(piece, targetSquare, board)
    this.canCapture = canCapture ? true : false;
    this.targetPiece = this.getTargetPiece(targetSquare, board, moveType);
    this.moveAN = this.getMoveAN(piece, targetSquare, board)
  }

  // calculate whether the move is a capture or not
  getCapture() {
    if (this.moveType === 'c' || this.moveType === 'e') {
      return true;
    } else {
      return false;
    }
  }

  // calculate whether the move is a promotion event - when a pawn gets to the final rank
  getPromotion(piece, targetSquare) {
    if (piece.type === 'pawn') {
      if (targetSquare[1] === '1' || targetSquare[1] === '8') {
        return true;
      } else {
        return false;
      }
    }
  }

  // if the move is a capture, get the target piece's id, else return null
  getTargetPiece(targetSquare, board) {
    // if the move is an en-passant capture, get the square of the pawn that will be captured
    let epTargetSquare;
    if (this.moveType === 'e') {
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
    const pieceNotation = piece.typeCode;
    if (pieceNotation === 'P') {
      // pawn moves aren't started with the letter 'p'
      return ((this.getCapture(targetSquare, board) ? piece.AN[0] + 'x' : '') + targetSquare)
    } else {
      // all other moves start with the letter of the piece moving
      return (pieceNotation + (this.getCapture(targetSquare, board) ? 'x' : '') + targetSquare)
    }
  }
}
export {Move};