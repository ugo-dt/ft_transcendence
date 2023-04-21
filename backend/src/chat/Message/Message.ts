import { Socket } from "socket.io";
import User from "../User/User";
import Channel from "../Channel/Channel";

export interface IMessage {
	content: string,
	timestamp: string,
	sender: string,
	destination: number,
}

class Message {
	private static __messages_ = new Set<Message>;

	private _content: string;
	private _timestamp: string;
	private _sender: User;
	private _destination: number;

	private _timestamp_mmddyy() {
		const currentDate = new Date();
		const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
		const day = currentDate.getDate().toString().padStart(2, '0');
		const year = currentDate.getFullYear().toString().substr(-2);
		const hours = currentDate.getHours().toString().padStart(2, '0');
		const minutes = currentDate.getMinutes().toString().padStart(2, '0');
		const seconds = currentDate.getSeconds().toString().padStart(2, '0');
		const time = `${hours}:${minutes}:${seconds}`;
		return `${month}/${day}/${year} ${time}`;
	}

	private constructor(userSocket: Socket, data: any) {
		this._content = data.content;
		this._timestamp = this._timestamp_mmddyy();
		this._sender = User.at(userSocket) as User;
		this._destination = data.toChannel;
	}

	public get content(): string { return this._content; }
	public get timestamp(): string { return this._timestamp; }
	public get sender(): User { return this._sender; }
	public get destination(): number { return this._destination; }

	public set content(content: string) { this._content = content; }
	public set timestamp(timestamp: string) { this._timestamp = timestamp; }
	public set sender(sender: User) { this._sender = sender; }
	public set destination(destination: number) { this._destination = destination; }

	public IMessage(): IMessage {
		const iMessage: IMessage = {
			content: this._content,
			timestamp: this._timestamp,
			sender: this._sender.name,
			destination: this._destination,
		}
		return iMessage;
	}

	public static new(userSocket: Socket, data: any): Message {
		const message = new Message(userSocket, data);
		Message.__messages_.add(message);
		return message;
	}

	public static list() {
		const messageList: IMessage[] = [];

		Message.__messages_.forEach((message: Message) => {
			messageList.push(message.IMessage());
		});
		return messageList;
	}
}

export default Message;