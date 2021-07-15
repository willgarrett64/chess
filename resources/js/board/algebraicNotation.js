// from x-y co-ordinates, calculate the coresponding algebraic notation (AN)
const xyToAN = (x, y) => {
  const file = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x];
  const rank = 8 -  y;
  return file + rank;
}

// from algebraic notation (AN), calculate the coresponding x-y co-ordinates
const ANToXy = (AN) => {
  const x = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(AN[0]);
  const y = 8 - AN[1];
  return [x, y];
}

// get the alebraic notation for a move
const getMoveNotation = (move) => {
  const initSquare = move.initSquare;
  const type = move.id[0];
  const targetSquare = xyToAN(move.move[0], move.move[y]);
  const capture = move.capture;

  const moveAN = type + (capture ? 'x' : '') + targetSquare;
  return moveAN;
}

module.exports = {
  xyToAN: xyToAN,
  ANToXy: ANToXy
};