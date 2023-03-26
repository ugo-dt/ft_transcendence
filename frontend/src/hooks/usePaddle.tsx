import { useState } from "react";
import { IPaddle } from "../types";
import { CANVAS_FOREGROUND_COLOR, CANVAS_HEIGHT, PADDLE_DEFAULT_POS_Y, PADDLE_HEIGHT, PADDLE_WIDTH } from "../constants";
import Canvas from "../components/Canvas";

const usePaddle = (
  _x: number,
  _y: number = PADDLE_DEFAULT_POS_Y,
  _width: number = PADDLE_WIDTH,
  _height: number = PADDLE_HEIGHT,
  _color: string = CANVAS_FOREGROUND_COLOR,
): [IPaddle, any, any, any, any] => {
  const [y, setY]: [number, any] = useState(_y);
  const [velocityY, setVelocityY]: [number, any] = useState(0);

  function movePaddle() {
    if (y + velocityY >= 0 && y + velocityY <= CANVAS_HEIGHT - PADDLE_HEIGHT) {
      setY(y + velocityY);
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
    velocityY: velocityY,
  },
    movePaddle,
    drawPaddle,
    setY,
    setVelocityY,
  ];
}

export default usePaddle;