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
    this._leftPlayer = new Player(0, "Player", null, 20, true);
    this._rightPlayer = new Player(1, "Player", null, 615, false);
    this._ball = new Ball(this._canvasWidth / 2, this._canvasHeight / 2, "white", true);
  }

  public get canvasWidth(): number { return this._canvasWidth; }
  public get canvasHeight(): number { return this._canvasHeight; }
  public get ball(): Ball { return this._ball; }
  public get leftPlayer(): Player { return this._leftPlayer; }
  public get rightPlayer(): Player { return this._rightPlayer; }

  public set canvasWidth(canvasWidth: number) { this._canvasWidth = canvasWidth; }
  public set canvasHeight(canvasHeight: number) { this._canvasHeight = canvasHeight; }
  public set ball(ball: Ball) { this._ball = ball; }
  public set leftPlayer(leftPlayer: Player) { this._leftPlayer = leftPlayer; }
  public set rightPlayer(rightPlayer: Player) { this._rightPlayer = rightPlayer; }

  public IGameState(): IGameState {
    return {
      ball: this._ball.IBall(),
      leftPlayer: this._leftPlayer.IPlayer(),
      rightPlayer: this._rightPlayer.IPlayer(),
    }
  }

  public update() {
    this._leftPlayer.update(650);
    this._rightPlayer.update(650);
    this._ball.update(this._canvasWidth, this._canvasHeight, this._leftPlayer.paddle, this._rightPlayer.paddle);
  }
}
