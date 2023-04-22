import { IUser } from "./IUser";
import { IGameState } from "./IGameState";

export interface IGameRoom {
  id: number,
  left: IUser,
  right: IUser,
  gameState: IGameState,
}
