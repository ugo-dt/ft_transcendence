import Paddle, { IPaddle } from "./Paddle";
import { Player } from "./Player";

const DEFAULT_SPEED = 300;
const DEFAULT_RADIUS = 7;

export interface IBall {
  x: number,
  y: number,
  radius: number,
  speed: number,
  velocityX: number,
  velocityY: number,
  color: string,
  pause: boolean,
}

export default class Ball {
  private _x: number;
  private _y: number;
  private _radius: number;
  private _speed: number;
  private _velocityX: number;
  private _velocityY: number;
  private _color: string;
  private _sideWalls: boolean;
  private _startsRight: boolean;
  private _nextFrame: any;

  constructor(
    x: number,
    y: number,
    color: string,
    sideWalls: boolean = false,
  ) {
    this._x = x;
    this._y = y;
    this._radius = DEFAULT_RADIUS;
    this._speed = DEFAULT_SPEED;
    this._velocityX = DEFAULT_SPEED;
    this._velocityY = 0;//Math.random() * ((DEFAULT_SPEED / 2) - -(DEFAULT_SPEED / 2)) - (DEFAULT_SPEED / 2);
    this._color = color;
    this._sideWalls = sideWalls;
    this._startsRight = true;
    this._nextFrame = null;
  }

  public get x(): number { return this._x; }
  public get y(): number { return this._y; }
  public get radius(): number { return this._radius; }
  public get speed(): number { return this._speed; }
  public get velocityX(): number { return this._velocityX; }
  public get velocityY(): number { return this._velocityY; }
  public get color(): string { return this._color; }

  public set x(x: number) { this._x = x; }
  public set y(y: number) { this._y = y; }
  public set radius(r: number) { this._radius = r; }
  public set color(c: string) { this._color = c; }

  public get left(): number { return this._x - this._radius; }
  public get right(): number { return this._x + this._radius; }
  public get top(): number { return this._y - this._radius; }
  public get bottom(): number { return this._y + this._radius; }

  private _isInPaddleNextFrame(paddle: IPaddle, deltaTime: number) {
    const nextLeft = this.left + this._velocityX * deltaTime;
    const nextRight = this.right + this._velocityX * deltaTime;
    const nextTop = this.top + this._velocityY * deltaTime;
    const nextBottom = this.bottom + this._velocityY * deltaTime;

    const buffer = this._radius / 2;

    return (
      nextLeft < paddle.x + paddle.width + buffer &&
      nextRight > paddle.x - buffer &&
      nextTop < paddle.y + paddle.height + buffer &&
      nextBottom > paddle.y - buffer
    );
  }

  private _isInPaddle(paddle: IPaddle) {
    const left = this.left;
    const right = this.right;
    const top = this.top;
    const bottom = this.bottom;

    const buffer = this._radius / 2;

    return (
      left < paddle.x + paddle.width + buffer &&
      right > paddle.x - buffer &&
      top < paddle.y + paddle.height + buffer &&
      bottom > paddle.y - buffer
    );
  }

  private _calculateBallAngle(paddle: IPaddle, isLeft: boolean, c: number) {
    let collidePoint = (this._y - (paddle.y + paddle.height / 2));
    collidePoint = collidePoint / (paddle.height / 2);
    let angleRad = (Math.PI / 4) * collidePoint;

    let direction = (isLeft ? 1 : -1);
    if (c == 3) {
      direction *= -1;
    }

    if (c == 1) {
      this._velocityY = -this._velocityY;
    }
    else {
      const velocityX = this._speed * Math.cos(angleRad) * direction;
      const velocityY = this._speed * Math.sin(angleRad);
      this._velocityX = Math.round(velocityX);
      this._velocityY = Math.round(velocityY);
      if (Math.abs(this._speed) < 3 * DEFAULT_SPEED) {
        this._speed += 20;
      }
    }
  }

  private _ballCollidesWith(paddle: IPaddle) {
    // right paddle
    if (this._velocityX > 0) {
      if (this.right >= paddle.x + paddle.width / 2) {
        if (this.bottom <= paddle.y + paddle.height / 2 && this._velocityY > 0) {
          return 1;
        }
        else if (this.top >= paddle.y + paddle.height / 2 && this._velocityY < 0) {
          return 1;
        }
        return 3;
      }
    }
    // left paddle
    else {
      if (this.left <= paddle.x + paddle.width / 2) {
        if (this.bottom <= paddle.y + paddle.height / 2 && this._velocityY > 0) {
          return 1;
        }
        else if (this.top >= paddle.y + paddle.height / 2 && this._velocityY < 0) {
          return 1;
        }
        return 3;
      }
      return 2;
    }
    return 2;
  }

