import { Vec2 } from "./Vec2";

export interface IBall {
  radius: number;
	pos: Vec2;
  velocity: Vec2;
  color: string;
}
