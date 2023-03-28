import { useEffect, useState } from "react";
import { IPlayer, Vec2 } from "../types";
import usePaddle from "./usePaddle";
import { CANVAS_DEFAULT_HEIGHT, PADDLE_DEFAULT_VELOCITY } from "../constants";
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
  const paddleVelocity = canvas.height / (CANVAS_DEFAULT_HEIGHT / PADDLE_DEFAULT_VELOCITY);

  function _demoMove(ballVelocityX: number, ballPos: Vec2) {
    let posTo, factor;

    posTo = Paddle.pos.y + (ballPos.y - (Paddle.pos.y + Paddle.height / 2)) * 0.16;
    if (_player.isLeft) {
      if (ballVelocityX > 0) {
        posTo = Paddle.pos.y + ((canvas.height / 2) - (Paddle.pos.y + Paddle.height / 2)) * 0.03;
      }
      else {
        if (ballPos.x < canvas.width / 6) { factor = 0.14; }
        else if (ballPos.x < canvas.width / 4) { factor = 0.12; }
        else if (ballPos.x < canvas.width / 3) { factor = 0.10; }
        else if (ballPos.x < canvas.width / 2) { factor = 0.08; }
        else { factor = 0.05; }
        posTo = Paddle.pos.y + (ballPos.y - (Paddle.pos.y + Paddle.height / 2)) * factor;
      }
    }

    if (!_player.isLeft) {
      if (ballVelocityX < 0) {
        posTo = Paddle.pos.y + ((canvas.height / 2) - (Paddle.pos.y + Paddle.height / 2)) * 0.03;
      }
      else {
        if (ballPos.x > canvas.width - canvas.width / 6) { factor = 0.14; }
        else if (ballPos.x > canvas.width - canvas.width / 4) { factor = 0.12; }
        else if (ballPos.x > canvas.width - canvas.width / 3) { factor = 0.10; }
        else if (ballPos.x > canvas.width / 2) { factor = 0.08; }
        else { factor = 0.05; }
        posTo = Paddle.pos.y + (ballPos.y - (Paddle.pos.y + Paddle.height / 2)) * factor;
      }
    }
    return posTo;
  }

  function computerMovePaddle(ballVelocityX: number, ballPos: Vec2, demo: boolean) {
    let posTo;

    if (demo) {
      posTo = _demoMove(ballVelocityX, ballPos);
    }
    else {
      posTo = Paddle.pos.y + (ballPos.y - (Paddle.pos.y + Paddle.height / 2)) * 0.16;
    }

    if (posTo >= 0 && posTo <= canvas.height - Paddle.height) {
      setPaddlePosition(posTo);
    }
  }

  function humanMovePaddle() {
    if (_player.isLeft) {
      if (keyboardState.pressed('w')) {
        if (keyboardState.pressed('s')) {
          setPaddleVelocityY(0);
        }
        else {
          setPaddleVelocityY(-paddleVelocity);
        }
      }
      else if (keyboardState.pressed('s')) {
        setPaddleVelocityY(paddleVelocity);
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
          setPaddleVelocityY(-paddleVelocity);
        }
      }
      else if (keyboardState.pressed('down')) {
        setPaddleVelocityY(paddleVelocity);
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