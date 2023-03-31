import { IBall } from "./IBall";
import { IPlayer } from "./IPlayer";

export interface IGameState {
  ball: IBall,
  leftPlayer: IPlayer,
  rightPlayer: IPlayer,
  pause: boolean,
}
