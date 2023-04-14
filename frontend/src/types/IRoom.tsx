import { IClient } from "./IClient";
import { IGameState } from "./IGameState";

export interface IRoom {
  id: number,
  left: IClient,
  right: IClient,
  gameState: IGameState,
  gameOver: boolean,
}
