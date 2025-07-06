import {GameController} from './GameController';

export class MoveCommand {
  constructor(
    private game: GameController,
    public row: number,
    public col: number,
  ) {}

  execute(): boolean {
    return this.game.makeMove(this.row, this.col);
  }

  undo(): void {
    this.game.undoMove();
  }
}
