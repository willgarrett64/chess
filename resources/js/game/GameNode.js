import { Game } from "./Game.js";

import * as colors from 'colors';
import PromptSync from 'prompt-sync';
const prompt = PromptSync({sigint: true})

class GameNode extends Game {
  constructor(pieceSetup) {
    super(pieceSetup);

  }

  // get promotion input on node
  nodePromotionInput() {
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

    return promoteTo;
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
      let lastPiece;
      this.board.captured[color].forEach(piece => {
        if (piece.typeCode !== lastPiece) {
          capturedString += ' ';
        }
        capturedString += piece.typeCode;
        lastPiece = piece.typeCode;
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
    while (!this.gameEnd) {
      console.clear();
      this.printBoard();
      this.printCaptured();

      const color = this.turn === 'w' ? 'White' : 'Black';
      console.log(color + ' to move');
      
      let allLegalMoves = this.getAllLegalMoves();
      const move = this.getUserMoveNode(allLegalMoves);
      this.makeMove(move);
      this.verifyMate(this.getAllLegalMoves());
      this.verifyDraw();
    }
    

    // print end game board and winning condition
    console.clear();
    this.printBoard();
    this.printCaptured();
    // log winner/draw to console
    switch (this.gameEnd) {
      case 'c':
        console.log(`Checkmate - ${this.winner} wins!`);
        break;
      case 's':
        console.log("Draw - by stalemate");
        break;
      case 'dm':
        console.log("Draw - by insufficient material");
        break;
      case 'dr':
        console.log("Draw - by repeat moves");
        break;
      default:
        break;
    }
    
  }
}