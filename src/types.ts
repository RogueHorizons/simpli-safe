"use strict"

export const Player = {
  None: 0,
  X: 1,
  O: 2
} as const;

export type Player = typeof Player[keyof typeof Player];

/* Create the types to enforce a 4x4 board */
export type BoardPosition = 0 | 1 | 2 | 3;
export type BoardRow = [Player, Player, Player, Player];
export type Board = [BoardRow, BoardRow, BoardRow, BoardRow];

export type BoardCell = {
  row: BoardPosition,
  column: BoardPosition
};

export type RemainingMoves = ReadonlyArray<BoardCell>;

/**
 * Used to match game states to winning states.
 */
export interface WinningState {
  readonly bitmask: number,
  readonly description: string
}

/**
 * Relates winning game information.
 */
export interface WinStatus {
  readonly winner: Player,
  readonly winCode: number,
  readonly winDescription: string,
}
