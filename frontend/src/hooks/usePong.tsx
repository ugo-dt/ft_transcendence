import { useEffect, useState } from "react";
import { IPaddle, IBall, IGameState, IPlayer } from "../types";
import useBall from "../hooks/useBall";
import usePaddle from "../hooks/usePaddle";
import { CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_NET_COLOR, CANVAS_NET_GAP, TARGET_FPS, PADDLE_LEFT_POS_X, PADDLE_RIGHT_POS_X, BALL_DEFAULT_POS_X, BALL_DEFAULT_POS_Y } from "../constants";

// customization ideas:
// 
// ball slowly gets smaller over time
// ball slowly gets faster after each collision
// different map color (maybe one for each player? maybe player gets to choose their color?)

const usePong = (): [IGameState, any, any, any, any, any, any] => {
  const [pause, setPause] = useState(true);
  const [ball, moveBall, drawBall, setBallRadius, setBallColor, setBallPosition, resetBall] = useBall(true);
  const [leftPaddle, moveLeftPaddle, drawLeftPaddle, setLeftPaddleMovingUp, setLeftPaddleMovingDown] = usePaddle(PADDLE_LEFT_POS_X);
  const [rightPaddle, moveRightPaddle, drawRightPaddle, setRightPaddleMovingUp, setRightPaddleMovingDown] = usePaddle(PADDLE_RIGHT_POS_X);
  
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  function drawNet() {
    for (var i: number = 0; i < canvas.height; i += CANVAS_NET_GAP) {
      context.fillStyle = CANVAS_NET_COLOR;
      context.fillRect(canvas.width / 2 - 6, i + 8, 10, 15);
    }
  }

  function drawGame() {
      context.fillStyle = "black";
      context.fillRect(0, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT);

      context.fillStyle = "black";
      context.fillRect(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      drawNet();
      drawBall(context);
      drawLeftPaddle(context);
      drawRightPaddle(context);
  }

  const resetGame = () => {
    setPause(true);
    resetBall();
  }

  useEffect(() => {    
    canvas = document.getElementById("canvas") as HTMLCanvasElement
    context = canvas.getContext("2d") as CanvasRenderingContext2D;
    let timeId: number;
    timeId = setInterval(() => {
      if (pause)
        setBallColor("pink");
      else {
        setBallColor("white");
        moveBall();
        moveLeftPaddle();
        moveRightPaddle();
      }
      drawGame();
    }, 1000 / TARGET_FPS);

    return (() => {
      clearInterval(timeId);
    })
  }, [pause, ball, leftPaddle, rightPaddle]);

  return ([
    {
      ball: ball,
      paddles: {
        left: leftPaddle,
        right: rightPaddle,
      },
      pause: pause,
    },
    setLeftPaddleMovingUp,
    setLeftPaddleMovingDown,
    setRightPaddleMovingUp,
    setRightPaddleMovingDown,
    setPause,
    resetGame,
  ]);
}

export default usePong;