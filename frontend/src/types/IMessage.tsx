export interface IMessage {
  id: number,
  content: string;
  timestamp: string;
  senderId: number;
  destination: number;
}