import { Dispatch, SetStateAction, useState } from "react";
import { IPlayer } from "../types";

function usePlayer(_player: IPlayer): [
  IPlayer,
  Dispatch<SetStateAction<number>>,
] {
  const [score, setScore] = useState(_player.score);

  return [
    {
      isLeft: _player.isLeft,
      isCom: _player.isCom,
      score: score,
    },
    setScore,
  ];
}

export default usePlayer;