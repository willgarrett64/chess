const { setNewBoard, getInitPieces } = require('../board/board');


class Game {
  constructor() {
    this.board = {current: setNewBoard(), history: []};
    this.pieces = getInitPieces();
    this.turn = 'w';
    this.checkmate = false;
    this.winner = null;
  }

  nextTurn() {
    const nextTurn = this.turn === 'w' ? 'b' : 'w';
    this.turn = nextTurn;
  }


  play() {
    console.log('start game');
    this.nextTurn();
  }
}

const gameOne = new Game;
console.log(gameOne);

