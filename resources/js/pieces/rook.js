const ChessPiece = require('./ChessPiece');

class Rook extends ChessPiece {
  constructor(color, AN) {
    super(color, AN);
    this._type = 'rook';
    this._moves = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  }

  get type() {
    return this._type;
  }
  
  get moves() {
    return this._moves;
  }
}

module.exports = Rook;