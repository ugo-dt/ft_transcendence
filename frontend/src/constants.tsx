/* Pong */
export const NORMAL_MODE = "normal"
export const DEBUG_MODE = "debug"
export const DEMO_MODE = "demo"
export const TARGET_FPS: number = 60;

/* Canvas */
export const CANVAS_DEFAULT_WIDTH: number = 650;
export const CANVAS_DEFAULT_HEIGHT: number = 480;
export const CANVAS_DEFAULT_BACKGROUND_COLOR: string = "black";
export const CANVAS_DEFAULT_FOREGROUND_COLOR: string = "white";
export const CANVAS_DEFAULT_NET_COLOR: string = CANVAS_DEFAULT_FOREGROUND_COLOR;
export const CANVAS_DEFAULT_NET_GAP: number = CANVAS_DEFAULT_HEIGHT / 16;

/* Ball */
export const BALL_RADIUS: number = 8;
export const BALL_DEFAULT_POS_X: number = CANVAS_DEFAULT_WIDTH / 2;
export const BALL_DEFAULT_POS_Y: number = CANVAS_DEFAULT_HEIGHT / 2;
export const BALL_VELOCITY_X: number = 5;
export const BALL_VELOCITY_Y = (): number => {return Math.random() * (3 - -3) - 3};
export const BALL_DEFAULT_SPEED: number = 6;
export const BALL_MAX_STARTING_ANGLE: number = 2.000;

/* Paddle */
export const PADDLE_DEFAULT_COLOR: string = CANVAS_DEFAULT_FOREGROUND_COLOR;