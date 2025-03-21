"use strict"
import {
  Board,
  BoardCell,
  BoardPosition,
  BoardRow,
  Player,
  RemainingMoves,
  WinningState,
  WinStatus
} from "./types"

/**
 * The size of a row or column.
 */
const rowAndColumnSize = 4;

/**
 * The WinningState instance representing no winner.
 */
const noWinningState: WinningState = {
  bitmask: 0b0000000000000000,
  description: "No winner"
}

/**
 * The WinningState instances representing all the different ways of winning.
 */
const winningStates: ReadonlyArray<WinningState> = [
  {
    bitmask: 0b0000000000001111,
    description: "Row 0"
  },
  {
    bitmask: 0b0000000011110000,
    description: "Row 1"
  },
  {
    bitmask: 0b0000111100000000,
    description: "Row 2"
  },
  {
    bitmask: 0b1111000000000000,
    description: "Row 3"
  },
  {
    bitmask: 0b0001000100010001,
    description: "Column 0"
  },
  {
    bitmask: 0b0010001000100010,
    description: "Column 1"
  },
  {
    bitmask: 0b0100010001000100,
    description: "Column 2"
  },
  {
    bitmask: 0b1000100010001000,
    description: "Column 3"
  },
  {
    bitmask: 0b1000010000100001,
    description: "Upper left to lower right diagonal"
  },
  {
    bitmask: 0b001001001001000,
    description: "Upper right to lower left diagonal"
  },
  {
    bitmask: 0b1001000000001001,
    description: "All four corners"
  },
  {
    bitmask: 0b1001000000001001,
    description: "All four corners"
  },
  {
    bitmask: 0b1001000000001001,
    description: "All four corners"
  },
  {
    bitmask: 0b1001000000001001,
    description: "All four corners"
  },
  {
    bitmask: 0b1001000000001001,
    description: "All four corners"
  },
  {
    bitmask: 0b0000000000110011,
    description: "2x2 box in the upper left corner"
  },
  {
    bitmask: 0b0000000001100110,
    description: "2x2 box in the top middle"
  },
  {
    bitmask: 0b0000000011001100,
    description: "2x2 box in the upper right corner"
  },

  {
    bitmask: 0b0000001100110000,
    description: "2x2 box in the middle left"
  },
  {
    bitmask: 0b0000011001100000,
    description: "2x2 box in the center"
  },
  {
    bitmask: 0b0000110011000000,
    description: "2x2 box in the middle right"
  },
  {
    bitmask: 0b0011001100000000,
    description: "2x2 box in the lower left corner"
  },
  {
    bitmask: 0b0110011000000000,
    description: "2x2 box in the bottom middle"
  },
  {
    bitmask: 0b1100110000000000,
    description: "2x2 box in the lower right corner"
  },
];

/**
 * The WinStatus instance returned when there is no winner.
 */
const noWinner: WinStatus = {
  winner: Player.None,
  winCode: noWinningState.bitmask,
  winDescription: noWinningState.description,
}

/**
 * Helper function used to create an empty board.
 */
export const createEmptyBoard = (): Board => {
  const emptyBoard: Partial<Board> = [];

  for (let rowIndex = 0; rowIndex < rowAndColumnSize; rowIndex++) {
    const row: Partial<BoardRow> = [];
    for (let columnIndex = 0; columnIndex < rowAndColumnSize; columnIndex++) {
      row.push(Player.None)
    }
    emptyBoard.push(row as BoardRow)
  }

  return emptyBoard as Board;
};

