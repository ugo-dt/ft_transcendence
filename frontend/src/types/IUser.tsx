import { IChannel } from "./IChannel";

export interface IUser {
	id: number;
	name: string;
	avatar: string | null;
	userChannels: IChannel[];
}
