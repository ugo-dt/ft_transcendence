import { Bounds } from "./Bounds";

export interface IPaddle {
  x: number,
  y: number,
  width: number;
  height: number;
  color: string;
  velocityY: number,
}

export default class Paddle {
  private _x: number;
  private _y: number;
  private _defaultX: number;
  private _defaultY: number;
  private _width: number;
  private _height: number;
  private _color: string;
  private _velocityY: number;

  constructor(
    x: number,
    color: string
  ) {
    this._x = x;
    this._y = 200;
    this._defaultX = x;
    this._defaultY = 200;
    this._width = 15;
    this._height = 80;
    this._color = color;
    this._velocityY = 0;
  }

  public get x(): number { return this._x; }
  public get y(): number { return this._y; }
  public get defaultX(): number { return this._defaultX; }
  public get defaultY(): number { return this._defaultY; }
  public get width(): number { return this._width; }
  public get height(): number { return this._height; }
  public get color(): string { return this._color; }
  public get velocityY(): number { return this._velocityY; }

  public set x(x: number) { this._x = x; }
  public set y(y: number) { this._y = y; }
  public set defaultX(defaultX: number) { this._defaultX = defaultX; }
  public set defaultY(defaultY: number) { this._defaultY = defaultY; }
  public set width(width: number) { this._width = width; }
  public set height(height: number) { this._height = height; }
  public set color(color: string) { this._color = color; }
  public set velocityY(velocityY: number) { this._velocityY = velocityY; }

  public get bounds(): Bounds {
    return {
      left: this._x,
      right: this._x + this._width,
      top: this._y,
      bottom: this._y + this._height,
    };
  }

  public IPaddle(): IPaddle {
    return {
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height,
      color: this._color,
      velocityY: this._velocityY,
    }
  }

  public update(canvasHeight: number) {
    if (!this._velocityY) {
      return ;
    }
    if (this._y + this._velocityY < 0) {
      this._y = 0;
    }
    else if (this._y + this._velocityY > canvasHeight - this._height) {
      this._y = canvasHeight - this.height;
    }
    else {
      this._y += this._velocityY;
    }
  }

  public reset() {
    this._x = this.defaultX;
    this._y = this.defaultY;
  }
}
