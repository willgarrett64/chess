const { xyToAN, ANToXy } = require('../board/algebraicNotation');

const getMoves = (type, color) => {
  switch (type) {
    case 'pawn':
      if (color === 'b') return [[0, 1], [0, 2], [1, 1], [-1, 1]]
      else return [[0, -1], [0, -2], [1, -1], [-1, -1]];
    case 'bishop':
      return [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    case 'knight':
      return [[-1, -2], [-2, -1], [1, -2], [-2, 1], [2, -1], [-1, 2], [2, 1], [1, 2]];
    case 'rook':
      return [[1, 0], [-1, 0], [0, 1], [0, -1]];
    case 'queen':
      return [[1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [0, -1], [1, 0], [-1, 0]];
    case 'king':
      return [[1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [0, -1], [1, 0], [-1, 0]];
  }
}

const getValue = (type) => {
  switch (type) {
    case 'pawn':
      return 1;
    case 'rook':
      return 5;
    case 'queen':
      return 9;
    case 'king': // king doesn't actually have a value
      return 0; 
    default: // bishop and knight
      return 3;
  }
}

const getTypeCode = (type) => {
  if (type === 'knight') {
    return 'N';
  } else {
    return type[0].toUpperCase();
  }
}

class ChessPiece {
  constructor(type, color, AN) {
    this.id = color + getTypeCode(type) + AN;
    this.src = `./images/pieces/${color}-${type}`
    this.type = type;
    this.typeCode = getTypeCode(type);
    this.value = getValue(type);
    this.color = color;
    this.AN = AN;
    this.x = ANToXy(AN)[0];
    this.y = ANToXy(AN)[1];
    this.initPos = true;
    this.captured = false;
    this.moves = getMoves(type, color)
  }

  get xy() {
    return [this.x, this.y];
  } 

  makeFirstMove() {
    this.initPos = false;
  }

  resetInitPos() {
    this.initPos = true;
  }

  move(newAN) {
    this.x = ANToXy(newAN)[0];
    this.y = ANToXy(newAN)[1];
    this.AN = newAN;
    if (this.initPos) {
      this.makeFirstMove();
    }
  }

  setCaptured() {
    this.x = null;
    this.y = null;
    this.AN = null;
    this.captured = true;
  }
}

module.exports = ChessPiece;