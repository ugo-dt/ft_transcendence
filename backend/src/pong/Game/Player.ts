import Paddle from "./Paddle";

export interface IPlayer {
  id: number,
  isLeft: boolean,
  isCom: boolean,
  score: number,
}

export class Player {
  private _id: number;
  private _isLeft: boolean;
  private _keyUpPressed: boolean;
  private _keyDownPressed: boolean;
  private _score: number;

  constructor(
    id: number,
    isLeft: boolean,
  ) {
    this._id = id;
    this._isLeft = isLeft;
    this._keyUpPressed = false;
    this._keyDownPressed = false;
    this._score = 0;
  }

  public get id(): number { return this._id; }
  public get isLeft(): boolean { return this._isLeft; }
  public get keyUpPressed(): boolean { return this._keyUpPressed; }
  public get keyDownPressed(): boolean { return this._keyDownPressed; }
  public get score(): number { return this._score; }

  public set id(id: number) { this._id = id; }
  public set isLeft(isLeft: boolean) { this._isLeft = isLeft; }
  public set keyUpPressed(keyUpPressed: boolean) { this._keyUpPressed = keyUpPressed; }
  public set keyDownPressed(keyDownPressed: boolean) { this._keyDownPressed = keyDownPressed; }
  public set score(score: number) { this._score = score; }  

  public handleKeyUpPressed() { this.keyUpPressed = true; }
  public handleKeyUpUnpressed() { this.keyUpPressed = false; }
  public handleKeyDownPressed() { this.keyDownPressed = true; }
  public handleKeyDownUnpressed() { this.keyDownPressed = false; }

  public IPlayer(): IPlayer {
    return (
      {
        id: this._id,
        isLeft: this._isLeft,
        isCom: false,
        score: this._score,
      }
    );
  }

  public update(canvasHeight: number, paddle: Paddle, deltaTime: number) {
    if (this._keyUpPressed) {
      if (this._keyDownPressed) {
        paddle.velocityY = 0;
      }
      else {
        paddle.velocityY = -700 * deltaTime;
      }
    }
    else if (this._keyDownPressed) {
      paddle.velocityY = 700 * deltaTime;
    }
    else {
      paddle.velocityY = 0;
    }
    paddle.update(canvasHeight);
  }
}