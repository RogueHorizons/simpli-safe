"use strict"
import * as fs from "fs";
import * as path from "path";
import TicTacToe, {parseBoard} from "./src/TicTacToe"
import {Board, Player, WinStatus} from "./src/types";

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: yarn main <file-path>");
  process.exit(1);
}
const absolutePath = path.resolve(filePath);

let boardStr: string;
try {
  boardStr = fs.readFileSync(absolutePath, "utf8");
} catch (e) {
  const err = e as Error;
  console.error("Error reading game file:", err.message);
  process.exit(1);
}

let ticTacToe: TicTacToe;
try {
  const board: Board = parseBoard(boardStr);
  ticTacToe = new TicTacToe(board);
} catch (e) {
  const err = e as Error;
  console.error("Error processing game board:", err.message);
  process.exit(1);
}

if (ticTacToe.isGameOver()) {
  if (ticTacToe.anyMovesLeft().length === 0) {
    console.log("Game over, no winner and no moves remaining.");
  } else {
    const winStatus: WinStatus = ticTacToe.checkWinner();
    if (winStatus.winner !== Player.None) {
      const winner = winStatus.winner === Player.X ? "X" : "O";
      console.log(`Game over, player ${winner} wins: ${winStatus.winDescription}.`);
    }  else {
      console.log("Game over for unknown reason.");
    }
  }
} else {
  console.log("No winner, remaining moves:");
  ticTacToe.anyMovesLeft().forEach((boardCell) => {
    console.log(`  row ${boardCell.row}, column ${boardCell.column}`)
  })
}
