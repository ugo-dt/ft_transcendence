import { Bounds } from "./Bounds";
import Paddle, { IPaddle } from "./Paddle";

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
  private _active: boolean;
  private _startsRight: boolean;

  constructor(
    x: number,
    y: number,
    color: string,
    sideWalls: boolean = false,
  ) {
    this._x = x;
    this._y = y;
    this._radius = 7;
    this._speed = 5;
    this._velocityX = 5;
    this._velocityY = 0;//Math.random() * (2 - -2) - 2;
    this._color = color;
    this._sideWalls = sideWalls;
    this._active = false;
    this._startsRight = true;
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

  // public collides(paddle: Bounds) {
  //   return this.left <= paddle.right && this.right >= paddle.left
  //     && this.top <= paddle.bottom && this.bottom >= paddle.top;
  // }

  // public _isInPaddleNextFrame(paddle: Bounds) {
  //   return this.left + this._velocityX <= paddle.right && this.right + this._velocityX >= paddle.left
  //     && this.top + this._velocityY <= paddle.bottom && this.bottom + this._velocityY >= paddle.top;
  // }

  // public _isInPaddle(paddle: Bounds) {
  //   return this.left <= paddle.right && this.right >= paddle.left
  //     && this.top <= paddle.bottom && this.bottom >= paddle.top;
  // }

  // public _calculateBallAngle(paddle: Bounds, isLeft: boolean, c: number) {
  //   let collidePoint = (this._y - (paddle.bottom / 2));
  //   collidePoint = collidePoint / (80 / 2); // 80 is paddle height
  //   let angleRad = (Math.PI / 4) * collidePoint;

  //   let direction = (isLeft ? 1 : -1);
  //   if (c == 3) {
  //     direction *= -1;
  //   }

  //   if (c == 1) {
  //     this._velocityY = -this._velocityY;
  //   }
  //   else {
  //     this._velocityX = this._speed * Math.cos(angleRad) * direction;
  //     this._velocityY = this._speed * Math.sin(angleRad);
  //     if (this._speed < 15)
  //       this._speed = this._speed + 0.1;
  //   }
  // }

  // public _ballCollidesWith(paddle: Bounds) {
  //   if (paddle && this._isInPaddle(paddle)) {
  //     // right paddle
  //     if (this._velocityX > 0) {
  //       if (this.right >= paddle.right / 2) {
  //         if (this.bottom <= paddle.bottom / 2 && this._velocityY > 0) {
  //           return 1;
  //         }
  //         else if (this.top >= paddle.bottom / 2 && this._velocityY < 0) {
  //           return 1;
  //         }
  //         return 3;
  //       }
  //       return 2;
  //     }
  //     // left paddle
  //     else {
  //       if (this.left <= paddle.right / 2) {
  //         if (this.bottom <= paddle.bottom / 2 && this._velocityY > 0) {
  //           return 1;
  //         }
  //         else if (this.top >= paddle.bottom / 2 && this._velocityY < 0) {
  //           return 1;
  //         }
  //         return 3;
  //       }
  //       return 2;
  //     }
  //   }
  //   if (this._velocityX < 0) {
  //     if (this._isInPaddleNextFrame(paddle) && this.top > paddle.top && this.bottom < paddle.bottom) {
  //       this._x = paddle.right + this._radius;
  //       return (2);
  //     }
  //   }
  //   else {
  //     if (this._isInPaddleNextFrame(paddle) && this.top > paddle.top && this.bottom < paddle.bottom) {
  //       this._x = paddle.left - this._radius;
  //       return (2);
  //     }
  //   }
  //   return (0);
  // }

  // public checkBallCollisions(left: Bounds, right: Bounds) {
  //   let c;
  //   if (this._velocityX < 0) {
  //     if ((c = this._ballCollidesWith(left))) {
  //       this._calculateBallAngle(left, true, c);
  //     }
  //   }
  //   else {
  //     if ((c = this._ballCollidesWith(right))) {
  //       this._calculateBallAngle(right, false, c);
  //     }
  //   }
  // }

  public _isInPaddleNextFrame(paddle: IPaddle) {
    return this.left + this._velocityX <= paddle.x + paddle.width && this.right + this._velocityX >= paddle.x
      && this.top + this._velocityY <= paddle.y + paddle.height && this.bottom + this._velocityY >= paddle.y;
  }

  public _isInPaddle(paddle: IPaddle) {
    return this.left <= paddle.x + paddle.width && this.right >= paddle.x
      && this.top <= paddle.y + paddle.height && this.bottom >= paddle.y;
  }

  public _calculateBallAngle(paddle: IPaddle, isLeft: boolean, c: number) {
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
      this._velocityX = this._speed * Math.cos(angleRad) * direction;
      this._velocityY = this._speed * Math.sin(angleRad);
      if (this._speed < 15) {
        this._speed += 0.1;
      }
    }
  }

  public _ballCollidesWith(paddle: IPaddle) {
    if (paddle && this._isInPaddle(paddle)) {
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
        return 2;
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
    }
    // if (this._velocityX < 0) {
    //   if (this._isInPaddleNextFrame(paddle) && this.top > paddle.y && this.bottom < paddle.y + paddle.height) {
    //     this._x = paddle.x + paddle.width + this._radius;
    //     return (2);
    //   }
    // }
    // else {
    //   if (this._isInPaddleNextFrame(paddle) && this.top > paddle.y && this.bottom < paddle.y + paddle.height) {
    //     this._x = paddle.x - this._radius;
    //     return (2);
    //   }
    // }
    return (0);
  }

  public checkBallCollisions(left: IPaddle, right: IPaddle) {
    let c;
    if (this._velocityX < 0) {
      if ((c = this._ballCollidesWith(left))) {
        this._calculateBallAngle(left, true, c);
      }
    }
    else {
      if ((c = this._ballCollidesWith(right))) {
        this._calculateBallAngle(right, false, c);
      }
    }
  }

  public move(canvasWidth: number, canvasHeight: number) {
    if (this._sideWalls) {
      if ((this.left < 0 && this._velocityX < 0)
        || (this.right > canvasWidth && this._velocityX > 0)) {
        this._velocityX = -this._velocityX;
        this._x -= this._velocityX;
        return;
      }
    }

    if ((this.top < 0 && this._velocityY < 0)
      || (this.bottom > canvasHeight && this._velocityY > 0)) {
      this._velocityY = -this._velocityY;
      this._y -= this._velocityY;
      return;
    }
    this._x += this._velocityX;
    this._y += this._velocityY;
  }

  public reset(x: number, y: number) {
    this._speed = 5;
    this._x = x;
    this._y = y;

    // alternate starting direction
    this._velocityX = this._startsRight ? -5 : 5;
    this._startsRight = !this._startsRight;

    // set random angle
    this._velocityY = Math.random() * (2 - -2) - 2;
  }


  public update(canvasWidth: number, canvasHeight: number, leftPaddle: Paddle, rightPaddle: Paddle): void {
    this.move(canvasWidth, canvasHeight);
    this.checkBallCollisions(leftPaddle.IPaddle(), rightPaddle.IPaddle());
    if (this._active && (this._x > canvasWidth || this._x < 0)) {
      this._active = false;
      setTimeout(() => {
        this.reset(canvasWidth / 2, canvasHeight / 2);
        this._active = true;
      }, 450);
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
        active: true,
        pause: false,
      }
    );
  }
}