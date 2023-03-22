import { IPaddle } from "./IPaddle";

export interface IPlayer {
	id: number,
	name: string,
	avatar: string | null,
	isLeft: boolean,
	isCom: boolean,
	paddle?: IPaddle,
	score: number;
}
