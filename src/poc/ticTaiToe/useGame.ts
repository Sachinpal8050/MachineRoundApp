import {useState} from 'react';
import {GameController, Players} from './GameController';
import {MoveCommand} from './moveCmd';

export function useGame(boardSize = 3) {
  const [controller, setGameController] = useState(
    () => new GameController(boardSize, Players.X),
  );
  const [board, setBoard] = useState(controller.getBoard());
  const [winner, setWinner] = useState<Players | 'draw' | null>(null);

  const makeMove = (row: number, col: number) => {
    const move = new MoveCommand(controller, row, col);
    const moved = move.execute();
    if (moved) {
      setBoard(controller.getBoard());
      const result = controller.checkWinner();
      if (result) {
        setWinner(result);
      }
    }
  };

  const undoMove = () => {
    controller.undoMove();
    setBoard(controller.getBoard());
    setWinner(null);
  };
  const reset = () => {
    const newGame = new GameController(3, Players.X);
    setGameController(newGame);
    setBoard(newGame.board);
    setWinner(null);
  };

  return {
    board,
    winner,
    currentPlayer: controller.getCurrentPlayer(),
    makeMove,
    undoMove,
    reset,
  };
}
