export interface IChannel {
  id: number;
  name: string;
  password: string;
  messages: number[];
  users: number[];
  admins: number[];
  muted: number[];
  banned: number[];
  room: string;
  isPrivate: boolean;
}