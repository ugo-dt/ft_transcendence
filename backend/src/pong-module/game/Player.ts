import { KeyStateQuery, useKeyState } from "use-key-state";
import Paddle, { IPaddle } from "./Paddle";

export interface IPlayer {
  id: number,
  name: string,
  avatar: string | null,
  isLeft?: boolean,
  isCom?: boolean,
  paddle: IPaddle,
  score?: number,
  keyboardState?: KeyStateQuery | null,
  backgroundColor?: string,
}

export class Player {
  private _id: number;
  private _name: string;
  private _avatar: string | null;
  private _isLeft: boolean;
  private _paddle: Paddle;
  private _keyUpPressed: boolean;
  private _keyDownPressed: boolean;

  constructor(
    id: number,
    name: string,
    avatar: string | null,
    paddleX: number,
    isLeft: boolean,
  ) {
    this._id = id;
    this._name = name;
    this._avatar = avatar;
    this._isLeft = isLeft;
    this._paddle = new Paddle(paddleX);
    this._keyUpPressed = false;
    this._keyDownPressed = false;
  }

  public get id(): number { return this._id; }
  public get name(): string { return this._name; }
  public get avatar(): string | null { return this._avatar; }
  public get isLeft(): boolean { return this._isLeft; }
  public get paddle(): Paddle { return this._paddle; }
  public get keyUpPressed(): boolean { return this._keyUpPressed; }
  public get keyDownPressed(): boolean { return this._keyDownPressed; }

  public set id(id: number) { this._id = id; }
  public set name(name: string) { this._name = name; }
  public set avatar(avatar: string | null) { this._avatar = avatar; }
  public set isLeft(isLeft: boolean) { this._isLeft = isLeft; }
  public set paddle(paddle: Paddle) { this._paddle = paddle; }
  public set keyUpPressed(keyUpPressed: boolean) { this._keyUpPressed = keyUpPressed; }
  public set keyDownPressed(keyDownPressed: boolean) { this._keyDownPressed = keyDownPressed; }

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
        paddle: this._paddle.IPaddle(),
        backgroundColor: "white",
      }
    );
  }

  public movePaddle() {
    if (this._keyUpPressed) {
      if (this._keyDownPressed) {
        this._paddle.velocityY = 0;
      }
      else {
        this._paddle.velocityY = -10;
      }
    }
    else if (this._keyDownPressed) {
      this._paddle.velocityY = 10;
    }
    else {
      this._paddle.velocityY = 0;
    }
  }

  public update(canvasHeight: number) {
    this.movePaddle();
    this._paddle.update(canvasHeight);
  }
}