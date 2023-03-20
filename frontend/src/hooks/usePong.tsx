import { useEffect, useState } from "react";
import { IPaddle, IBall, IGameState, IPlayer } from "../types";
import useBall from "../hooks/useBall";
import usePaddle from "../hooks/usePaddle";
import { CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_NET_COLOR, CANVAS_NET_GAP, TARGET_FPS, PADDLE_LEFT_POS_X, PADDLE_RIGHT_POS_X, BALL_DEFAULT_POS_X, BALL_DEFAULT_POS_Y } from "../constants";

const usePong = (): [IGameState, any] => {
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

  const handleKeyDown = (event: any) => {
    if (event.key === ' ') {      
      setPause((pause) => !pause);
    }

    // Left paddle
    if (event.key === "z" || event.key === "Z" || event.key === "w" || event.key === "W") {
      setLeftPaddleMovingUp(true);
    }
    if (event.key === "s" || event.key === "S") {
      setLeftPaddleMovingDown(true);
    }

    // Right paddle
    if (event.key === "ArrowUp") {
      setRightPaddleMovingUp(true);
    }
    if (event.key === "ArrowDown") {
      setRightPaddleMovingDown(true);
    }
    // console.log("User pressed: '" + event.key + "'");
  };

  const handleKeyUp = (event: any) => {
    // Left paddle
    if (event.key === "z" || event.key === "Z" || event.key === "w" || event.key === "W") {
      setLeftPaddleMovingUp(false);
    }
    if (event.key === "s" || event.key === "S") {
      setLeftPaddleMovingDown(false);
    }

    // Right paddle
    if (event.key === "ArrowUp") {
      setRightPaddleMovingUp(false);
    }
    if (event.key === "ArrowDown") {
      setRightPaddleMovingDown(false);
    }
    // console.log("User released: '" + event.key + "'");
  };

  const resetGame = () => {
    setPause(true);
    resetBall();
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [])

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
    () => {resetGame()},
  ]);
}

export default usePong;