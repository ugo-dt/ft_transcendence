import { IMessage } from "./IMessage";

export interface IChannel {
	id: number;
	name: string;
	messages: IMessage[];
	password: string | null;
	isDm: boolean;
	users: number[];
	admins: number[];
	banned: number[];
	muted: number[];
}