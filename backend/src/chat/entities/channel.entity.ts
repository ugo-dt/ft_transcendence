import { EntityMessage } from "./message.entity";
import { EntityUser } from "./user.entity";

export class EntityChannel {
	channelId: number;
	name: string;
	messageHistory: EntityMessage[];
	password: string | null;
	isDm: boolean;
	users: EntityUser[];
	admins: EntityUser[];
	banned: EntityUser[];
	muted: EntityUser[];
}
