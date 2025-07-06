import {Players} from './GameController';

export interface WinStrategy {
  checkWinner(board: (string | null)[][]): Players | 'draw' | null;
}

export class DefaultWinStrategy implements WinStrategy {
  checkWinner(board: (string | null)[][]): Players | 'draw' | null {
    const size = board.length;

    // Rows and columns
    for (let i = 0; i < size; i++) {
      if (board[i][0] && board[i].every(cell => cell === board[i][0])) {
        return board[i][0] as Players;
      }

      const col = board.map(row => row[i]);
      if (col[0] && col.every(cell => cell === col[0])) {
        return col[0] as Players;
      }
    }

    // Diagonals
    const diag1 = board.map((row, i) => row[i]);
    if (diag1[0] && diag1.every(cell => cell === diag1[0])) {
      return diag1[0] as Players;
    }

    const diag2 = board.map((row, i) => row[size - 1 - i]);
    if (diag2[0] && diag2.every(cell => cell === diag2[0])) {
      return diag2[0] as Players;
    }

    // Draw
    if (board.every(row => row.every(cell => cell !== null))) {
      return 'draw';
    }

    return null;
  }
}
