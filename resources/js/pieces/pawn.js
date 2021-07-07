const ChessPiece = require('./ChessPiece');

class Pawn extends ChessPiece {
  constructor(color, AN) {
    super(color, AN);
    this._type = 'pawn';
    this._moves = this.color === 'b' ? [[0, 1], [0, 2], [1, 1], [-1, 1]] : [[0, -1], [0, -2], [1, -1], [-1, -1]];
  }

  get type() {
    return this._type;
  }

  get moves() {
    return this._moves;
  }
}

module.exports = Pawn;