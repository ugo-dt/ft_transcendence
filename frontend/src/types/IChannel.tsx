import { IMessage } from "./IMessage";
import { IUser } from "./IUser";

export interface IChannel {
	id: number;
	name: string;
	history: any[];
	password: string | null;
	isDm: boolean;
	users: any[];
	admins: any[];
	banned: any[];
	muted: any[];
}