
const Game = require('./resources/js/game/Game')



//white pieces
const w = [
  ['rook', 'w', 'a1'], ['rook', 'w', 'h1'], ['knight', 'w', 'b1'], ['knight', 'w', 'g1'], ['bishop', 'w', 'c1'], ['bishop', 'w', 'f1'], ['queen', 'w', 'd1'], ['king', 'w', 'e1'], ['pawn', 'w', 'a2'], ['pawn', 'w', 'b2'], ['pawn', 'w', 'c2'], ['pawn', 'w', 'd2'], ['pawn', 'w', 'e2'], ['pawn', 'w', 'f2'], ['pawn', 'w', 'g2'], ['pawn', 'w', 'h2']
];
//black pieces
const b = [
  ['rook', 'b', 'a8'], ['rook', 'b', 'h8'], ['knight', 'b', 'b8'], ['knight', 'b', 'g8'], ['bishop', 'b', 'c8'], ['bishop', 'b', 'f8'], ['queen', 'b', 'd8'], ['king', 'b', 'e8'], ['pawn', 'b', 'a7'], ['pawn', 'b', 'b7'], ['pawn', 'b', 'c7'], ['pawn', 'b', 'd7'], ['pawn', 'b', 'e7'], ['pawn', 'b', 'f7'], ['pawn', 'b', 'g7'], ['pawn', 'b', 'h7']
];
const pieceSetup = {w: w, b: b}


const gameTest = new Game(pieceSetup);
gameTest.play()


// SIMULATE MOVES // 
const move1 = { piece: 'wPe2', startSquare: 'e2', targetSquare: 'e4', capture: false, canCapture: false, targetPiece: null };
const move2 = { piece: 'bPe7', startSquare: 'e7', targetSquare: 'e5', capture: false, canCapture: false, targetPiece: null };
const move3 = { piece: 'wBf1', startSquare: 'f1', targetSquare: 'b5', capture: false, canCapture: true, targetPiece: null };
// const move4 = { piece: 'bQd8', startSquare: 'd8', targetSquare: 'd5', capture: true, canCapture: true, targetPiece: 'wPe2' };


// gameTest.board.movePiece(move1)
// gameTest.logBoard()
// gameTest.changeTurn();

// gameTest.board.movePiece(move2)
// gameTest.logBoard()
// gameTest.changeTurn();

// gameTest.board.movePiece(move3)
// gameTest.logBoard()
// gameTest.changeTurn();

// gameTest.board.movePiece(move4)
// gameTest.logBoard()
// gameTest.changeTurn();

// gameTest.getAllLegalMoves()


// test moves
// e4, d4
// exd4, Qxd4