import { Dispatch, SetStateAction, useState } from "react";
import { IBall, IPaddle } from "../types";
import { BALL_DEFAULT_SPEED, BALL_DEFAULT_RADIUS, BALL_VELOCITY_Y, CANVAS_DEFAULT_WIDTH } from "../constants";
import Canvas from "../components/Canvas";

/**
 * 
 * @param _sideWalls Bounce off side walls
 * @param _radius Ball radius
 * @param _pos Ball default position
 * @param _velocity Ball velocity
 * @param _color Ball color
 * @returns IBall state
 */
function useBall(
  canvas: Canvas,
  _sideWalls: boolean,
  _radius: number = canvas.width / (CANVAS_DEFAULT_WIDTH / BALL_DEFAULT_RADIUS),
  _x: number = canvas.width / 2,
  _y: number = canvas.height / 2,
  _speed: number = canvas.width / (CANVAS_DEFAULT_WIDTH / BALL_DEFAULT_SPEED),
  _velocityX: number =_speed * Math.cos(Math.PI * 4) * 1,
  _velocityY: number = BALL_VELOCITY_Y(),
  _color: string = "white",
): [
  IBall,
  () => void,
  () => void,
  (left: IPaddle, right: IPaddle) => void,
  () => void,
  Dispatch<SetStateAction<boolean>>,
] {
  const [x, setX] = useState(_x);
  const [y, setY] = useState(_y);
  const [speed, setSpeed] = useState(_speed)
  const [velocityX, setVelocityX] = useState(_velocityX);
  const [velocityY, setVelocityY] = useState(_velocityY);
  const [color, setColor] = useState(_color);
  const [colorIndex, setColorIndex] = useState(0);
  const [startVelocityGoesLeft, setstartVelocityGoesLeft] = useState(_velocityX > 0);
  const [pause, setPause] = useState(false);
  // const colors = ["white", "silver", "grey", "maroon", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua"];

  function __left_() { return x - _radius; }
  function __right_() { return x + _radius; }
  function __top_() { return y - _radius; }
  function __bottom_() { return y + _radius; }

  function _isInPaddleNextFrame(paddle: IPaddle) {
    return __left_() + velocityX <= paddle.x + paddle.width && __right_() + velocityX >= paddle.x
      && __top_() + velocityY <= paddle.y + paddle.height && __bottom_() + velocityY >= paddle.y;
  }

  function _isInPaddle(paddle: IPaddle) {
    return __left_() <= paddle.x + paddle.width && __right_() >= paddle.x
      && __top_() <= paddle.y + paddle.height && __bottom_() >= paddle.y;
  }

  function _calculateBallAngle(paddle: IPaddle, isLeft: boolean, c: number) {
    let collidePoint = (y - (paddle.y + paddle.height / 2));
    collidePoint = collidePoint / (paddle.height / 2);
    let angleRad = (Math.PI / 4) * collidePoint;

    let direction = (isLeft ? 1 : -1);
    if (c == 3) {
      direction *= -1;
    }

    if (c == 1) {
      setVelocityY(-velocityY);
    }
    else {
      setVelocityX(speed * Math.cos(angleRad) * direction);
      setVelocityY(speed * Math.sin(angleRad));
      if (speed < 15)
        setSpeed(speed + 0.1);
    }
  }

  function _ballCollidesWith(paddle: IPaddle) {
    if (paddle && _isInPaddle(paddle)) {
      // right paddle
      if (velocityX > 0) {
        if (__right_() >= paddle.x + paddle.width / 2) {
          if (__bottom_() <= paddle.y + paddle.height / 2 && velocityY > 0) {
            return 1;
          }
          else if (__top_() >= paddle.y + paddle.height / 2 && velocityY < 0) {
            return 1;
          }
          return 3;
        }
        return 2;
      }
      // left paddle
      else {
        if (__left_() <= paddle.x + paddle.width / 2) {
          if (__bottom_() <= paddle.y + paddle.height / 2 && velocityY > 0) {
            return 1;
          }
          else if (__top_() >= paddle.y + paddle.height / 2 && velocityY < 0) {
            return 1;
          }
          return 3;
        }
        return 2;
      }
    }
    if (velocityX < 0) {
      if (_isInPaddleNextFrame(paddle) && __top_() > paddle.y && __bottom_() < paddle.y + paddle.height) {
        setX(paddle.x + paddle.width + _radius);
        return (2);
      }
    }
    else {
      if (_isInPaddleNextFrame(paddle) && __top_() > paddle.y && __bottom_() < paddle.y + paddle.height) {
        setX(paddle.x - _radius);
        return (2);
      }
    }
    return (0);
  }

  function checkBallCollisions(left: IPaddle, right: IPaddle) {
    let c;
    if (velocityX < 0) {
      if ((c = _ballCollidesWith(left))) {
        _calculateBallAngle(left, true, c);
      }
    }
    else {
      if ((c = _ballCollidesWith(right))) {
        _calculateBallAngle(right, false, c);
      }
    }
  }

  function moveBall() {
    // the next line is useless
    // colorIndex == colors.length - 1 ? setColorIndex(0) : setColorIndex(colorIndex + 1); setColor(colors[colorIndex]);

    if (pause) {
      return;
    }

    if (_sideWalls) {
      if (__left_() < 0 && velocityX < 0) {
        setVelocityX(-velocityX);
        setX(x - velocityX);
        return;
      }
      if (__right_() > canvas.width && velocityX > 0) {
        setVelocityX(-velocityX);
        setX(x - velocityX);
        return;
      }
    }

    if (y < 0 + _radius && velocityY < 0) {
      setVelocityY(-velocityY);
      setY(y - velocityY);
      return;
    }
    if (y > canvas.height - _radius && velocityY > 0) {
      setVelocityY(-velocityY);
      setY(y - velocityY);
      return;
    }
    setX(x + velocityX);
    setY(y + velocityY);
  }

  function drawBall() {
    canvas.drawCircle(x, y, _radius, color);
  }

  function resetBall() {
    setSpeed(_speed);
    setX(_x);
    setY(_y);

    // alternate starting direction
    setVelocityX(startVelocityGoesLeft ? _velocityX : -_velocityX);
    setstartVelocityGoesLeft(!startVelocityGoesLeft);

    // set random angle
    setVelocityY(BALL_VELOCITY_Y());
  }

  return [
    {
      radius: _radius,
      x: x,
      y: y,
      speed: speed,
      velocityX: velocityX,
      velocityY: velocityY,
      color: color,
      pause: pause,
    },
    moveBall,
    drawBall,
    checkBallCollisions,
    resetBall,
    setPause,
  ];
}

export default useBall;