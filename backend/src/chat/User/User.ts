import { Socket } from "socket.io";
import Channel, { IChannel } from "../Channel/Channel";

export interface IUser {
	id: number;
	name: string;
	avatar: string | null;
	userChannels: Set<Channel>;
	blockedUsers: Set<User>;
}

class User {
	private static __users_ = new Set<User>;

	private __socket_: Socket;
	private _id: number;
	private _name: string;
	private _avatar: string | null;
	private _userChannels: Set<Channel>
	private _blockedUsers: Set<User>

	private __newId(): number {
		let _new_id = 0;
		while (User.at(_new_id)) {
			_new_id++;
		}
		return _new_id;
	}

	private constructor(socket: Socket, name: string) {
		this.__socket_ = socket;
		this._id = this.__newId();
		this._avatar = socket.data.avatar;
		this._name = name || 'Guest_' + this._id;
		this._userChannels = new Set();
		this._blockedUsers = new Set();
	}

	public get __socket(): Socket { return this.__socket_; }
	public get id(): number { return this._id; }
	public get name(): string { return this._name; }
	public get avatar(): string | null { return this._avatar; }
	public get userChannels(): Set<Channel> { return this._userChannels; }
	public get blockedUsers(): Set<User> { return this._blockedUsers; }

	public set __socket(__socket_: Socket) { this.__socket_ = __socket_; }
	public set id(id: number) { this._id = id; }
	public set name(name: string) { this._name = name; }
	public set avatar(avatar: string | null) { this._avatar = avatar; }
	public set userChannels(userChannels: Set<Channel>) { this._userChannels = userChannels; }
	public set blockedUsers(blockedUsers: Set<User>) { this._blockedUsers = blockedUsers; }

	public IUser(): IUser {
		//let __usrChannels: IChannel[] = [];
		//Array.from(this._userChannels).map((channel, index) => {
		//	__usrChannels.push(channel.IChannel());
		//});

		//let __blockedUsrs: IUser[] = [];
		//Array.from(this._blockedUsers).map((user, index) => {
		//	__blockedUsrs.push(user.IUser());
		//});

		const iUser: IUser = {
			id: this._id,
			name: this._name,
			avatar: this._avatar,
			userChannels: this._userChannels,
			blockedUsers: this._blockedUsers,
		}
		return iUser;
	}

	public nullIUser(): IUser {
		const iUser: IUser = {
			id: -1,
			name: '',
			avatar: null,
			userChannels: new Set(),
			blockedUsers: new Set(),
		}
		return iUser;
	}

	public static new(userSocket: Socket, name: string): User {
		const user = new User(userSocket, name);
		User.__users_.add(user);
		return user;
	}

	public static at(userId: number): User | null;
	public static at(userSocket: Socket): User | null;
	public static at(userName: string): User | null;
	public static at(user: number | Socket | string): User | null {
		if (typeof user === 'number') {
			for (const usr of User.__users_.values()) {
				if (usr._id === user) {
					return usr;
				}
			}
		} else if (typeof user === 'string') {
			for (const usr of User.__users_.values()) {
				if (usr._name === user) {
					return usr;
				}
			}
		} else {
			for (const usr of User.__users_.values()) {
				if (usr.__socket_.id === user.id) {
					return usr;
				}
			}
		}
		return null;
	}

	public static delete(socket: Socket) {
		for (const user of User.__users_.values()) {
			if (user.__socket_.id === socket.id) {
				User.__users_.delete(user);
				return;
			}
		}
	}

	public static list() {
		const userList: IUser[] = [];

		User.__users_.forEach((user: User) => {
			userList.push(user.IUser());
		});
		return userList;
	}
}

export default User;