import Client from "../Client/Client";
import Ball, { IBall } from "./Ball";
import Paddle, { IPaddle } from "./Paddle";
import { IPlayer, Player } from "./Player";

const CANVAS_WIDTH = 650;
const CANVAS_HEIGHT = 480;
const WIN_SCORE = 1;

export interface IGameState {
  ball: IBall,
  leftPlayer: IPlayer,
  rightPlayer: IPlayer,
  leftPaddle: IPaddle,
  rightPaddle: IPaddle,
  gameOver: boolean,
}

interface Time {
  fps: number,
  interval: NodeJS.Timer | null,
  previous: number,
  current: number,
  deltaTime: number,
}

export class GameState {
  private _canvasWidth: number;
  private _canvasHeight: number;
  private _ball: Ball;
  private _leftPlayer: Player;
  private _rightPlayer: Player;
  private _leftPaddle: Paddle;
  private _rightPaddle: Paddle;
  private _time: Time;
  private _gameOver: boolean;

  constructor(left: Client, right: Client) {
    this._canvasWidth = CANVAS_WIDTH;
    this._canvasHeight = CANVAS_HEIGHT;
    this._leftPlayer = new Player(0, left.username, left.avatar, true, left.backgroundColor);
    this._rightPlayer = new Player(1, right.username, left.avatar, false, right.backgroundColor);
    this._leftPaddle = new Paddle(20);
    this._rightPaddle = new Paddle(615);
    this._ball = new Ball(this._canvasWidth / 2, this._canvasHeight / 2, "white", false);
    this._time = {
      fps: 120,
      interval: null,
      previous: 0,
      current: 0,
      deltaTime: 0,
    }
    this._gameOver = false;
  }

  public get canvasWidth(): number { return this._canvasWidth; }
  public get canvasHeight(): number { return this._canvasHeight; }
  public get ball(): Ball { return this._ball; }
  public get leftPlayer(): Player { return this._leftPlayer; }
  public get rightPlayer(): Player { return this._rightPlayer; }
  public get leftPaddle(): Paddle { return this._leftPaddle; }
  public get rightPaddle(): Paddle { return this._rightPaddle; }
  public get gameOver(): boolean { return this._gameOver; }

  public set canvasWidth(canvasWidth: number) { this._canvasWidth = canvasWidth; }
  public set canvasHeight(canvasHeight: number) { this._canvasHeight = canvasHeight; }
  public set ball(ball: Ball) { this._ball = ball; }
  public set leftPlayer(leftPlayer: Player) { this._leftPlayer = leftPlayer; }
  public set rightPlayer(rightPlayer: Player) { this._rightPlayer = rightPlayer; }
  public set leftPaddle(leftPaddle: Paddle) { this._leftPaddle = leftPaddle; }
  public set rightPaddle(rightPaddle: Paddle) { this._rightPaddle = rightPaddle; }
  public set gameOver(gameOver: boolean) { this._gameOver = gameOver; }

  /* Time */
  public get fps(): number { return this._time.fps; }
  public get interval(): NodeJS.Timer | null { return this._time.interval; }
  public get previous(): number { return this._time.previous; }
  public get current(): number { return this._time.current; }
  public get deltaTime(): number { return this._time.deltaTime; }
  
  public set fps(fps: number) { this._time.fps = fps; }
  public set interval(interval: NodeJS.Timer | null) { this._time.interval = interval; }
  public set previous(previous: number) { this._time.previous = previous; }
  public set current(current: number) { this._time.current = current; }
  public set deltaTime(deltaTime: number) { this._time.deltaTime = deltaTime; }

  public IGameState(): IGameState {
    return {
      ball: this._ball.IBall(),
      leftPlayer: this._leftPlayer.IPlayer(),
      rightPlayer: this._rightPlayer.IPlayer(),
      leftPaddle: this._leftPaddle.IPaddle(),
      rightPaddle: this._rightPaddle.IPaddle(),
      gameOver: this._gameOver,
    }
  }

  public update() {
    if (this.leftPlayer.score >= WIN_SCORE || this.rightPlayer.score >= WIN_SCORE) {
      this._gameOver = true;
    }
    this._leftPlayer.update(480, this.leftPaddle, this._time.deltaTime);
    this._rightPlayer.update(480, this.rightPaddle, this._time.deltaTime);
    this._ball.update(this._canvasWidth, this._canvasHeight, this._time.deltaTime, this._leftPaddle, this._rightPaddle, this.leftPlayer, this.rightPlayer);
  }
}
