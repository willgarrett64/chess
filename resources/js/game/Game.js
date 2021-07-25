const ChessPiece = require("../pieces/ChessPiece");
const Board = require("../board/Board");
const Move = require("../moves/Move");

const colors = require('colors');
const prompt = require('prompt-sync')({sigint: true});

const { getAllLegalMoves } = require('../moves/getLegalMoves');

const pieceSetup = {
  w: [
    ['rook', 'w', 'a1'], ['rook', 'w', 'h1'], ['knight', 'w', 'b1'], ['knight', 'w', 'g1'], ['bishop', 'w', 'c1'], ['bishop', 'w', 'f1'], ['queen', 'w', 'd1'], ['king', 'w', 'e1'], ['pawn', 'w', 'a2'], ['pawn', 'w', 'b2'], ['pawn', 'w', 'c2'], ['pawn', 'w', 'd2'], ['pawn', 'w', 'e2'], ['pawn', 'w', 'f2'], ['pawn', 'w', 'g2'], ['pawn', 'w', 'h2']
  ],
  b: [
    ['rook', 'b', 'a8'], ['rook', 'b', 'h8'], ['knight', 'b', 'b8'], ['knight', 'b', 'g8'], ['bishop', 'b', 'c8'], ['bishop', 'b', 'f8'], ['queen', 'b', 'd8'], ['king', 'b', 'e8'], ['pawn', 'b', 'a7'], ['pawn', 'b', 'b7'], ['pawn', 'b', 'c7'], ['pawn', 'b', 'd7'], ['pawn', 'b', 'e7'], ['pawn', 'b', 'f7'], ['pawn', 'b', 'g7'], ['pawn', 'b', 'h7']
  ]
}


class Game {
  constructor(pieceSetup) {
    this.board = new Board(this.createPieces(pieceSetup));
    this.turn = 'w';
    this.check = false;
    this.mate = false; //both stalemate and checkmate
    this.winner = null;
    this.move = 0;
  }

  // switch turn between white and black
  changeTurn() {
    this.turn = this.turn === 'w' ? 'b' : 'w';
  }

  // use the ChessPiece class to create the pieces object with all black and white pieces
  createPieces(pieceSetup) {
    const pieces = {w: [], b: []}; 
    pieceSetup.w.forEach(piece => {
      pieces.w.push(new ChessPiece(piece[0], piece[1], piece[2]))
    });
    pieceSetup.b.forEach(piece => {
      pieces.b.push(new ChessPiece(piece[0], piece[1], piece[2]))
    });
    return pieces;
  }

  // get all the legal moves that can currently be played
  getAllLegalMoves() {
    return getAllLegalMoves(this.turn, this.board);
  }

  // check whether the game is currently in state of check
  verifyCheck() {
    // reset check to false every time
    this.check = false;
    // allLegalMoves is found for the player who just moved
    const allLegalMoves = getAllLegalMoves(this.turn, this.board);
    // if any of the moves threaten king, set check
    for (let piece in allLegalMoves) {
      allLegalMoves[piece].forEach(move => {
        if (move.targetPiece && move.targetPiece[1] === 'K') {
          this.check = true;
        } 
      })
    }
  }

  // check whether game is in state of checkmate or stalemate
  verifyMate(allLegalMoves) {
    // loop through all pieces, if the piece has possible moves, return to exit function
    for (const piece in allLegalMoves) {
      if (allLegalMoves[piece].length !== 0) {
        return;
      }
    }
    // if no moves are possible the game is either checkmate (if game already in check) or stalemate (if game not in check)
    if (this.check) {
      this.mate = true;
      this.winner = this.turn == 'w' ? 'Black' : 'White';
    } else {
      this.mate = true;
    }
  }

  // promotion event when pawn gets to final rank
  promotionEvent(piece) {
    const legalPromoteTo = ['q', 'r', 'n', 'b'];
    let promoteTo;

    // get user input of which piece type they want to promote to
    do {
      console.clear();
      this.printBoard();

      console.log('Promote pawn - which piece would you like to promote to?\nq - queen\nr - rook\nn - knight\nb - bishop\n');
      promoteTo = prompt('>');
    } while (!legalPromoteTo.includes(promoteTo));

    // translate input into full piece name
    switch (promoteTo) {
      case 'q':
        promoteTo = 'queen';
        break
      case 'r':
        promoteTo = 'rook';
        break
      case 'n':
        promoteTo = 'knight';
        break
      case 'b':
        promoteTo = 'bishop';
        break
    }

    // promote the piece
    piece.promotePawn(promoteTo);
  }


