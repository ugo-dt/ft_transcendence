export const TARGET_FPS: number = 100;

/* Canvas */
export const CANVAS_WIDTH: number	= 650;
export const CANVAS_HEIGHT: number = 480;
export const CANVAS_BACKGROUND_COLOR: string = "black";
export const CANVAS_FOREGROUND_COLOR: string = "white";
export const CANVAS_NET_COLOR: string = CANVAS_FOREGROUND_COLOR;
export const CANVAS_NET_GAP: number = 30;

/* Ball */
export const BALL_RADIUS: number = 8;
export const BALL_DEFAULT_POS_X: number = CANVAS_WIDTH / 2;
export const BALL_DEFAULT_POS_Y: number = CANVAS_HEIGHT / 2;
export const BALL_VELOCITY_X: number = 5;
export const BALL_VELOCITY_Y = (): number => {return Math.random() * (3 - -3) - 3};
export const BALL_DEFAULT_SPEED: number = 6;
export const BALL_MAX_STARTING_ANGLE: number = 2.000;

/* Paddle */
export const PADDLE_LEFT_POS_X: number = 20;
export const PADDLE_RIGHT_POS_X: number = 615;
export const PADDLE_WIDTH: number = 15;
export const PADDLE_HEIGHT: number = 80;
export const PADDLE_VELOCITY: number = 10;
export const PADDLE_COLOR: string = CANVAS_FOREGROUND_COLOR;
export const PADDLE_DEFAULT_POS_Y: number = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
