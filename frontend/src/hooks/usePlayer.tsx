import { useEffect, useState } from "react";
import { IPlayer } from "../types";
import usePaddle from "./usePaddle";
import { CANVAS_HEIGHT, PADDLE_HEIGHT, PADDLE_LEFT_POS_X, PADDLE_RIGHT_POS_X } from "../constants";
import { useKeyState } from "use-key-state";

const usePlayer = (_player: IPlayer): [IPlayer, any, any, any, any] => {
  const [isCom, setIsCom] = useState(_player.isCom);
  const [score, setScore] = useState(_player.score);
  const [Paddle, movePaddle, drawPaddle, setPaddleMovingDown, setPaddleMovingUp, setPaddlePosition] = usePaddle(_player.isLeft ? PADDLE_LEFT_POS_X : PADDLE_RIGHT_POS_X);
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

  function humanMovePaddle() {
    if (_player.isLeft) {
      if (keyboardState.pressed('w')) { setPaddleMovingUp(true); } else { setPaddleMovingUp(false); }
      if (keyboardState.pressed('s')) { setPaddleMovingDown(true); } else { setPaddleMovingDown(false); }
    }
    else {
      if (keyboardState.pressed('up')) { setPaddleMovingUp(true); } else { setPaddleMovingUp(false); }
      if (keyboardState.pressed('down')) { setPaddleMovingDown(true); } else { setPaddleMovingDown(false); }
    }
    movePaddle();
  }

  useEffect(() => {
  }, [keyboardState]);

  return [
    {
      id: _player.id,
      name: _player.name,
      avatar: _player.avatar,
      isLeft: _player.isLeft,
      isCom: isCom,
      paddle: Paddle,
      score: score,
      keyboardState: keyboardState,
      backgroundColor: _player.backgroundColor,
    },
    isCom ? computerMovePaddle : humanMovePaddle,
    drawPaddle,
    setScore,
    setIsCom,
  ];
}

export default usePlayer;