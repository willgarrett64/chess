const ChessPiece = require('./ChessPiece');

class King extends ChessPiece {
  constructor(color, AN) {
    super(color, AN);
    this._type = 'king';
    this._moves = [[1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [0, -1], [1, 0], [-1, 0]];
  }

  get type() {
    return this._type;
  }
  
  get moves() {
    return this._moves;
  }
}

module.exports = King;