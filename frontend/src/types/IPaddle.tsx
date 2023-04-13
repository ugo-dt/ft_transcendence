import { KeyStateQuery } from "use-key-state";

export interface IPaddle {
  x: number,
  y: number,
  width: number;
  height: number;
  color: string;
  velocityY: number,
  keyboardState: KeyStateQuery | null,
  isCom: boolean,
}
