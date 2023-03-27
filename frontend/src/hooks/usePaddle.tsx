import { useState } from "react";
import { IPaddle } from "../types";
import { CANVAS_DEFAULT_HEIGHT, CANVAS_DEFAULT_WIDTH, PADDLE_DEFAULT_COLOR } from "../constants";
import Canvas from "../components/Canvas";

const usePaddle = (
  canvas: Canvas,
  _isLeft: boolean,
): [IPaddle, any, any, any, any] => {
  const [x, setX]: [number, any] = useState(_isLeft ? canvas.width / (CANVAS_DEFAULT_WIDTH / 20) : canvas.width / (CANVAS_DEFAULT_WIDTH / 615));
  const [y, setY]: [number, any] = useState(canvas.height / 2 - (canvas.height / (CANVAS_DEFAULT_HEIGHT / 80)));
  const [width, setWidth]: [number, any] = useState(canvas.width / (CANVAS_DEFAULT_WIDTH / 15));
  const [height, setHeight]: [number, any] = useState(canvas.height / (CANVAS_DEFAULT_HEIGHT / 80));
  const [color, setColor]: [string, any] = useState(PADDLE_DEFAULT_COLOR);
  const [velocityY, setVelocityY]: [number, any] = useState(canvas.height / (CANVAS_DEFAULT_HEIGHT / 10));

  function movePaddle() {
    if (y + velocityY >= 0 && y + velocityY <= canvas.height - height) {
      setY(y + velocityY);
    }
  }

  function drawPaddle() {
    canvas.drawRect(x, y, width, height, color);
  }

  return [{
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