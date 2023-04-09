import { IClientData } from "./IClientData";
import { IGameState } from "./IGameState";

export interface IRoomData {
  id: number,
  left: IClientData,
  right: IClientData,
  gameState: IGameState,
}
