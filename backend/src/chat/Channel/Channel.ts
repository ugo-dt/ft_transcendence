import { Socket } from "socket.io";
import User from "../User/User";
import Message, { IMessage } from "../Message/Message";

export interface IChannel {
	id: number;
	name: string;
	history: IMessage[];
	isDm: boolean;
	password: string | null;
	users: Set<User>;
	admins: Set<User>;
	muted: Set<User>;
	banned: Set<User>;
}

class Channel {
	private static __channels_ = new Set<Channel>;

	private _id: number;
	private _name: string;
	private _history: Set<Message>;
	private _isDm: boolean;
	private _password: string | null;
	private _users: Set<User>;
	private _admins: Set<User>;
	private _muted: Set<User>;
	private _banned: Set<User>;

	private __newId(): number {
		let _new_id = 0;
		while (Channel.at(_new_id)) {
			_new_id++;
		}
		return _new_id;
	}

	private constructor(data: any) {
		this._id = this.__newId();
		this._name = data.name || 'Default channel name';
		this._history = new Set();
		this._isDm = data.isDm;
		this._password = data.password;
		this._users = new Set();
		this._admins = new Set();
		this._muted = new Set();
		this._banned = new Set();
	}

	public get id(): number { return this._id; }
	public get name(): string { return this._name; }
	public get history(): Set<Message> { return this._history; }
	public get isDm(): boolean { return this._isDm; }
	public get password(): string | null { return this._password; }
	public get users(): Set<User> { return this._users; }
	public get admins(): Set<User> { return this._admins; }
	public get muted(): Set<User> { return this._muted; }
	public get banned(): Set<User> { return this._banned; }

	public set id(id: number) { this._id = id; }
	public set name(name: string) { this._name = name; }
	public set history(history: Set<Message>) { this._history = history; }
	public set isDm(isDm: boolean) { this._isDm = isDm; }
	public set password(password: string | null) { this._password = password; }
	public set users(users: Set<User>) { this._users = users; }
	public set admins(admins: Set<User>) { this._admins = admins; }
	public set muted(muted: Set<User>) { this._muted = muted; }
	public set banned(banned: Set<User>) { this._banned = banned; }

	public IChannel(): IChannel {
		let messageHistory: IMessage[] = [];
		Array.from(this._history).map((message, index) => {
			messageHistory.push(message.IMessage());
		});
		const iChannel: IChannel = {
			id: this._id,
			name: this._name,
			history: messageHistory,
			isDm: this._isDm,
			password: this._password,
			users: this._users,
			admins: this._admins,
			muted: this._muted,
			banned: this._banned
		}
		return iChannel;
	}

	public static new(data: any): Channel {
		const channel: Channel = new Channel(data);
		Channel.__channels_.add(channel);
		return channel;
	}

	public static at(id: number): Channel | null {
		if (typeof id === 'number') {
			for (const channel of Channel.__channels_.values()) {
				if (channel._id === id) {
					return channel;
				}
			}
		}
		return null;
	}

	public addUser(user: User) {
		this._users.add(user);
		User.at(user.id)?.userChannels.add(this);
	}

	public removeUser(user: User) {
		this._users.delete(user);
	}

	public addAdmin(user: User) {
		this._admins.add(user);
	}

	public removeAdmin(user: User) {
		this._admins.delete(user);
	}

	public pushMessageToChannel(message: Message) {
		this._history.add(message);
	}

	public static delete(channel: number): void;
	public static delete(channel: Channel): void
	public static delete(x: Channel | number): void {
		let _delete_id: number;

		if (typeof x === 'number') {
			_delete_id = x;
		}
		else {
			_delete_id = x.id;
		}
		for (const channel of Channel.__channels_.values()) {
			if (channel.id === _delete_id) {
				channel._users.forEach((usr) => {
					channel.removeUser(usr);
					channel.removeAdmin(usr);
				});
				Channel.__channels_.delete(channel);
				return;
			}
		}
	}

	public static list() {
		const channelList: IChannel[] = [];

		Channel.__channels_.forEach((channel: Channel) => {
			channelList.push(channel.IChannel());
		});
		return channelList;
	}
}

export default Channel;