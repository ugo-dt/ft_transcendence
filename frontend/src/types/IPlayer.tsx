import { IPaddle } from "./IPaddle";

export interface IPlayer {
	id: number,
	name: string,
	avatar: string | null,
	isLeft: boolean,
	isCpu: boolean,
	paddle?: IPaddle | null,
}
