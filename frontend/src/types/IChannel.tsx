import { IMessage } from "./IMessage";
import { IUser } from "./IUser";

export interface IChannel {
	channelId: number;
	name: string;
	messageHistory: IMessage[];
	password: string | null;
	isDm: boolean;
	users: IUser[];
	admins: IUser[];
	banned: IUser[];
	muted: IUser[];
}