import { IPaddle, IBall, IGameState, IPlayer } from "../types";
import useBall from "../hooks/useBall";
import usePaddle from "../hooks/usePaddle";
import { CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_NET_COLOR, CANVAS_NET_GAP, TARGET_FPS, PADDLE_LEFT_POS_X, PADDLE_RIGHT_POS_X } from "../constants";
import { useEffect, useState } from "react";

const usePong = (): [IGameState, any, any, any, any] => {
  const [pause, setPause]: [boolean, any] = useState(true);
  const [ball, moveBall, drawBall, setBallRadius, setBallColor, setBallPosition]: [IBall, any, any, any, any, any] = useBall(true);
  const [leftPaddle, moveLeftPaddle, drawLeftPaddle, setLeftPaddleMovingUp, setLeftPaddleMovingDown]: [IPaddle, any, any, any, any] = usePaddle(PADDLE_LEFT_POS_X);
  const [rightPaddle, moveRightPaddle, drawRightPaddle, setRightPaddleMovingUp, setRightPaddleMovingDown]: [IPaddle, any, any, any, any] = usePaddle(PADDLE_RIGHT_POS_X);
  
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

  function handleClick() {
    setPause(!pause);
  }

  const handleKeyDown = (event: any) => {
    if (event.key === ' ')
      setPause(!pause)
    if (event.key === "z" || event.key === "Z" || event.key === "w" || event.key === "W") {
      setLeftPaddleMovingUp(true);
    }
    if (event.key === "s" || event.key === "S") {
      setLeftPaddleMovingDown(true);
    }
    if (event.key === "ArrowUp") {
      setRightPaddleMovingUp(true);
    }
    if (event.key === "ArrowDown") {
      setRightPaddleMovingDown(true);
    }
    // console.log('User pressed: ', event.key);
  };

  const handleKeyUp = (event: any) => {
    if (event.key === "z" || event.key === "Z" || event.key === "w" || event.key === "W") {
      setLeftPaddleMovingUp(false);
    }
    if (event.key === "s" || event.key === "S") {
      setLeftPaddleMovingDown(false);
    }
    if (event.key === "ArrowUp") {
      setRightPaddleMovingUp(false);
    }
    if (event.key === "ArrowDown") {
      setRightPaddleMovingDown(false);
    }
    // console.log('User released: ', event.key);
  };

  const resetGame = () => {
    setPause(true);
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
    }, 1000 / TARGET_FPS);
      drawGame();

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
    handleKeyDown,
    handleKeyUp,
    handleClick,
    resetGame,
  ]);
}

export default usePong;