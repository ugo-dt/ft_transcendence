import Paddle from "./Paddle";

export interface IPlayer {
  id: number,
  name: string,
  avatar: string | null,
  isLeft: boolean,
  isCom: boolean,
  score: number,
  backgroundColor: string | null,
}

export class Player {
  private _id: number;
  private _name: string;
  private _avatar: string | null;
  private _isLeft: boolean;
  private _keyUpPressed: boolean;
  private _keyDownPressed: boolean;
  private _score: number;
  private _backgroundColor: string;

  constructor(
    id: number,
    name: string,
    avatar: string | null,
    isLeft: boolean,
    backgroundColor: string,
  ) {
    this._id = id;
    this._name = name;
    this._avatar = avatar;
    this._isLeft = isLeft;
    this._keyUpPressed = false;
    this._keyDownPressed = false;
    this._score = 0;
    this._backgroundColor = backgroundColor;
  }

  public get id(): number { return this._id; }
  public get name(): string { return this._name; }
  public get avatar(): string | null { return this._avatar; }
  public get isLeft(): boolean { return this._isLeft; }
  public get keyUpPressed(): boolean { return this._keyUpPressed; }
  public get keyDownPressed(): boolean { return this._keyDownPressed; }
  public get score(): number { return this._score; }  
  public get backgroundColor(): string { return this._backgroundColor; }

  public set id(id: number) { this._id = id; }
  public set name(name: string) { this._name = name; }
  public set avatar(avatar: string | null) { this._avatar = avatar; }
  public set isLeft(isLeft: boolean) { this._isLeft = isLeft; }
  public set keyUpPressed(keyUpPressed: boolean) { this._keyUpPressed = keyUpPressed; }
  public set keyDownPressed(keyDownPressed: boolean) { this._keyDownPressed = keyDownPressed; }
  public set score(score: number) { this._score = score; }  
  public set backgroundColor(backgroundColor: string) { this._backgroundColor = backgroundColor; }

  public handleKeyUpPressed() { this.keyUpPressed = true; }
  public handleKeyUpUnpressed() { this.keyUpPressed = false; }
  public handleKeyDownPressed() { this.keyDownPressed = true; }
  public handleKeyDownUnpressed() { this.keyDownPressed = false; }

  public IPlayer(): IPlayer {
    return (
      {
        id: this._id,
        name: this._name,
        avatar: this._avatar,
        isLeft: this._isLeft,
        isCom: false,
        score: this._score,
        backgroundColor: this._backgroundColor,
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