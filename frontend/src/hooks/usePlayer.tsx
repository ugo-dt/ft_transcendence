import { Dispatch, SetStateAction, useState } from "react";
import { IPlayer } from "../types";

function usePlayer(_player: IPlayer): [
  IPlayer,
  Dispatch<SetStateAction<number>>,
] {
  const [score, setScore] = useState(_player.score);

  return [
    {
      id: _player.id,
      name: _player.name,
      avatar: _player.avatar,
      isLeft: _player.isLeft,
      isCom: _player.isCom,
      score: score,
      backgroundColor: _player.backgroundColor,
    },
    setScore,
  ];
}

export default usePlayer;