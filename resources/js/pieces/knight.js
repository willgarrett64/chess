const ChessPiece = require('./ChessPiece');

class Knight extends ChessPiece {
  constructor(color, AN) {
    super(color, AN);
    this._type = 'knight';
    this._moves = [[-1, -2], [-2, -1], [1, -2], [-2, 1], [2, -1], [-1, 2], [2, 1], [1, 2]];
  }

  get type() {
    return this._type;
  }
  
  get moves() {
    return this._moves;
  }
}

module.exports = Knight;