export const parseBoard = (boardStr: string): Board => {
  const rowStrs = boardStr.trim().split(/\r?\n/).filter(line => line.trim() !== "");
  if (rowStrs.length !== rowAndColumnSize) {
    throw Error(`Board contains an invalid number of rows: ${rowStrs.length} != ${rowAndColumnSize}`)
  }

  const board: Partial<Board> = [];
  for (let rowIndex = 0; rowIndex < rowAndColumnSize; rowIndex++) {
    const columnStrs = rowStrs[rowIndex].replace(/\s+/g, "").toUpperCase().split("|");
    if (columnStrs.length !== rowAndColumnSize) {
      throw Error(`Row ${rowIndex} contains an invalid number of columns: ${columnStrs.length} != ${rowAndColumnSize}`)
    }

    const row: Partial<BoardRow> = [];
    for (let columnIndex = 0; columnIndex < rowAndColumnSize; columnIndex++) {
      const move = columnStrs[columnIndex];
      switch (move) {
        case "":
          row.push(Player.None);
          break;
        case "X":
          row.push(Player.X);
          break;
        case "O":
          row.push(Player.O);
          break;
        default:
          throw Error(`Invalid move at row ${rowIndex}, column ${columnIndex}: ${move}`)
      }
    }

    board.push(row as BoardRow);
  }

  return board as Board;
}

/**
 * The TicTacToe class contains the logic needed to determine if a provided board's game has ended, whether the
 * board contains a winner, and what moves are left to make (i.e., what cells are still open).
 */
export default class TicTacToe {
  private readonly winStatus: WinStatus;
  private readonly remainingMoves: RemainingMoves;
  private readonly gameOver: boolean;

  /**
   * Takes a tic-tac-toe board and extracts it's state.
   * @param board the current game board
   */
  constructor(board: Board) {
    const [playerXMovesBitmask, playerOMovesBitmask, remainingMoves] = this.processBoardState(board);

    this.remainingMoves = remainingMoves

    const playerXWinStatus = this.processPlayerMoves(Player.X, playerXMovesBitmask);
    const playerOWinStatus = this.processPlayerMoves(Player.O, playerOMovesBitmask);

    if (playerXWinStatus.winCode !== noWinner.winCode) {
      if (playerOWinStatus.winCode !== noWinner.winCode) {
        throw new Error(
            "The board contains winning moves for both players: " +
            `Player X = "${playerXWinStatus.winDescription}" and Player O = "${playerOWinStatus.winDescription}"`
        )
      }
      this.winStatus = playerXWinStatus;
    } else {
      this.winStatus = playerOWinStatus;
    }

    this.gameOver = this.winStatus.winCode !== noWinner.winCode || remainingMoves.length === 0;
  }

  /**
   * Takes a board and creates bitmasks representing the player moves and the list of remaining moves.
   * @param board the current game board
   */
  private processBoardState(board: Board): [number, number, BoardCell[]] {
    const remainingMoves: BoardCell[] = []
    let playerXMovesBitmask: number = 0
    let playerOMovesBitmask: number = 0
    let currentBit: number = 1

    for (let row = 0; row < rowAndColumnSize; row++) {
      for (let column = 0; column < rowAndColumnSize; column++) {
        const cellValue = board[row][column];

        switch (cellValue) {
          case Player.X:
            playerXMovesBitmask |= currentBit;
            break;
          case Player.O:
            playerOMovesBitmask |= currentBit;
            break;
          case Player.None:
            remainingMoves.push({
              row: row as BoardPosition,
              column: column as BoardPosition
            });
            break;
          default:
            throw new TypeError(`Unknown Player value at row ${row}, column ${column}: ${cellValue}`)
        }

        currentBit = currentBit << 1;
      }
    }

    return [playerXMovesBitmask, playerOMovesBitmask, remainingMoves]
  }

  /**
   * Examines a players moves and determines if they have won.
   * @param player The player whose moves are being examined
   * @param movesBitmask the player's moves bitmask
   */
  private processPlayerMoves(player: Player, movesBitmask: number): WinStatus {
    for (let i = 0; i < winningStates.length; i++) {
      const winningState = winningStates[i];
      if ((movesBitmask & winningState.bitmask) === winningState.bitmask) {
        return {
          winner: player,
          winCode: winningState.bitmask,
          winDescription: winningState.description,
        }
      }
    }

    return noWinner;
  }

  /**
   * Returns the status object representing the win state of the game.
   */
  public checkWinner(): WinStatus {
    return this.winStatus;
  }

  /**
   * Returns the list of available moves.
   */
  public anyMovesLeft(): RemainingMoves {
    return this.remainingMoves;
  }

  /**
   * Returns true if there is no winner and still available moves in the game, false otherwise.
   */
  public isGameOver(): boolean {
    return this.gameOver;
  }
}
