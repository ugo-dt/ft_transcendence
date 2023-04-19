import { IUser } from "./IUser";
import { IGameState } from "./IGameState";

export interface IRoom {
  id: number,
  left: IUser,
  right: IUser,
  gameState: IGameState,
  gameOver: boolean,
}
