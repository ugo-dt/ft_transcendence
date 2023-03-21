import { useEffect, useState } from "react";
import { IPlayer } from "../types";
import usePaddle from "./usePaddle";
import { PADDLE_LEFT_POS_X, PADDLE_RIGHT_POS_X } from "../constants";

const usePlayer = (_player: IPlayer): [IPlayer, any, any, any, any] => {
	const [id, setId]: [number, any] = useState(_player.id);
	const [name, setName] = useState(_player.name)
	const [avatar, setAvatar] = useState(_player.avatar);
	const [isLeft, setIsLeft] = useState(_player.isLeft);
	const [isCpu, setIsCpu] = useState(_player.isCpu);
  const [Paddle, movePaddle, drawPaddle, setPaddleMovingDown, setPaddleMovingUp] = usePaddle(_player.isLeft ? PADDLE_LEFT_POS_X : PADDLE_RIGHT_POS_X);

  return [
    {
      id: id,
      name: name,
      avatar: avatar,
      paddle: Paddle,
      isLeft: isLeft,
      isCpu: isCpu,
    },
    setPaddleMovingDown,
    setPaddleMovingUp,
    movePaddle,
    drawPaddle,
  ];
}

export default usePlayer;