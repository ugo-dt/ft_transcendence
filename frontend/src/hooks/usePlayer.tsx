import { useState } from "react";
import { IPlayer } from "../types";
import usePaddle from "./usePaddle";
import { CANVAS_DEFAULT_HEIGHT, PADDLE_DEFAULT_VELOCITY } from "../constants";
import { useKeyState } from "use-key-state";
import Canvas from "../components/Canvas";

function usePlayer(canvas: Canvas, _player: IPlayer): [IPlayer, any, any, any, any, any] {
  const [isCom, setIsCom] = useState(_player.isCom);
  const [score, setScore] = useState(_player.score);
  const [Paddle, movePaddle, drawPaddle, setPaddlePosition, setPaddleVelocityY, updatePaddleSize] = usePaddle(canvas, _player.isLeft);
  const keyboardState = useKeyState().keyStateQuery;
  const paddleVelocity = canvas.height / (CANVAS_DEFAULT_HEIGHT / PADDLE_DEFAULT_VELOCITY);

  function _demoMove(ballVelocityX: number, ballPosX: number, ballPosY: number) {
    let posTo, factor;

    posTo = Paddle.y + (ballPosY - (Paddle.y + Paddle.height / 2)) * 0.16;
    if (_player.isLeft) {
      if (ballVelocityX > 0) {
        posTo = Paddle.y + ((canvas.height / 2) - (Paddle.y + Paddle.height / 2)) * 0.03;
      }
      else {
        if (ballPosX < canvas.width / 6) { factor = 0.14; }
        else if (ballPosX < canvas.width / 4) { factor = 0.12; }
        else if (ballPosX < canvas.width / 3) { factor = 0.10; }
        else if (ballPosX < canvas.width / 2) { factor = 0.08; }
        else { factor = 0.05; }
        posTo = Paddle.y + (ballPosY - (Paddle.y + Paddle.height / 2)) * factor;
      }
    }

    if (!_player.isLeft) {
      if (ballVelocityX < 0) {
        posTo = Paddle.y + ((canvas.height / 2) - (Paddle.y + Paddle.height / 2)) * 0.03;
      }
      else {
        if (ballPosX > canvas.width - canvas.width / 6) { factor = 0.14; }
        else if (ballPosX > canvas.width - canvas.width / 4) { factor = 0.12; }
        else if (ballPosX > canvas.width - canvas.width / 3) { factor = 0.10; }
        else if (ballPosX > canvas.width / 2) { factor = 0.08; }
        else { factor = 0.05; }
        posTo = Paddle.y + (ballPosY - (Paddle.y + Paddle.height / 2)) * factor;
      }
    }
    return posTo;
  }

  function computerMovePaddle(ballVelocityX: number, ballPosX: number, ballPosY: number, demo: boolean) {
    let posTo;

    if (demo) {
      posTo = _demoMove(ballVelocityX, ballPosX, ballPosY);
    }
    else {
      posTo = Paddle.y + (ballPosY - (Paddle.y + Paddle.height / 2)) * 0.16;
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
    updatePaddleSize,
  ];
}

export default usePlayer;