import Ball, { IBall } from "./Ball"
import Paddle, { IPaddle } from "./Paddle";
import { IPlayer, Player } from "./Player";

export interface IGameState {
  ball: IBall,
  leftPlayer: IPlayer,
  rightPlayer: IPlayer,
  leftPaddle: IPaddle
  rightPaddle: IPaddle,
}

export class GameState {
  private _canvasWidth: number;
  private _canvasHeight: number;
  private _ball: Ball;
  private _leftPlayer: Player;
  private _rightPlayer: Player;
  private _leftPaddle: Paddle;
  private _rightPaddle: Paddle;

  constructor(
    canvasWidth: number,
    canvasHeight: number,
  ) {
    this._canvasWidth = canvasWidth;
    this._canvasHeight = canvasHeight;
    this._leftPlayer = new Player(0, "Player", null, true);
    this._rightPlayer = new Player(1, "Player", null, false);
    this._leftPaddle = new Paddle(20);
    this._rightPaddle = new Paddle(615);
    this._ball = new Ball(this._canvasWidth / 2, this._canvasHeight / 2, "white", true);
  }

  public get canvasWidth(): number { return this._canvasWidth; }
  public get canvasHeight(): number { return this._canvasHeight; }
  public get ball(): Ball { return this._ball; }
  public get leftPlayer(): Player { return this._leftPlayer; }
  public get rightPlayer(): Player { return this._rightPlayer; }
  public get leftPaddle(): Paddle { return this._leftPaddle; }
  public get rightPaddle(): Paddle { return this._rightPaddle; }

  public set canvasWidth(canvasWidth: number) { this._canvasWidth = canvasWidth; }
  public set canvasHeight(canvasHeight: number) { this._canvasHeight = canvasHeight; }
  public set ball(ball: Ball) { this._ball = ball; }
  public set leftPlayer(leftPlayer: Player) { this._leftPlayer = leftPlayer; }
  public set rightPlayer(rightPlayer: Player) { this._rightPlayer = rightPlayer; }
  public set leftPaddle(leftPaddle: Paddle) { this._leftPaddle = leftPaddle; }
  public set rightPaddle(rightPaddle: Paddle) { this._rightPaddle = rightPaddle; }

  public IGameState(): IGameState {
    return {
      ball: this._ball.IBall(),
      leftPlayer: this._leftPlayer.IPlayer(),
      rightPlayer: this._rightPlayer.IPlayer(),
      leftPaddle: this._leftPaddle.IPaddle(),
      rightPaddle: this._rightPaddle.IPaddle(),
    }
  }

  public update() {
    this._leftPlayer.update(480, this.leftPaddle);
    this._rightPlayer.update(480, this.rightPaddle);
    this._ball.update(this._canvasWidth, this._canvasHeight, this._leftPaddle, this._rightPaddle);
  }
}
