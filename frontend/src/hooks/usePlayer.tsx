import { useEffect, useState } from "react";
import { IPlayer } from "../types";
import usePaddle from "./usePaddle";
import { CANVAS_HEIGHT, PADDLE_DEFAULT_POS_Y, PADDLE_HEIGHT, PADDLE_LEFT_POS_X, PADDLE_RIGHT_POS_X } from "../constants";
import { useKeyState } from "use-key-state";

const usePlayer = (_player: IPlayer): [IPlayer, any, any, any] => {
  const [id, setId]: [number, any] = useState(_player.id);
  const [name, setName] = useState(_player.name)
  const [avatar, setAvatar] = useState(_player.avatar);
  const [isLeft, setIsLeft] = useState(_player.isLeft);
  const [isCom, setIsCom] = useState(_player.isCom);
  const [Paddle, movePaddle, drawPaddle, setPaddleMovingDown, setPaddleMovingUp, setPaddlePosition] = usePaddle(_player.isLeft ? PADDLE_LEFT_POS_X : PADDLE_RIGHT_POS_X);
  const [score, setScore] = useState(_player.score);
  const keyboardState = useKeyState().keyStateQuery;

  function computerMovePaddle(velocity_x: number, ball_y: number) {
    setTimeout(() => {
      // if ((isLeft && velocity_x < 0) || (!isLeft && velocity_x > 0)) {
        if (ball_y - PADDLE_HEIGHT / 2 < 0 || ball_y + PADDLE_HEIGHT / 2 > CANVAS_HEIGHT) {
          return;
        }
          setPaddlePosition(ball_y - PADDLE_HEIGHT / 2);
      // }
    }, 100);
  }

  useEffect(() => {
    if (isLeft) {
      if (keyboardState.pressed('w')) { setPaddleMovingUp(true); } else { setPaddleMovingUp(false); }
      if (keyboardState.pressed('s')) { setPaddleMovingDown(true); } else { setPaddleMovingDown(false); }
    }
    else {
      if (keyboardState.pressed('up')) { setPaddleMovingUp(true); } else { setPaddleMovingUp(false); }
      if (keyboardState.pressed('down')) { setPaddleMovingDown(true); } else { setPaddleMovingDown(false); }
    }
  }, [keyboardState]);

  return [
    {
      id: id,
      name: name,
      avatar: avatar,
      isLeft: isLeft,
      isCom: isCom,
      paddle: Paddle,
      score: score,
    },
    isCom ? computerMovePaddle : movePaddle,
    drawPaddle,
    setScore,
  ];
}

export default usePlayer;