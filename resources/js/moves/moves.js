const { xyToAN, ANToXy } = require('../board/algebraicNotation');


// check if x and y co-ordinates are in bounds
const isInBounds = (x, y) => {
  if (x >= 0 && x < 8 && y >= 0 && y < 8) {
    return true;
  } else {
    return false;
  }
}

// get the piece in a square with x and y co-ordinates
const getPieceInSquare = (x, y) => {
  if (board[y][x].currentPiece) {
    return board[y][x].currentPiece;
  } else {
    return null
  }
}


// check if a pawn can push forward by move passed in. Log result and return true or false
const checkPawnPush = (piece, move) => {
  let tX = piece.x + move[0];
  let tY = piece.y + move[1];
  if (isInBounds(tX, tY)) {
    if (getPieceInSquare(tX, tY)) {
      console.log(`${xyToAN(tX, tY)}: blocked`);
      return false;
    } else {
      console.log(`${xyToAN(tX, tY)}: move`);
      return true;
    }
  } else {
    // if move takes piece out of bounds
    return false;
  }
} //NEED TO ADD PROMOTION EVENT


// check if a pawn can capture by move passed in. Check en-passant rule by checking lastMove. Log result and return true or false
const checkPawnCapture = (piece, move) => {
  let tX = piece.x + move[0];
  let tY = piece.y + move[1];
  if (isInBounds(tX, tY)) {
    const tPiece = getPieceInSquare(tX, tY);
      if (tPiece) {
        // add move to list of pseudo moves if target square has opposite colour piece
        if (tPiece.color !== piece.color) {
          console.log((`${xyToAN(tX, tY)}: capture`));
          return true
        } else {
          console.log((`${xyToAN(tX, tY)}: no capture`));
          return false;
        }
      }
  } else {
    // if move takes piece out of bounds
    return false;
  }
} //NEED TO ADD EN-PASSANT AND PROMOTION EVENT 



// return a list of all possible pseudo moves for a single piece (moves a piece can make before looking for checks/mates). 
// Each pseudo move is an object with an array of the x and y co-ordinates of where the move goes to, whether the move is a capture, and whether the move is legal (set to false for all). There is also a propert "canCapture" which is only false for pawn pushes, as this move type can never be a capture.  
const getPseudoMoves = (piece) => {
  let pseudoMoves = {piece: piece, pseudoMoves: []};
  console.log(`${piece.color}-${piece.type}-${piece.AN}`);

  // possible pawn moves are unique so require their own logic
  if (piece.type === 'pawn') {
    for (let i = 0; i < piece.moves.length; i++) {
      switch (i) {
        case 0: // forward 1 push
          if (checkPawnPush(piece, piece.moves[i])) {
            let tX = piece.x + piece.moves[i][0];
            let tY = piece.y + piece.moves[i][1];
            pseudoMoves.pseudoMoves.push({move: [tX, tY], capture: false, legal: true, canCapture: false})
          }
          break;
        case 1: // forward 2 push, on first move
          if (piece.initPos) {
            if (checkPawnPush(piece, piece.moves[i])) {
              let tX = piece.x + piece.moves[i][0];
              let tY = piece.y + piece.moves[i][1];
              pseudoMoves.pseudoMoves.push({move: [tX, tY], capture: false, legal: true, canCapture: false})
            }
          }
          break;
        default: // diagonal pawn captures
          if (checkPawnCapture(piece, piece.moves[i])) {
            let tX = piece.x + piece.moves[i][0];
            let tY = piece.y + piece.moves[i][1];
            pseudoMoves.pseudoMoves.push({ move: [tX, tY], capture: true, legal: true, canCapture: true})
          }
          break;
      }
    }
  } else {
    // calculate all pseudo moves for non-pawn pieces
    piece.moves.forEach(move => {
      // canMove will be set to false when piece encounters another piece (be that same or different colour)
      let canMove = true;
      // tX and tY are the target X and Y
      let tX = piece.x + move[0];
      let tY = piece.y + move[1];
      
      while (canMove && isInBounds(tX, tY)) {        
        // get the piece in the target square (null if no piece)
        const tPiece = getPieceInSquare(tX, tY);
        if (tPiece) {
          // add move to list of pseudo moves if target square has opposite colour piece
          if (tPiece.color === piece.color) {
            console.log(`${xyToAN(tX, tY)}: blocked`);
            canMove = false;
          } else {
            console.log((`${xyToAN(tX, tY)}: capture`));
            pseudoMoves.pseudoMoves.push({move: [tX, tY], capture: true, legal: true, canCapture: true});
            canMove = false;
          }
        } else {
          // add move to list of pseudo moves if target square is within bounds
          console.log(`${xyToAN(tX, tY)}: move`);
          pseudoMoves.pseudoMoves.push({move: [tX, tY], capture: false, legal: true, canCapture: true})
          // increment target X and Y to test next square
          tX += move[0];
          tY += move[1];
          // as kings and knights can't move in multiples of their moves, canMove is set to false after adding a single pseudoMove for that move type. 
          if (piece.type === 'king' || piece.type === 'knight') {
            canMove = false;
          }
        }
      }
    })
  }
  console.log(pseudoMoves.pseudoMoves);
  console.log('-------------');

  return pseudoMoves;
}

// return a list of all possible pseudo moves, for all pieces of the color whose turn it is
const getAllPseudoMoves = (turn) => {
  const allPseudoMoves = [];
  if (turn === 'w') {
    whitePieces.forEach(piece => allPseudoMoves.pseudoMoves.push(getPseudoMoves(piece)))
  } else {
    blackPieces.forEach(piece => allPseudoMoves.pseudoMoves.push(getPseudoMoves(piece)))
  }
  return allPseudoMoves;
}


// TEMP FUNCTION - prints all pseudo moves only for the color whose turn it is to play
const printAllPseudoMoves = () => {
  board.forEach(rank => {
    rank.forEach(square => {
      const piece = getPieceInSquare(square.x, square.y);
      if (piece) {
        const color = piece.color;
        if (color === turn) {
          getPseudoMoves(piece)
        }
      }
    })
  })
}



// from a list of all possible psuedo moves, calculate checks and checkmates to eliminate illegal moves
const findAllLegalMoves = (pseudoMoves) => {

}


const leaveSelfInCheck = (piece, newSquare) => {

  
  check ? false : true;
}
// if (tPiece.type === 'king') {
//   console.log((`${xyToAN(tX, tY)}: check`));
// }

module.exports = {
  isInBounds: isInBounds,
  getPieceInSquare, getPieceInSquare,
  getPseudoMoves: getPseudoMoves,
  getAllPseudoMoves, getAllPseudoMoves,
  printAllPseudoMoves, printAllPseudoMoves
}