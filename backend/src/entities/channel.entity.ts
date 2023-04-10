import { EntityMessage } from "./message.entity";

export class EntityChannel {
	channelId: number;
	name: string;
	messageHistory: EntityMessage[];
	isPrivate: boolean;
	admins: string[]; // should prolly be user.userId at some point
	isDm: boolean;
}
