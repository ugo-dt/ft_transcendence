import Paddle from "./Paddle";

export interface IBall {
  x: number,
  y: number,
  radius: number,
  speed: number,
  velocityX: number,
  velocityY: number,
  color: string,
  active: boolean,
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

  constructor(
    x: number,
    y: number,
    color: string,
    sideWalls: boolean,
  ) {
    this._x = x;
    this._y = y;
    this._radius = 7;
    this._speed = 7;
    this._velocityX = 5;
    this._velocityY = 5;
    this._color = color;
    this._sideWalls = sideWalls;
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

  public collides(paddle: Paddle) {
    return this.left <= paddle.x + paddle.width && this.right >= paddle.x
      && this.top <= paddle.y + paddle.height && this.bottom >= paddle.y;
  }

  public update(canvasWidth: number, canvasHeight: number): void {
    if (this._sideWalls) {
      if ((this.left < 0 && this._velocityX < 0)
        || (this.right > canvasWidth && this._velocityX > 0)) {
        this._velocityX = -this._velocityX;
        this._x -= this._velocityX;
        return;
      }
    }

    if ((this._y < 0 + this._radius && this._velocityY < 0)
      || (this._y > canvasHeight - this._radius && this._velocityY > 0)) {
      this._velocityY = -this._velocityY;
      this._y -= this._velocityY;
      return;
    }
    this._x += this._velocityX;
    this._y += this._velocityY;
  }

  public reset(
    x: number,
    y: number,
    speed: number,
    velocityX: number,
    velocityY: number,
  ): void {
    this._x = x;
    this._y = y;
    this._speed = speed;
    this._velocityX = velocityX;
    this._velocityY = velocityY;
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
        active: true,
        pause: false,
      }
    );
  }
}