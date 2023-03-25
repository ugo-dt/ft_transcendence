import { useState } from "react";
import { IPaddle, Vec2 } from "../types";
import { CANVAS_FOREGROUND_COLOR, CANVAS_HEIGHT, PADDLE_DEFAULT_POS_Y, PADDLE_HEIGHT, PADDLE_SPEED, PADDLE_WIDTH } from "../constants";
import Canvas from "../components/Canvas";

const usePaddle = (
  _x: number,
  _y: number = PADDLE_DEFAULT_POS_Y,
  _width: number = PADDLE_WIDTH,
  _height: number = PADDLE_HEIGHT,
  _color: string = CANVAS_FOREGROUND_COLOR,
): [IPaddle, any, any, any, any, any] => {
  const [y, setY]: [number, any] = useState(_y);
  const [movingUp, setMovingUp]: [boolean, any] = useState(false);
  const [movingDown, setMovingDown]: [boolean, any] = useState(false);

  function movePaddle() {
    if (movingDown) {
      if (movingUp) { return ; }
      if (y + PADDLE_HEIGHT < CANVAS_HEIGHT) {
        setY(y + PADDLE_SPEED);
      }
    }
    if (movingUp && y > 0) {
      setY(y - PADDLE_SPEED);
    }
  }

  function drawPaddle(canvas: Canvas) {
    canvas.drawRect(_x, y, _width, _height, _color);
  }

  return [{
    pos: { x: _x, y: y },
    width: _width,
    height: _height,
    color: _color,
    movingUp: movingUp,
    movingDown: movingDown
  },
    movePaddle,
    drawPaddle,
    setMovingDown,
    setMovingUp,
    setY];
}

export default usePaddle;