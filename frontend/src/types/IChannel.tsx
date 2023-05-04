export interface IChannel {
  id: number;
  name: string;
  messages: number[];
  password: string;
  users: number[];
  admins: number[];
  muted: number[];
  banned: number[];
  room: string;
  isPrivate: boolean;
}