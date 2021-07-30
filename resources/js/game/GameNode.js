import { Game } from "./Game.js";

import * as colors from 'colors';
import PromptSync from 'prompt-sync';
const prompt = PromptSync({sigint: true})

class GameNode extends Game {
  constructor(pieceSetup) {
    super(pieceSetup);

  }

  // get promotion input on node
  nodePromotionInput() {
    const legalPromoteTo = ['q', 'r', 'n', 'b'];
    let promoteTo;

    // get user input of which piece type they want to promote to
    do {
      console.clear();
      this.printBoard();

      console.log('Promote pawn - which piece would you like to promote to?\nq - queen\nr - rook\nn - knight\nb - bishop\n');
      promoteTo = prompt('>');
    } while (!legalPromoteTo.includes(promoteTo));
    
    // translate input into full piece name
    switch (promoteTo) {
      case 'q':
        promoteTo = 'queen';
        break
      case 'r':
        promoteTo = 'rook';
        break
      case 'n':
        promoteTo = 'knight';
        break
      case 'b':
        promoteTo = 'bishop';
        break
    }

    return promoteTo;
  }
  
}