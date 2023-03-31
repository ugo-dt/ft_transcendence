import { KeyStateQuery } from "use-key-state";
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
  private _paddle: Paddle;

  constructor(
    id: number,
    name: string,
    avatar: string | null,
    paddleX: number,
  ) {
    this._id = id;
    this._name = name;
    this._avatar = avatar;
    this._paddle = new Paddle(paddleX);
  }

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
}