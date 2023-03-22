import { useState } from "react";
import { IPaddle, Vec2 } from "../types";
import { CANVAS_HEIGHT, PADDLE_DEFAULT_POS_Y, PADDLE_HEIGHT, PADDLE_SPEED, PADDLE_WIDTH } from "../constants";
import Canvas from "../components/Canvas";

const usePaddle = (
  _x: number,
  _y: number = PADDLE_DEFAULT_POS_Y,
  _width: number = PADDLE_WIDTH,
  _height: number = PADDLE_HEIGHT,
  _color: string = "white"
): [IPaddle, any, any, any, any, any] => {
  const [x, setX]: [number, any] = useState(_x);
  const [y, setY]: [number, any] = useState(_y);
  const [width, setWidth]: [number, any] = useState(_width);
  const [height, setHeight]: [number, any] = useState(_height);
  const [color, setColor]: [string, any] = useState(_color);
  const [movingUp, setMovingUp]: [boolean, any] = useState(false);
  const [movingDown, setMovingDown]: [boolean, any] = useState(false);

  function movePaddle() {
    if (movingDown) {
      if (movingUp) {
        return ;
      }
      if (y + PADDLE_HEIGHT < CANVAS_HEIGHT) {
        setY(y + PADDLE_SPEED);
      }
    }
    if (movingUp && y > 0) {
      setY(y - PADDLE_SPEED);
    }
  }

  function drawPaddle(canvas: Canvas) {
    canvas.drawRect(x, y, width, height, color);
  }

  return [{
    pos: { x: x, y: y },
    width: width,
    height: height,
    color: color,
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