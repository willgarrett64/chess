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
    this.src = `./images/pieces/${color}-${type}`;
    this.type = type;
    this.typeCode = getTypeCode(type);
    this.value = getValue(type);
    this.color = color;
    this.AN = AN;
    this.x = ANToXy(AN)[0];
    this.y = ANToXy(AN)[1];
    this.initPos = true;
    this.captured = false;
    this.promoted = false;
    this.moves = getMoves(type, color)
  }

  // get array of x and y co-ordinates
  get xy() {
    return [this.x, this.y];
  } 

  // set initial position to false if pieces first move
  makeFirstMove() {
    this.initPos = false;
  }

  // reset initial position to true
  resetInitPos() {
    this.initPos = true;
  }

  // move a piece by updating its positional properties
  move(newAN) {
    this.x = ANToXy(newAN)[0];
    this.y = ANToXy(newAN)[1];
    this.AN = newAN;
    // set initial position to false
    if (this.initPos) {
      this.makeFirstMove();
    }
  }

  // set the captured property of the piece
  setCaptured() {
    this.x = null;
    this.y = null;
    this.AN = null;
    this.captured = true;
  }

  // update piece properties when being promoted
  promotePawn(promoteTo) {
    this.type = promoteTo;
    this.moves = getMoves(promoteTo, this.color);
    this.typeCode = getTypeCode(promoteTo);
    this.value = getValue(promoteTo);
    this.id += this.typeCode;
    this.src = `./images/pieces/${this.color}-${this.type}`;
    this.promoted = true;
  }
}

module.exports = ChessPiece;