  private _checkBallCollisions(canvasWidth: number, canvasHeight: number, left: IPaddle, right: IPaddle, deltaTime: number) {
    let c;

    // sides
    if (this._sideWalls) {
      if ((this.left < 0 && this._velocityX < 0) || (this.right > canvasWidth && this._velocityX > 0)) {
        this._velocityX = -this._velocityX;
        // this._x += this._velocityX;
        return;
      }
    }
    // floor / ceiling
    if ((this.top < 0 && this._velocityY < 0)
      || (this.bottom > canvasHeight && this._velocityY > 0)) {
      this._velocityY = -this._velocityY;
      // this._y -= this._velocityY;
      return;
    }
    // paddles
    if (this._nextFrame) {
      this._calculateBallAngle(this._nextFrame.paddle, this._nextFrame.isLeft, this._nextFrame.c);
      this._nextFrame = null;
      return ;
    }
  
    if (this._velocityX < 0) {
      if (this._isInPaddle(left)) {
        if ((c = this._ballCollidesWith(left))) {
          this._calculateBallAngle(left, true, c);
          return ;
        }
      }
    }
    else {
      if (this._isInPaddle(right)) {
        if ((c = this._ballCollidesWith(right))) {
          this._calculateBallAngle(right, false, c);
          return ;
        }
      }
    }

    if (this._velocityX < 0) {
      if (this._isInPaddleNextFrame(left, deltaTime)) {
        if ((c = this._ballCollidesWith(left))) {
          this._nextFrame = {paddle: left, isLeft: true, c: c};
          this.x = left.x + left.width + this._radius;
          return ;
        }
      }
    }
    else {
      if (this._isInPaddleNextFrame(right, deltaTime)) {
        if ((c = this._ballCollidesWith(right))) {
          this._nextFrame = {paddle: right, isLeft: false, c: c};
          this.x = right.x - this._radius;
          return ;
        }
      }
    }
  }

  private _move(deltaTime: number) {
    const x = this._x + this._velocityX * deltaTime;
    const y = this._y + this._velocityY * deltaTime;
    this._x = Math.round(x);
    this._y = Math.round(y);
  }

  public reset() {
    this._speed = DEFAULT_SPEED;

    // alternate starting direction
    this._velocityX = this._startsRight ? -DEFAULT_SPEED : DEFAULT_SPEED;
    this._startsRight = !this._startsRight;

    // set random angle
    this._velocityY = Math.random() * ((DEFAULT_SPEED / 2) - -(DEFAULT_SPEED / 2)) - (DEFAULT_SPEED / 2);
  }

  private _scorePoint(canvasWidth: number, leftPlayer: Player, rightPlayer: Player) {
    if (this._x > canvasWidth) {
      leftPlayer.score += 1;
    }
    else {
      rightPlayer.score += 1;
    }
  }

  public update(
    canvasWidth: number,
    canvasHeight: number,
    deltaTime: number,
    leftPaddle: Paddle,
    rightPaddle: Paddle,
    leftPlayer: Player,
    rightPlayer: Player
  ): void {
    this._move(deltaTime);
    this._checkBallCollisions(canvasWidth, canvasHeight, leftPaddle.IPaddle(), rightPaddle.IPaddle(), deltaTime);
    if (this._x > canvasWidth || this._x < 0) {
      this._scorePoint(canvasWidth, leftPlayer, rightPlayer);
      this._x = canvasWidth / 2;
      this._y = canvasHeight / 2;
      this._velocityX = 0;
      this._velocityY = 0;
      setTimeout(() => {
        this.reset();
      }, 500);
    }
  }

  public IBall(): IBall {
    return (
      {
        radius: this._radius,
        x: this._x,
        y: this._y,
        speed: this._speed,
        velocityX: this._velocityX,
        velocityY: this._velocityY,
        color: this._color,
        pause: false,
      }
    );
  }
}