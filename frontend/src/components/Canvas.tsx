import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants";

class Canvas {
	public context: CanvasRenderingContext2D | null;
  constructor(context: CanvasRenderingContext2D | null) {this.context = context}

  public clear() {
    if (this.context) {
      this.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }

	public drawRect(x: number, y: number, w: number, h: number, color: string) {
    if (this.context) {
      this.context.strokeStyle = color;
      this.context.fillStyle = color;
      this.context.fillRect(x, y, w, h);
    }
	}

	public drawCircle(x: number, y: number, radius: number, color: string) {
    if (this.context) {
      this.context.fillStyle = color;
      this.context.beginPath();
      this.context.arc(x, y, radius, 0, Math.PI * 2, true);
      this.context.closePath();
      this.context.fill();
    }
	}

  public drawText(text: string, x: number, y: number, color: string) {
    if (this.context) {
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 8;
      this.context.strokeText(text, x, y);
      this.context.fillStyle = color;
      this.context.font = "bold 68px Courier New";
      this.context.fillText(text, x, y);
      this.context.lineWidth = 0;
    }
  }
}

export default Canvas;