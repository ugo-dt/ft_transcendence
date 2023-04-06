import { IBall } from "./IBall";
import { IPaddle } from "./IPaddle";
import { IPlayer } from "./IPlayer";

export interface IGameState {
  ball: IBall,
  leftPlayer: IPlayer,
  rightPlayer: IPlayer,
  leftPaddle: IPaddle
  rightPaddle: IPaddle,
  gameOver: boolean,
}
