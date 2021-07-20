const { xyToAN, ANToXy } = require('../board/algebraicNotation');
const Move = require('./Move');
const Board = require("../board/Board");


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
  // check if a pawn can push forward by move passed in
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

  // check if a pawn can perfom an en-passant capture
  const checkEnPassant = (piece, move) => {
    let tX = piece.x + move[0];
    let tY = piece.y;
    if (isInBounds(tX, tY)) {
      const tAN = xyToAN(tX, tY);
      const lastMove = board.history.moveHistory.slice(-1)[0];
      // if the last move was a double pawn push from the opposition to the side of your pawn's current position, allow en-passant
      if (lastMove && lastMove.moveAN === tAN && lastMove.moveType === 'd') {
        const pieceToSide = board.getPieceInSquare(tX, tY);
        if (pieceToSide) {
          if (pieceToSide.type === 'pawn' && pieceToSide.color !== piece.color) {
            return true;
          }
        }
      }
    }
  }

  // check if a pawn can capture by move passed in
  const checkPawnCapture = (piece, move) => {
    let tX = piece.x + move[0];
    let tY = piece.y + move[1];
    if (isInBounds(tX, tY)) {
      const tPiece = board.getPieceInSquare(tX, tY);
      // add move to list of pseudo moves if target square has opposite colour piece
      if (tPiece) {
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
  } //NEED TO ADD PROMOTION EVENT 

  let pseudoMoves = {piece: piece.id, initSquare: piece.AN, moves: []};

  // possible pawn moves are unique so require their own logic
  if (piece.type === 'pawn') {
    for (let i = 0; i < piece.moves.length; i++) {
      switch (i) {
        case 0: // forward 1 push
          if (checkPawnPush(piece, piece.moves[i])) {
            let tX = piece.x + piece.moves[i][0];
            let tY = piece.y + piece.moves[i][1];
            pseudoMoves.moves.push(new Move('m', piece, xyToAN(tX, tY), board, false))
          }
          break;
        case 1: // forward 2 push (first move only)
          if (piece.initPos) {
            if (checkPawnPush(piece, piece.moves[i]) && checkPawnPush(piece, piece.moves[i-1])) {
              let tX = piece.x + piece.moves[i][0];
              let tY = piece.y + piece.moves[i][1];
              pseudoMoves.moves.push(new Move('d', piece, xyToAN(tX, tY), board, false))
            }
          }
          break;
        default: // diagonal captures
          if (checkEnPassant(piece, piece.moves[i])) {
            let tX = piece.x + piece.moves[i][0];
            let tY = piece.y + piece.moves[i][1];          
            pseudoMoves.moves.push(new Move('e', piece, xyToAN(tX, tY), board, true))
          }
          
          if (checkPawnCapture(piece, piece.moves[i])) {
            let tX = piece.x + piece.moves[i][0];
            let tY = piece.y + piece.moves[i][1];
            pseudoMoves.moves.push(new Move('c', piece, xyToAN(tX, tY), board, true))
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
            pseudoMoves.moves.push(new Move('c', piece, xyToAN(tX, tY), board, true));
            canMove = false;
          }
        } else {
          // add move to list of pseudo moves if target square is within bounds
          pseudoMoves.moves.push(new Move('m', piece, xyToAN(tX, tY), board, true))
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
  // log piece and moves
  // console.log(piece.id);
  // console.log(pseudoMoves.moves);
  // console.log('-------------');
  return pseudoMoves; 
}



// return a list of all possible pseudo moves, for all pieces of the color whose turn it is
const getAllPseudoMoves = (turn, board) => {
  const allPseudoMoves = [];
  board.pieces[turn].forEach(piece => {
    if (!piece.captured) {
      allPseudoMoves.push(getPseudoMoves(piece, board))
    }
  })
  return allPseudoMoves;
}


// check if a move would leave yourself in check - it does this by simulating the move and then calculating every pseudo move for the next player - if any one of those threatens your king, it means your initial move is not legal.
const leaveSelfInCheck = (move, board) => {
  // make a copy of board - this is so that we can simulate a move being made without editing the original board - and then check the possible moves on the next turn
  const boardCopy = new Board(board.pieces);
  boardCopy.setBoard();

  // calculate who has the next turn by returning the opposite of whoever is making the move passed in
  const thisTurn = move.piece[0];
  const nextTurn = thisTurn === 'w' ? 'b' : 'w';

  // get piece to move's current x and y
  const x = ANToXy(move.startSquare)[0];
  const y = ANToXy(move.startSquare)[1];
  // work out piece to move's new x and y
  const newX = ANToXy(move.targetSquare)[0];
  const newY = ANToXy(move.targetSquare)[1];
  
  // move the piece on the board copy (hasn't moved on the actual board)
  boardCopy.current[y][x].currentPiece = null;
  boardCopy.current[newY][newX].currentPiece = board.getPieceById(move.piece); 

  // save the king id (of the colour who is attempting to make the move)
  const kingId = thisTurn == 'b' ? 'bKe8' : 'wKe1'


  // get all the possible pseudo moves for the next turn, after this piece has been moved
  const nextPseudoMoves = getAllPseudoMoves(nextTurn, boardCopy);

  // loop through all the pieces and their moves - if one has a move that can capture the king, it means the move that was made before puts themselves in check, so is illegal
  const index = nextPseudoMoves.findIndex(piece => {
    let check = false;
    piece.moves.forEach(pseudoMove => {
      if (pseudoMove.targetPiece == kingId) {
        check = true;
      }
    });
    return check;
  })
  
  if (index !== -1) {
    // console.log(move.piece + ' ' + move.moveAN + ' illegal move');
    return true;
  } else {
    // console.log(move.piece + ' ' + move.moveAN + ' legal move');
    return false;
  }
}


// WARNING - WHEN CASTLING IS DONE, NEED TO CHECK IF THE CASTLING MOVES THROUGH A CHECK POSITION //

// from a list of all possible psuedo moves, calculate checks and checkmates to eliminate illegal moves
const getAllLegalMoves = (turn, board) => {
  const allPseudoMoves = getAllPseudoMoves(turn, board)
  const allLegalMoves = {};
  allPseudoMoves.forEach(piece => {
    const pieceMoves = [];
    piece.moves.forEach(move => {
      if (!leaveSelfInCheck(move, board)) {
        pieceMoves.push(move);
      }
    })
    allLegalMoves[piece.piece] = pieceMoves;
  })
  return allLegalMoves;
}





// check if castling is possible
const checkCastling = (turn, board) => {
  /* 
  KING SIDE CASTLING
  - check if e1/f1/g1 (white) or e8/f8/g8 (black) are all free of enemy threat
  - check if wKe1 and wRh1 or bKe8 and bRh8 are both in initPos = true
  - check if f1/g1 or f8/g8 are empty (nothing blocking)


  QUEEN SIDE CASTLING
  - check if e1/d1/c1 (white) or e8/d8/c8 (black) are all free of enemy threat
  - check if wKe1 and wRa1 or bKe8 and bRa8 are both in initPos = true
  - check if d1/c1/b1 or d8/c8/b8 are empty (nothing blocking)


  IDEA:
  - will write a function that gets all threatened squares
  - check initPos of king and rook
  - check inbetween squares are empty
  - add move to list of legal moves (for the king)
  - everywhere where a move is passed in (board.movePiece especially), look for moveType of 'q' or 'k' first and perform specific action if true
  */

  const threatenedSquares = getThreatenedSquares(turn, board);
  
  const wKing = board.getPieceById('wKe1');
  const wRookK = board.getPieceById('wRh1');
  const wRookQ = board.getPieceById('wRa1');

  const bKing = board.getPieceById('bKe8');
  const bRookK = board.getPieceById('bRh8');
  const bRookQ = board.getPieceById('bRa8');

  const checkInitPos = (king, rook) => {
    if (king.initPos && rook.initPos) {
      return true;
    } else {
      return false;
    }
  }

  const getThreatSquares = (side) => {
    const squares = [];
    const kingSide = ['e', 'f', 'g'];
    const queenSide = ['e', 'd', 'c'];
    let file = turn === 'w' ? '1' : '8';
    
    if (side === 'k') {
      kingSide.forEach(square => {
        squares.push(square + file)
      })
    } else if (side === 'q') {
      queenSide.forEach(square => {
        squares.push(square + file)
      })
    }
    return squares;
  }

  const checkEmptySquares = (side) => {
    const squares = getThreatSquares(side);
    squares.shift();
    if (side === 'q') {
      if (turn === 'w') {
        squares.push('b1')
      }
      if (turn === 'b') {
        squares.push('b8')
      }
    }
    let empty = true;
    squares.forEach(square => {
      if (board.getPieceInSquare(ANToXy(square)[0], ANToXy(square)[1])) {
        empty = false;
      }
    })
    return empty;
  }

  const checkAll = (side) => {
    const threatSquares = getThreatSquares(side);
    let kingThreat = false;
    threatSquares.forEach(square => {
      if (threatenedSquares.includes(square)) {
        kingThreat = true;
      }
    })
    if (!kingThreat) {
      console.log('CAN CASTLE ' + side.toUpperCase() + ' SIDE');
    } 
  }

  if (turn === 'w') {
    // king side castling
    if (checkInitPos(wKing, wRookK) && checkEmptySquares('k')) {
      checkAll('k')
    }
    if (checkInitPos(wKing, wRookQ) && checkEmptySquares('q')) {
      checkAll('q')
    }
  } else {
    if (checkInitPos(bKing, bRookK) && checkEmptySquares('k')) {
      checkAll('k')
    }
    if (checkInitPos(bKing, bRookQ) && checkEmptySquares('q')) {
      checkAll('q')
    }
  }
}

const getThreatenedSquares = (turn, board) => {
  const useTurn = turn === 'w' ? 'b' : 'w';
  const allPseudoMoves = getAllPseudoMoves(useTurn, board);
  let threatenedSquares = [];
  allPseudoMoves.forEach(piece => {
    piece.moves.forEach(move => {
      if (move.canCapture) {
        threatenedSquares.push(move.targetSquare);
      }
    })
  })
  return threatenedSquares;
}




module.exports = {
  isInBounds: isInBounds,
  getPseudoMoves: getPseudoMoves,
  getAllPseudoMoves: getAllPseudoMoves,
  leaveSelfInCheck: leaveSelfInCheck,
  getAllLegalMoves: getAllLegalMoves,
  checkCastling: checkCastling,
}




