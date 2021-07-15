const ChessPiece = require("../pieces/ChessPiece");
const Board = require("../board/Board");

const colors = require('colors');

const { getAllPseudoMoves, findAllLegalMoves } = require('../moves/getLegalMoves');

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

  // 
  getAllLegalMoves() {
    findAllLegalMoves(this.turn, this.board)
  }

  //
  makeMove(pieceToMove, move) {
    if (isMoveLegal(pieceToMove, move.targetSquare)) {
      // move the piece: piece.move()
      // update the board: board.move()
      // update game history: history.addMove()
      this.board.movePiece(pieceToMove, move)


      // increase move number and change whose turn it is
      this.move++;
      this.changeTurn();
    } else {

    }
  }

  logBoard() {
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

    console.log('------------------------');
    for (let y = 0; y < 8; y++) {
      let rank = '';
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
      console.log(rank);
    }
    console.log('------------------------');
  }

  // run the game
  play() {
    console.log('Setting board');
    this.board.setBoard(this.pieces);
    // get all legal moves
    // wait for move to be selected
    // check move is legal
    // move the piece: piece.move()
    // update the board: board.move()
    // update game history: history.addMove()
    // update turn: this.changeTurn()
    // stop players clock and start next players clock
    // start next turn
    
  }
}

const gameTest = new Game(pieceSetup);

// test moves
// e4, d4
// exd4, Qxd4

module.exports = Game;