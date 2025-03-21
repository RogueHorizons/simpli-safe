import { describe, test, expect } from "@jest/globals";
import TicTacToe, { parseBoard } from "./TicTacToe";
import {Board, WinStatus, RemainingMoves, Player} from "./types";

const setup = (boardStr: string): [TicTacToe, WinStatus, RemainingMoves] => {
  const board: Board = parseBoard(boardStr);
  const ticTacToe: TicTacToe = new TicTacToe(board);
  return [ticTacToe, ticTacToe.checkWinner(), ticTacToe.anyMovesLeft()];
}

describe('Empty board', () => {
  const [ticTacToe, winStatus, remainingMoves] = setup(`
       | | | \n
       | | | \n
       | | | \n
       | | | `
  );

  test("game over", () => {
    expect(ticTacToe.isGameOver()).toBe(false);
  });

  test("winning user", () => {
    expect(winStatus.winner).toBe(Player.None);
  });

  // Not using a reference to the winning state so that the test fails if we change the underlying win code.
  test("win code", () => {
    expect(winStatus.winCode).toBe(0);
  });

  test("remaining move count", () => {
    expect(remainingMoves.length).toBe(16);
  });
});

describe('Full board with no winner', () => {
  const [ticTacToe, winStatus, remainingMoves] = setup(`
      X|O|X|O\n
      X|O|X|O\n
      O|X|O|X\n
      O|X|O|X`
  );

  test("game over", () => {
    expect(ticTacToe.isGameOver()).toBe(true);
  });

  test("winning user", () => {
    expect(winStatus.winner).toBe(Player.None);
  });

  // Not using a reference to the winning state so that the test fails if we change the underlying win code.
  test("win code", () => {
    expect(winStatus.winCode).toBe(0);
  });

  test("remaining move count", () => {
    expect(remainingMoves.length).toBe(0);
  });
});

describe('Player X wins with row 0', () => {
  const [ticTacToe, winStatus, remainingMoves] = setup(`
      X|X|X|X\n
      O| | |O\n
       | | | \n
      O| | |O`
  );

  test("game over", () => {
    expect(ticTacToe.isGameOver()).toBe(true);
  });

  test("winning user", () => {
    expect(winStatus.winner).toBe(Player.X);
  });

  // Not using a reference to the winning state so that the test fails if we change the underlying win code.
  test("win code", () => {
    expect(winStatus.winCode).toBe(15);
  });

  test("remaining move count", () => {
    expect(remainingMoves.length).toBe(8);
  });
});

describe('Player O wins with the four corners', () => {
  const [ticTacToe, winStatus, remainingMoves] = setup(`
      O|X|X|O\n
      X| | |X\n
       | | | \n
      O| | |O`
  );

  test("game over", () => {
    expect(ticTacToe.isGameOver()).toBe(true);
  });

  test("winning user", () => {
    expect(winStatus.winner).toBe(Player.O);
  });

  // Not using a reference to the winning state so that the test fails if we change the underlying win code.
  test("win code", () => {
    expect(winStatus.winCode).toBe(36873);
  });

  test("remaining move count", () => {
    expect(remainingMoves.length).toBe(8);
  });
});

describe('Player X wins with a 2x2 box in the center', () => {
  const [ticTacToe, winStatus, remainingMoves] = setup(`
       | | | \n
      O|X|X|O\n
       |X|X| \n
      O| | |O`
  );

  test("game over", () => {
    expect(ticTacToe.isGameOver()).toBe(true);
  });

  test("winning user", () => {
    expect(winStatus.winner).toBe(Player.X);
  });

  // Not using a reference to the winning state so that the test fails if we change the underlying win code.
  test("win code", () => {
    expect(winStatus.winCode).toBe(1632);
  });

  test("remaining move count", () => {
    expect(remainingMoves.length).toBe(8);
  });
});

// Add additional tests given more time...
