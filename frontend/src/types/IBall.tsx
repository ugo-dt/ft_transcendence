import { Vec2 } from "./Vec2";

export interface IBall {
  radius: number,
	pos: Vec2,
  speed: number,
  velocity: Vec2,
  color: string,
  active: boolean,
  pause: boolean,
}
