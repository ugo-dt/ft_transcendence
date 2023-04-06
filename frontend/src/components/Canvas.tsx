import { CANVAS_DEFAULT_HEIGHT, CANVAS_DEFAULT_WIDTH } from "../constants";

class Canvas {
  private _width: number;
  private _height: number;
  private _context: CanvasRenderingContext2D | null;

  public get width(): number { return this._width; }
  public get height(): number { return this._height; }
  public get context(): CanvasRenderingContext2D | null { return this._context; }

  public set width(width: number) { this._width = width; }
  public set height(height: number) { this._height = height; }
  public set context(context: CanvasRenderingContext2D | null) { this._context = context; }

  constructor(width: number, height: number, context: CanvasRenderingContext2D | null) {
    this._width = width;
    this._height = height;
    this._context = context;
  }

  public clear() {
    if (this._context) {
      this._context.clearRect(0, 0, CANVAS_DEFAULT_WIDTH, CANVAS_DEFAULT_HEIGHT);
    }
  }

  public fill(color: string) {
    if (this._context) {
      this._context.rect(0, 0, this._width, this._height);
      this._context.fillStyle = color;
      this._context.fill();
    }
  }

  public drawRect(x: number, y: number, w: number, h: number, color: string) {
    if (this._context) {
      this._context.strokeStyle = color;
      this._context.fillStyle = color;
      this._context.fillRect(x, y, w, h);
    }
  }

  public drawCircle(x: number, y: number, radius: number, color: string) {
    if (this._context) {
      this._context.fillStyle = color;
      this._context.beginPath();
      this._context.arc(x, y, radius, 0, Math.PI * 2, true);
      this._context.closePath();
      this._context.fill();
    }
  }

  public drawText(text: string, x: number, y: number, color: string) {
    if (this._context) {
      this._context.font = "bold 68px Courier New";
      this._context.strokeStyle = 'black';
      this._context.lineWidth = 8;
      this._context.strokeText(text, x, y);
      this._context.fillStyle = color;
      this._context.fillText(text, x, y);
      this._context.lineWidth = 0;
    }
  }
}

export default Canvas;