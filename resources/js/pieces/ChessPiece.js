const { xyToAN, ANToXy } = require('../board/algebraicNotation');

class ChessPiece {
  constructor(color, AN) {
    this._color = color;
    this.AN = AN;
    this.x = ANToXy(AN)[0];
    this.y = ANToXy(AN)[1];
    this.initPos = true;
    this.captured = false;
  }
  
  get color() {
    return this._color;
  }

  get xy() {
    return [this.x, this.y];
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