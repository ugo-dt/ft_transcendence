import { EntityChannel } from "./channel.entity";

export class EntityUser {
	id: number;
	name: string;
	avatar: string | null;
	userChannels: EntityChannel[];
}
