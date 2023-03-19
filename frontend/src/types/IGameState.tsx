import { IBall, IPaddle } from "../types";

export interface IGameState {
  ball: IBall;
  paddles: {
    left: IPaddle;
    right: IPaddle;
  };
}
