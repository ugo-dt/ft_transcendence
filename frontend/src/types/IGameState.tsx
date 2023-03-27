import { IBall, IPaddle, IPlayer } from "../types";

export interface IGameState {
  ball: IBall,
  leftPlayer: IPlayer,
  rightPlayer: IPlayer,
  pause: boolean,
}
