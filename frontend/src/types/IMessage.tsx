export interface IMessage {
	senderId: number;
	senderName: string;
	content: string;
	timestamp: string;
	toChannel: number;
}