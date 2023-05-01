export interface IChannel {
  id: number;
  name: string;
  messages: number[];
  password: string;
  isDm: boolean;
  users: number[];
  admins: number[];
  muted: number[];
  banned: number[];
  room: string;
  isPrivate: boolean;
}