const { xyToAN, ANToXy } = require('../board/algebraicNotation');
const Move = require('../moves/Move')


// check if x and y co-ordinates are in bounds
const isInBounds = (x, y) => {
  if (x >= 0 && x < 8 && y >= 0 && y < 8) {
    return true;
  } else {
    return false;
  }
}





// return a list of all the possible pseudo moves for a single piece - pseudo moves are all moves a piece can make, legal or not (a move that would leave yourself in check is illegal)
const getPseudoMoves = (piece, board) => {
  // check if a pawn can push forward by move passed in. Log result and return true or false
  const checkPawnPush = (piece, move) => {
    let tX = piece.x + move[0];
    let tY = piece.y + move[1];
    if (isInBounds(tX, tY)) {
      if (board.getPieceInSquare(tX, tY)) {
        return false;
      } else {
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
      const tPiece = board.getPieceInSquare(tX, tY);
        if (tPiece) {
          // add move to list of pseudo moves if target square has opposite colour piece
          if (tPiece.color !== piece.color) {
            return true
          } else {
            return false;
          }
        }
    } else {
      // if move takes piece out of bounds
      return false;
    }
  } //NEED TO ADD EN-PASSANT AND PROMOTION EVENT 



  let pseudoMoves = {piece: piece.id, initSquare: piece.AN, moves: []};

  // possible pawn moves are unique so require their own logic
  if (piece.type === 'pawn') {
    for (let i = 0; i < piece.moves.length; i++) {
      switch (i) {
        case 0: // forward 1 push
          if (checkPawnPush(piece, piece.moves[i])) {
            let tX = piece.x + piece.moves[i][0];
            let tY = piece.y + piece.moves[i][1];
            pseudoMoves.moves.push(new Move(piece, xyToAN(tX, tY), board, false))
          }
          break;
        case 1: // forward 2 push (first move only)
          if (piece.initPos) {
            if (checkPawnPush(piece, piece.moves[i])) {
              let tX = piece.x + piece.moves[i][0];
              let tY = piece.y + piece.moves[i][1];
              pseudoMoves.moves.push(new Move(piece, xyToAN(tX, tY), board, false))
            }
          }
          break;
        default: // diagonal captures
          if (checkPawnCapture(piece, piece.moves[i])) {
            let tX = piece.x + piece.moves[i][0];
            let tY = piece.y + piece.moves[i][1];
            const targetPiece = board.getPieceInSquare(tX, tY);
            pseudoMoves.moves.push(new Move(piece, xyToAN(tX, tY), board, true))
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
        const tPiece = board.getPieceInSquare(tX, tY);
        if (tPiece) {
          // add move to list of pseudo moves if target square has opposite colour piece
          if (tPiece.color === piece.color) {
            canMove = false;
          } else {
            const targetPiece = board.getPieceInSquare(tX, tY);
            pseudoMoves.moves.push(new Move(piece, xyToAN(tX, tY), board, true));
            canMove = false;
          }
        } else {
          // add move to list of pseudo moves if target square is within bounds
          pseudoMoves.moves.push(new Move(piece, xyToAN(tX, tY), board, true))
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
  console.log(pseudoMoves.moves);
  console.log('-------------');
  return pseudoMoves; 
}




// return a list of all possible pseudo moves, for all pieces of the color whose turn it is
const getAllPseudoMoves = (turn, board) => {
  const allPseudoMoves = [];  
  board.current.forEach(rank => {
    rank.forEach(square => {
      const piece = board.getPieceInSquare(square.x, square.y);
      if (piece) {
        const color = piece.color;
        if (color === turn) {
          allPseudoMoves.push(getPseudoMoves(piece, board))
          
          // const tempPseudoMoves = getPseudoMoves(piece, board);
          // tempPseudoMoves.pseudoMoves.forEach(move => {
          //   if (move.canCapture) {
          //     allPseudoMoves.push(move.move)
          //   }
          // })
        }
      }
    })
  })
  return allPseudoMoves;
}




const leaveSelfInCheck = (piece, targetSquare, board) => {
  // I need to simulate a move (let's say of white) by making a copy of the board and update the board as if the move had been made. Then, from the new board, get all the pseudo moves of black. If any of the pseudo moves matches the square of white king, it means the simulated move isn't legal.

  // make a copy of board - this is so that we can simulate a move being made and then check the possible moves on the next turn
  const boardCopy = [ ...board ];
  // calculate who has the next turn
  const nextTurn = turn === 'w' ? 'b' : 'w';

  // get piece to move's current x and y
  const x = piece.x;
  const y = piece.y;
  // work out piece to move's new x and y
  const newX = ANToXy(targetSquare)[0];
  const newY = ANToXy(targetSquare)[1];
  
  // move the piece on the board copy (hasn't moved on the actual board)
  boardCopy[y][x].currentPiece = null;
  boardCopy[newY][newX].currentPiece = piece; 

  // save the position of the king (of the colour who is attempting to make a move)
  let kingSquare;
  boardCopy.forEach(rank => {
    rank.forEach(square => {
      const piece = square.currentPiece;
      if (piece) {
        const color = piece.color;
        if (color === turn && piece.type === 'king') {
          kingSquare = xyToAN(square.x, square.y);
        }
      }
    })
  })

  // get all the possible pseudo moves for the next turn, after this piece has been moved
  const nextPseudoMoves = getAllPseudoMoves(nextTurn, boardCopy);

  // loop through all the pieces and their moves - if one has a move that is equal to where the oppoisition king is, it means the move that was made before puts themselves in check, so is illegal
  const index = nextPseudoMoves.findIndex(piece => {
    // for all moves that could capture (pawn pushes are ruled out because they don't threaten mate), 
    piece.moves.forEach(move => {
      if (move.canCapture) {
        move.move == kingSquare ? true : false
      }
    })
  })
  
  if (index !== -1) {
    console.log('illegal move');
    return true;
  } else {
    console.log('legal move');
    return false;
  }
}


// WARNING - WHEN CASTLING IS DONE, NEED TO CHECK IF THE CASTLING MOVES THROUGH A CHECK POSITION //

// from a list of all possible psuedo moves, calculate checks and checkmates to eliminate illegal moves
const findAllLegalMoves = (allPseudoMoves) => {
  const allLegalMoves = [];
  allPseudoMoves.forEach(move => {
    if (!leaveSelfInCheck(move)) {
      allLegalMoves.push(move);
    }
  })
  return allLegalMoves;
}



module.exports = {
  isInBounds: isInBounds,
  getPseudoMoves: getPseudoMoves,
  getAllPseudoMoves: getAllPseudoMoves,
  leaveSelfInCheck: leaveSelfInCheck,
  findAllLegalMoves: findAllLegalMoves,
}