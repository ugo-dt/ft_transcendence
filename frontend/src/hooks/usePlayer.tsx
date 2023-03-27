import { useEffect, useState } from "react";
import { IPlayer } from "../types";
import usePaddle from "./usePaddle";
import { CANVAS_DEFAULT_HEIGHT } from "../constants";
import { useKeyState } from "use-key-state";
import Canvas from "../components/Canvas";

const usePlayer = (
  canvas: Canvas,
  _player: IPlayer,
): [IPlayer, any, any, any, any] => {
  const [isCom, setIsCom] = useState(_player.isCom);
  const [score, setScore] = useState(_player.score);
  const [Paddle, movePaddle, drawPaddle, setPaddlePosition, setPaddleVelocityY] = usePaddle(canvas, _player.isLeft);
  const keyboardState = useKeyState().keyStateQuery;

  function computerMovePaddle(ball_velocity_x: number, ball_y: number, isDemo: boolean) {
    let f = 0.16;

    if (isDemo) {
      if (_player.isLeft && ball_velocity_x > 0) {
        return ;
      }
      else if (!_player.isLeft && ball_velocity_x < 0) {
        return ;
      }
      f = 0.10;
    }
    let c = Paddle.pos.y + (ball_y - (Paddle.pos.y + Paddle.height / 2)) * f;
    if (c >= 0 && c <= canvas.height - Paddle.height) {
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
          setPaddleVelocityY(-Paddle.velocityY);
        }
      }
      else if (keyboardState.pressed('s')) {
        setPaddleVelocityY(Paddle.velocityY);
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
          setPaddleVelocityY(-Paddle.velocityY);
        }
      }
      else if (keyboardState.pressed('down')) {
        setPaddleVelocityY(Paddle.velocityY);
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