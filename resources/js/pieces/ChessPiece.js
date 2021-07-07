const { xyToAN, ANToXy } = require('../board/algebraicNotation');

const getMoves = (type, color) => {
  switch (type) {
    case 'pawn':
      color === 'b' ? [[0, 1], [0, 2], [1, 1], [-1, 1]] : [[0, -1], [0, -2], [1, -1], [-1, -1]];
    case 'bishop':
      return [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    case 'knight':
      return [[-1, -2], [-2, -1], [1, -2], [-2, 1], [2, -1], [-1, 2], [2, 1], [1, 2]];
      break;
    case 'rook':
      return [[1, 0], [-1, 0], [0, 1], [0, -1]];
    case 'queen':
      return [[1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [0, -1], [1, 0], [-1, 0]];
    case 'king':
      return [[1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [0, -1], [1, 0], [-1, 0]];
  }
}

class ChessPiece {
  constructor(type, color, AN) {
    this._type = type;
    this._color = color;
    this.AN = AN;
    this.x = ANToXy(AN)[0];
    this.y = ANToXy(AN)[1];
    this.initPos = true;
    this.captured = false;
    this._moves = getMoves(type, color)
  }
  
  get color() {
    return this._color;
  }

  get xy() {
    return [this.x, this.y];
  } 

  get type() {
    return this._type;
  }

  get moves() {
    return this._moves;
  }

  resetInitPos() {
    this.initPos = true;
  }

  setNewPosition(newAN) {
    this.x = ANToXy(newAN)[0];
    this.y = ANToXy(newAN)[1];
    this.AN = newAN;
    if (this.initPos) {
      this.initPos = false;
    }
  }

  setCaptured() {
    this.captured = true;
  }
}

module.exports = ChessPiece;