# SimpliSafe Code Exercise

This repo contains Brian Watson's answer to the SimpleSafe coding exercise.

## Setup

You will need both `node` and `yarn`. Install needed modules with `yarn` as follows:
```
yarn install
```

## Game Board Format

The 4x4 game board is represented as text consisting of 4 lines for the rows, and 4 column values of
`X`, `O`, or a space delimited by pipes (`|`). This format was for its simplicity both in parsing and
for usage by end users. For example:

```
X| | |
X| | |O
X|O|O|O
X| | |
```

The input parser is lenient about empty cells that are missing a space. For example:

```
X|||
X|||O
X|O|O|O
X|||
```

## Running the Main Program

Save the game state to a file and run `yarn main` with the path to the game file. For example:

```
yarn main examples/game01.txt
```

## How the Code Works

Each winning state is represented internally as a bitmask accompanied by the description of the winning state.
The bitmask is a flattened version of the board with: 
- Bits 0-3 representing the row 0
- Bits 4-7 representing the row 1
- Bits 8-11 representing the row 2
- Bits 12-15 representing the row 3

Game boards are first parsed from text into a 4x4 matrix of arrays. This format was also chosen for its
simple usage by those using the TicTacToe class directly in code.

The TicTacToe class converts the 4x4 matrix 2 flattened bit sets like the one described above... one for player
X's moves, and one for player O's moves. While this conversion occurs, the class keeps tracks of which board
spaces are empty for later usage.

The bit sets for each player are then bitwise-AND'd with the winning state bit sets, and, if the result of
any AND matches that winning state's bitset, the player is deemed a winner. If the board contains winning
moves for both players, an `Error` is thrown.

This bitset solution was chosen for the following reasons:
- The conversion of player moves to bitsets and determination of empty spaces only requires one pass
through the 4x4 matrix.
- The bitset representation of the winning states is much simpler that code that would match given cell values
- Bitwise-AND'ing is an efficient and straight-forward way to match moves to winning states

## Game Results

A game is considered over if a) a winner is found, or b) the game board is full.

The winning results are returned as an object containing:
- The winning player (or None for no winner)
- The winning code, which is the bitset of the matched winning state (or 0 for no winner)
- A description of the wining (or non-winning) state

Requesting any remaining moves returns an array of the row/column pairs of empty board spaces. If this array
is empty, then no board spaces remain.

## Unit Tests

Unit tests are written in Jest. To run them, run:
```
yarn test
```
