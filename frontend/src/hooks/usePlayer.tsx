import { useEffect, useState } from "react";
import { IPlayer } from "../types";
import usePaddle from "./usePaddle";
import { CANVAS_HEIGHT, PADDLE_LEFT_POS_X, PADDLE_RIGHT_POS_X, PADDLE_VELOCITY } from "../constants";
import { useKeyState } from "use-key-state";

const usePlayer = (_player: IPlayer): [IPlayer, any, any, any, any] => {
  const [isCom, setIsCom] = useState(_player.isCom);
  const [score, setScore] = useState(_player.score);
  const [Paddle, movePaddle, drawPaddle, setPaddlePosition, setPaddleVelocityY] = usePaddle(_player.isLeft ? PADDLE_LEFT_POS_X : PADDLE_RIGHT_POS_X);
  const keyboardState = useKeyState().keyStateQuery;

  function computerMovePaddle(velocity_x: number, ball_y: number) {
    let c = Paddle.pos.y + (ball_y - (Paddle.pos.y + Paddle.height / 2)) * 0.16;
    if (c >= 0 && c <= CANVAS_HEIGHT - Paddle.height) {
      setPaddlePosition(c);
    }
  }

  function humanMovePaddle() {    
    if (_player.isLeft) {
      if (keyboardState.pressed('w')) {
        if (keyboardState.pressed('s')) {
          setPaddleVelocityY(0);
        }
        else {
          setPaddleVelocityY(-PADDLE_VELOCITY);
        }
      }
      else if (keyboardState.pressed('s')) {
        setPaddleVelocityY(PADDLE_VELOCITY);
      }
      else {
        setPaddleVelocityY(0);
      }
    }
    else {
      
      if (keyboardState.pressed('up')) {
        if (keyboardState.pressed('down')) {
          setPaddleVelocityY(0);
        }
        else {
          setPaddleVelocityY(-PADDLE_VELOCITY);
        }
      }
      else if (keyboardState.pressed('down')) {
        setPaddleVelocityY(PADDLE_VELOCITY);
      }
      else {
        setPaddleVelocityY(0);
      }
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