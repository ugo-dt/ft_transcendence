export interface IPlayer {
  id: number,
  name: string,
  avatar: string | null,
  isLeft: boolean,
  isCom: boolean,
  score: number,
  backgroundColor: string,
}
