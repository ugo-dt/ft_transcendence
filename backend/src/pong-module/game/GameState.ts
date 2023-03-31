import Ball, { IBall } from "./Ball"
import { IPlayer, Player } from "./Player";

export interface IGameState {
  ball: IBall,
  leftPlayer: IPlayer,
  rightPlayer: IPlayer,
}

export class GameState {
  private _canvasWidth: number;
  private _canvasHeight: number;
  private _ball: Ball;
  private _leftPlayer: Player;
  private _rightPlayer: Player;

  constructor(
    canvasWidth: number,
    canvasHeight: number,
  ) {
    this._canvasWidth = canvasWidth;
    this._canvasHeight = canvasHeight;
    this._leftPlayer = new Player(0, "Player", null, 20);
    this._rightPlayer= new Player(1, "Player", null, 615);
    this._ball = new Ball(this._canvasWidth / 2, this._canvasHeight / 2, "white", true);
  }

  public IGameState(): IGameState {
    return {
      ball: this._ball.IBall(),
      leftPlayer: this._leftPlayer.IPlayer(),
      rightPlayer: this._rightPlayer.IPlayer(),
    }
  }

  public update() {
    this._ball.update(this._canvasWidth, this._canvasHeight);
  }
}