  // make a move by moving the piece, looking whether it leaves opponent in check, printing the board and then updating move number and whose turn it is
  makeMove(move) {
    // update the board
    this.board.movePiece(move);
    const piece = move.piece;

    // if the move if castling, also move the rook
    if (move.moveType === 'k' || move.moveType === 'q') {
      this.board.movePiece(move.rookMove);
    }

    // run a promotion event if the move permits
    if (move.promotion) {
      this.promotionEvent(piece)
    }

    // look for checks
    this.verifyCheck();

    
    // increase move number and change whose turn it is
    this.move++;
    this.changeTurn();
  }

  // get user input for a move (through Node.js) and return a move object
  getUserMoveNode(allLegalMoves) {
    // declare variables
    let pieceId, moves = [];

    // request user to select a square with the piece they wish to move
    let startSquare = prompt('Enter the square with the piece you wish to move: ')

    // check both whether the user has selected one of their own pieces, and also whether that piece has legal moves
    while (moves.length === 0) {
      while (this.board.pieces[this.turn].findIndex(piece => piece.AN === startSquare.toLowerCase()) === -1) {
        startSquare = prompt('Please enter a valid square with one of your pieces that you wish to move: ');
      }

      pieceId = this.board.getSquare(startSquare).currentPiece.id;
      moves = allLegalMoves[pieceId];
      if (moves.length === 0) {
        console.log('Sorry, this piece has no legal moves.');
        startSquare = '';
      }
    }

    // create a string of all the target squares (to log for the user to see options)
    let targetSquaresStr = '';
    for (let index = 0; index < moves.length; index++) {
      if (index !== moves.length - 1) {
        targetSquaresStr += ` ${moves[index].targetSquare} /`
      } else {
        targetSquaresStr += ` ${moves[index].targetSquare}`
      }
      
    }

    // get user input for the square to move the piece into
    let targetSquare = prompt(`This piece can move to${targetSquaresStr}. Which would you like to move to: `);

    // ensure the input target square is a legal move for the piece selected
    while (moves.findIndex(move => move.targetSquare == targetSquare) === -1) {
      targetSquare = prompt(`Please select only one of${targetSquaresStr}: `);
    }

    // get the index of the move being made and return the move object
    //CAN PROBABLY IMPROVE THIS PART
    let index = moves.findIndex(move => move.targetSquare == targetSquare);
    return moves[index];
  }

  // print the board to the console
  printBoard() {
    const convertToPrint = (square) => {
      let str;
      if (square.currentPiece) {
        str = ` ${square.currentPiece.typeCode} `;
        if (square.currentPiece.color == 'w') {
          str = str.white;
        } else {
          str = str.black;
        }
      } else {
        str = '   ';
      }
      return str;
    }

    console.log('    a  b  c  d  e  f  g  h ');
    for (let y = 0; y < 8; y++) {
      let rank = ` ${8 - y} `;
      for (let x = 0; x < 8; x++) {
        const square = this.board.current[y][x];
        let str = convertToPrint(square);
        if ((x + y) % 2 === 0) {
          str = str.bgRed;
        } else {
          str = str.bgGrey
        }
        rank += str;
      }
      rank += ` ${8 - y} `;
      console.log(rank);
    }
    console.log('    a  b  c  d  e  f  g  h ');
    console.log('------------------------------');
  }

  // print all captured pieces to the console
  printCaptured() {
    const createCapturedString = (color) => {
      let capturedString = '';
      this.board.captured[color].forEach(piece => {
        capturedString += piece.typeCode
      })
      return capturedString;
    }

    console.log('Captured pieces:');
    console.log(`- White: ${createCapturedString('w')}`);
    console.log(`- Black: ${createCapturedString('b')}`);
    console.log('------------------------------');

  }

  // run the game
  play() {
    // set the board with the pieces, and then print to console
    this.board.setBoard();
    
    // loop through requesting moves from user and updating the board until the game is complete
    while (!this.mate) {
      console.clear();
      this.printBoard();
      this.printCaptured();
      
      const color = this.turn === 'w' ? 'White' : 'Black';
      console.log(color + ' to move');
      
      let allLegalMoves = this.getAllLegalMoves();
      const move = this.getUserMoveNode(allLegalMoves);
      this.makeMove(move);
      this.verifyMate(this.getAllLegalMoves());
    }
    
    // log winner/draw to console
    if (this.winner) {
      console.log(`Checkmate - ${this.winner} wins!`);
    } else {
      console.log((`It's a draw`));
    }
    
  }
}

module.exports = Game;