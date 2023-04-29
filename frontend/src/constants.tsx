/* Pong */
export const DEBUG_MODE = 0x1;
export const OFFLINE_MODE = 0x2;
export const DEMO_MODE = 0x4;
export const TARGET_FPS: number = 60;

/* Canvas */
export const CANVAS_DEFAULT_WIDTH: number = 650;
export const CANVAS_DEFAULT_HEIGHT: number = 480;
export const CANVAS_DEFAULT_BACKGROUND_COLOR: string = "black";
export const CANVAS_DEFAULT_FOREGROUND_COLOR: string = "white";
export const CANVAS_DEFAULT_NET_COLOR: string = CANVAS_DEFAULT_FOREGROUND_COLOR;
export const CANVAS_DEFAULT_NET_GAP: number = 30;

/* Ball */
export const BALL_DEFAULT_RADIUS: number = 7;
export const BALL_DEFAULT_POS_X: number = CANVAS_DEFAULT_WIDTH / 2;
export const BALL_DEFAULT_POS_Y: number = CANVAS_DEFAULT_HEIGHT / 2;
export const BALL_VELOCITY_X: number = 1;
export const BALL_VELOCITY_Y = (): number => {return Math.random() * (2 - -2) - 2};
export const BALL_DEFAULT_SPEED: number = 7;
export const BALL_MAX_STARTING_ANGLE: number = 2.000;

/* Paddle */
export const PADDLE_DEFAULT_COLOR: string = CANVAS_DEFAULT_FOREGROUND_COLOR;
export const PADDLE_DEFAULT_X_LEFT: number = 20;
export const PADDLE_DEFAULT_X_RIGHT: number = 615;
export const PADDLE_DEFAULT_WIDTH: number = 15;
export const PADDLE_DEFAULT_HEIGHT: number = 80;
export const PADDLE_DEFAULT_VELOCITY: number = 10;

/* Chat */

export const CHAT_DEFAULT_AVATAR: string = "../../assets/images/noavatar.png";
export const CHAT_GEAR_ICON: string = "../../../assets/images/gear_icon9.png";
export const CHAT_LEAVE_CHANNEL_ICON: string = "../../../assets/images/leaving.png";
export const CHAT_BROWSE_CHANNEL_ICON: string = "../../../assets/images/browse_channel_icon.png";
export const CHAT_LOCK_ICON: string = "../../../assets/images/lock.png";
export const CHAT_REFRESH_ICON: string = "../../../assets/images/refresh_icon.png";
