import { IMessage } from "./IMessage";

export interface IChannel {
	id: number;
	name: string;
	messages: number[];
	password: string | null;
	isDm: boolean;
	users: number[];
	admins: number[];
	muted: number[];
	banned: number[];
	room: string;
}