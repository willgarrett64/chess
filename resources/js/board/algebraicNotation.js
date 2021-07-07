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

module.exports = {
  xyToAN: xyToAN,
  ANToXy: ANToXy
};