export interface IUser {
  id: number,
  id42: number,
  username: string,
  has2fa: boolean,
  phoneNumber: string;
  avatar: string,
  status: string,
  rating: number,
  paddleColor: string,
  friends: string[],
}
