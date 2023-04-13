import { Dispatch, SetStateAction, useState } from "react";
import { useKeyState } from "use-key-state";
import { IPaddle } from "../types";
import { CANVAS_DEFAULT_HEIGHT, CANVAS_DEFAULT_WIDTH, PADDLE_DEFAULT_COLOR, PADDLE_DEFAULT_HEIGHT, PADDLE_DEFAULT_VELOCITY, PADDLE_DEFAULT_WIDTH, PADDLE_DEFAULT_X_LEFT, PADDLE_DEFAULT_X_RIGHT } from "../constants";
import Canvas from "../components/Canvas";

function usePaddle(
  canvas: Canvas,
  _isLeft: boolean,
  _isCom: boolean,
): [
  IPaddle,
  (ballVelocityX: number, ballPosX: number, ballPosY: number, demo: boolean) => void,
  Dispatch<SetStateAction<boolean>>,
  () => void,
] {
  const [x, setX] = useState(_isLeft ? canvas.width / (CANVAS_DEFAULT_WIDTH / PADDLE_DEFAULT_X_LEFT) : canvas.width / (CANVAS_DEFAULT_WIDTH / PADDLE_DEFAULT_X_RIGHT));
  const [y, setY] = useState(canvas.height / 2 - (canvas.height / (CANVAS_DEFAULT_HEIGHT / (PADDLE_DEFAULT_HEIGHT / 2))));
  const [width, setWidth] = useState(canvas.width / (CANVAS_DEFAULT_WIDTH / PADDLE_DEFAULT_WIDTH));
  const [height, setHeight] = useState(canvas.height / (CANVAS_DEFAULT_HEIGHT / PADDLE_DEFAULT_HEIGHT));
  const [color] = useState(PADDLE_DEFAULT_COLOR);
  const [velocityY, setVelocityY] = useState(0);
  const [isCom, setIsCom] = useState(_isCom);
  const paddleVelocity = canvas.height / (CANVAS_DEFAULT_HEIGHT / PADDLE_DEFAULT_VELOCITY);
  const keyboardState = useKeyState().keyStateQuery;

  function _movePaddle() {
    if (!velocityY) { return ;}
    if (y + velocityY >= 0 && y + velocityY <= canvas.height - height) {
      setY(y + velocityY);
    }
  }

  function _demoMove(ballVelocityX: number, ballPosX: number, ballPosY: number) {
    let posTo, factor;

    posTo = y + (ballPosY - (y + height / 2)) * 0.16;
    if (_isLeft) {
      if (ballVelocityX > 0) {
        posTo = y + ((canvas.height / 2) - (y + height / 2)) * 0.03;
      }
      else {
        if (ballPosX < canvas.width / 6) { factor = 0.14; }
        else if (ballPosX < canvas.width / 4) { factor = 0.12; }
        else if (ballPosX < canvas.width / 3) { factor = 0.10; }
        else if (ballPosX < canvas.width / 2) { factor = 0.08; }
        else { factor = 0.05; }
        posTo = y + (ballPosY - (y + height / 2)) * factor;
      }
    }

    if (!_isLeft) {
      if (ballVelocityX < 0) {
        posTo = y + ((canvas.height / 2) - (y + height / 2)) * 0.03;
      }
      else {
        if (ballPosX > canvas.width - canvas.width / 6) { factor = 0.14; }
        else if (ballPosX > canvas.width - canvas.width / 4) { factor = 0.12; }
        else if (ballPosX > canvas.width - canvas.width / 3) { factor = 0.10; }
        else if (ballPosX > canvas.width / 2) { factor = 0.08; }
        else { factor = 0.05; }
        posTo = y + (ballPosY - (y + height / 2)) * factor;
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
      posTo = y + (ballPosY - (y + height / 2)) * 0.16;
    }

    if (posTo >= 0 && posTo <= canvas.height - height) {
      setY(posTo);
    }
  }

  function humanMovePaddle() {
    if (_isLeft) {
      if (keyboardState.pressed('w')) {
        if (keyboardState.pressed('s')) {
          setVelocityY(0);
        }
        else {
          setVelocityY(-paddleVelocity);
        }
      }
      else if (keyboardState.pressed('s')) {
        setVelocityY(paddleVelocity);
      }
      else {
        setVelocityY(0);
      }
    }
    else {
      if (keyboardState.pressed('up')) {
        if (keyboardState.pressed('down')) {
          setVelocityY(0);
        }
        else {
          setVelocityY(-paddleVelocity);
        }
      }
      else if (keyboardState.pressed('down')) {
        setVelocityY(paddleVelocity);
      }
      else {
        setVelocityY(0);
      }
    }
    _movePaddle();
  }

  function drawPaddle() {
    canvas.drawRect(x, y, width, height, color);
  }

  return [
    {
      x: x,
      y: y,
      width: width,
      height: height,
      color: color,
      velocityY: velocityY,
      keyboardState: keyboardState,
      isCom: isCom,
    },
    isCom ? computerMovePaddle : humanMovePaddle,
    setIsCom,
    drawPaddle,
  ];
}

export default usePaddle;