import { useState } from "react";
import { IPaddle } from "../types";
import { CANVAS_DEFAULT_HEIGHT, CANVAS_DEFAULT_WIDTH, PADDLE_DEFAULT_COLOR, PADDLE_DEFAULT_HEIGHT, PADDLE_DEFAULT_WIDTH, PADDLE_DEFAULT_X_LEFT, PADDLE_DEFAULT_X_RIGHT } from "../constants";
import Canvas from "../components/Canvas";

const usePaddle = (
  canvas: Canvas,
  _isLeft: boolean,
): [IPaddle, any, any, any, any] => {
  const [x] = useState(_isLeft ? canvas.width / (CANVAS_DEFAULT_WIDTH / PADDLE_DEFAULT_X_LEFT) : canvas.width / (CANVAS_DEFAULT_WIDTH / PADDLE_DEFAULT_X_RIGHT));
  const [y, setY] = useState(canvas.height / 2 - (canvas.height / (CANVAS_DEFAULT_HEIGHT / (PADDLE_DEFAULT_HEIGHT / 2))));
  const [width] = useState(canvas.width / (CANVAS_DEFAULT_WIDTH / PADDLE_DEFAULT_WIDTH));
  const [height] = useState(canvas.height / (CANVAS_DEFAULT_HEIGHT / PADDLE_DEFAULT_HEIGHT));
  const [color] = useState(PADDLE_DEFAULT_COLOR);
  const [velocityY, setVelocityY] = useState(0);

  function movePaddle() {
    if (!velocityY) { return ;}
    if (y + velocityY >= 0 && y + velocityY <= canvas.height - height) {
      setY(y + velocityY);
    }
  }

  function drawPaddle() {
    canvas.drawRect(x, y, width, height, color);
  }

  return [
    {
      pos: {
        x: x,
        y: y
      },
      width: width,
      height: height,
      color: color,
      velocityY: velocityY,
    },
    movePaddle,
    drawPaddle,
    setY,
    setVelocityY,
  ];
}

export default usePaddle;