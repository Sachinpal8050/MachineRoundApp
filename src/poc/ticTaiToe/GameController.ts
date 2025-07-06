import {WinStrategy, DefaultWinStrategy} from './WinStrategy';

export enum Players {
  X = 'X',
  O = 'O',
}

export class GameController {
  board: (string | null)[][];
  currPlayer: Players;
  private history: {row: number; col: number; player: Players}[] = [];
  private winStrategy: WinStrategy;

  constructor(
    boardSize: number,
    currentPlayer: Players,
    strategy = new DefaultWinStrategy(),
  ) {
    this.board = Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(null));
    this.currPlayer = currentPlayer;
    this.winStrategy = strategy;
  }

  getCurrentPlayer(): Players {
    return this.currPlayer;
  }

  getBoard(): (string | null)[][] {
    return this.board.map(row => [...row]);
  }

  makeMove(row: number, col: number): boolean {
    if (this.board[row][col]) {
      return false;
    }
    this.board[row][col] = this.currPlayer;
    this.history.push({row, col, player: this.currPlayer});
    this.currPlayer = this.currPlayer === Players.X ? Players.O : Players.X;
    return true;
  }

  undoMove(): void {
    const last = this.history.pop();
    if (last) {
      this.board[last.row][last.col] = null;
      this.currPlayer = last.player;
    }
  }

  checkWinner(): Players | 'draw' | null {
    return this.winStrategy.checkWinner(this.board);
  }
}
