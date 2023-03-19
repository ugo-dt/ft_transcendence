import { Vec2 } from "./Vec2";

export interface IPaddle {
	pos: Vec2;
	width: number;
	height: number;
	color: string;
	movingUp: boolean;
	movingDown: boolean;
}
