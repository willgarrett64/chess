import { Game } from "./Game.js";

class GameBrowser extends Game {
  constructor(pieceSetup) {
    super(pieceSetup);

  }


  // Create the piece element for the browser
  createPieceNode(piece) {
    const pieceNode = createElement('img');
    pieceNode.className = "piece";
    pieceNode.src = piece.src;
    pieceNode.id = piece.id;
    pieceNode.draggable = true;
    pieceNode.addEventListener("dragstart", dragStart);
    piece.element = pieceNode;
  }

  // Add the piece to the start square board on the broswer
  addPieceNodeToBoard(piece) {
    const pieceNode = this.createPieceNode(piece);
    const squareNode = document.getElementById(piece.AN);
    squareNode.appendChild(pieceNode)
  }  
}