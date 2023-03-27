import { useState } from "react";
import { IBall, IPaddle, Vec2 } from "../types";
import { BALL_DEFAULT_POS_X, BALL_DEFAULT_POS_Y, BALL_DEFAULT_SPEED, BALL_DEFAULT_RADIUS, BALL_VELOCITY_X, BALL_VELOCITY_Y, CANVAS_DEFAULT_WIDTH } from "../constants";
import Canvas from "../components/Canvas";

/**
 * 
 * @param _sideWalls Bounce off side walls
 * @param _radius Ball radius
 * @param _pos Ball default position
 * @param _velocity Ball velocity
 * @param _color Ball color
 * @param _active Is ball active (is displayed, can score)
 * @returns IBall state
 */
const useBall = (
  canvas: Canvas,
  _sideWalls: boolean,
  _radius: number = canvas.width / (CANVAS_DEFAULT_WIDTH / BALL_DEFAULT_RADIUS),
  _pos: Vec2 = { x: canvas.width / 2, y: canvas.height / 2 },
  _speed: number = canvas.width / (CANVAS_DEFAULT_WIDTH / BALL_DEFAULT_SPEED),
  _velocity: Vec2 = { x: _speed * Math.cos(Math.PI * 4) * 1, y: BALL_VELOCITY_Y() },
  _color: string = "red",
  _active: boolean = true,
): [IBall, any, any, any, any, any, any] => {
  const [x, setX] = useState(_pos.x);
  const [y, setY] = useState(_pos.y);
  const [speed, setSpeed] = useState(_speed)
  const [velocityX, setVelocityX] = useState(_velocity.x);
  const [velocityY, setVelocityY] = useState(_velocity.y);
  const [color, setColor] = useState(_color);
  const [colorIndex, setColorIndex] = useState(0);
  const [active, setActive] = useState(_active);
  const [startVelocityGoesLeft, setstartVelocityGoesLeft] = useState(_velocity.x > 0);
  const [pause, setPause] = useState(false);
  // const colors = ["white", "silver", "grey", "maroon", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua"];

  function __left_() { return x - _radius; }
  function __right_() { return x + _radius; }
  function __top_() { return y - _radius; }
  function __bottom_() { return y + _radius; }

  function _isInPaddle(paddle: IPaddle) {
    return __left_() < paddle.pos.x + paddle.width && __right_() > paddle.pos.x
      && __top_() < paddle.pos.y + paddle.height && __bottom_() > paddle.pos.y;
  }

  function _calculateBallAngle(paddle: IPaddle, isLeft: boolean, c: number) {
    let collidePoint = (y - (paddle.pos.y + paddle.height / 2));
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
      setSpeed(speed + 0.1);
    }
  }

  function _ballCollidesWith(paddle: IPaddle) {
    if (paddle && _isInPaddle(paddle)) {
      // right paddle
      if (velocityX > 0) {
        if (__right_() > paddle.pos.x + paddle.width / 2) {
          if (__bottom_() <= paddle.pos.y + paddle.height / 2 && velocityY > 0) {
            return 1;
          }
          else if (__top_() >= paddle.pos.y + paddle.height / 2 && velocityY < 0) {
            return 1;
          }
          return 3; // this doesnt work when speed increases
        }
        return 2;
      }
      // left paddle
      else {
        if (__left_() < paddle.pos.x + paddle.width / 2) {
          if (__bottom_() <= paddle.pos.y + paddle.height / 2 && velocityY > 0) {
            return 1;
          }
          else if (__top_() >= paddle.pos.y + paddle.height / 2 && velocityY < 0) {
            return 1;
          }
          return 3; // this doesnt work when speed increases
        }
        return 2;
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
    if (!active) { return; }
    canvas.drawCircle(x, y, _radius, color);
  }

  function resetBall() {
    setSpeed(_speed);
    setX(_pos.x);
    setY(_pos.y);

    // alternate starting direction
    setVelocityX(startVelocityGoesLeft ? _velocity.x : -_velocity.x);
    setstartVelocityGoesLeft(!startVelocityGoesLeft);

    // set random angle
    // setVelocityY(BALL_VELOCITY_Y());
    setVelocityY(0);
  }

  return [
    {
      radius: _radius,
      pos: { x: x, y: y },
      speed: speed,
      velocity: { x: velocityX, y: velocityY },
      color: color,
      active: active,
      pause: pause,
    },
    moveBall,
    drawBall,
    checkBallCollisions,
    resetBall,
    setActive,
    setPause,
  ];
}

export default useBall;