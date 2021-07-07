const ChessPiece = require('./ChessPiece');

class Bishop extends ChessPiece {
  constructor(color, AN) {
    super(color, AN);
    this._type = 'bishop';
    this._moves = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  }

  get type() {
    return this._type;
  }

  get moves() {
    return this._moves;
  }
}

module.exports = Bishop;

