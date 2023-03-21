import { useEffect, useState } from "react";
import { CANVAS_HEIGHT, CANVAS_NET_COLOR, CANVAS_NET_GAP, CANVAS_WIDTH, TARGET_FPS } from "../constants";
import { IPaddle, IBall, IGameState, IPlayer } from "../types";
import useBall from "../hooks/useBall";
import usePaddle from "../hooks/usePaddle";
import usePlayer from "./usePlayer";

// customization ideas:
// 
// ball slowly gets smaller over time
// ball slowly gets faster after each collision
// different map color (maybe one for each player? maybe player gets to choose their color?)

const usePong = (
  leftPlayerData: IPlayer,
  rightPlayerData: IPlayer,
): [IGameState, any, any] => {
  const [pause, setPause] = useState(false);
  const [ball, moveBall, drawBall, setBallRadius, setBallColor, setBallPosition, resetBall] = useBall(true);
  const [leftPlayer, setLeftPlayerMovingDown, setLeftPlayerMovingUp, moveLeftPaddle, drawLeftPaddle] = usePlayer(leftPlayerData);
  const [rightPlayer, setRightPlayerMovingDown, setRightPlayerMovingUp, moveRightPaddle, drawRightPaddle] = usePlayer(rightPlayerData);

  const resetGame = () => {
    setPause(true);
    resetBall();
  }

  function drawNet(context: CanvasRenderingContext2D) {
    for (var i: number = 0; i < CANVAS_HEIGHT; i += CANVAS_NET_GAP) {
      context.fillStyle = CANVAS_NET_COLOR;
      context.fillRect(CANVAS_WIDTH / 2 - 6, i + 8, 10, 15);
    }
  }

  function drawGame(context: CanvasRenderingContext2D) {
    console.log("drawing");

    context.fillStyle = "black";
    context.fillRect(0, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT);

    context.fillStyle = "black";
    context.fillRect(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawNet(context);
    drawBall(context);
    // drawLeftPaddle(context);
    // drawRightPaddle(context);
  }

  // const handleKeyDown = (event: KeyboardEvent) => {
  //   if (event.key === ' ') {
  //     setPause((pause) => !pause);
  //   }
  //   if (event.key === "z" || event.key === "Z" || event.key === "w" || event.key === "W") {
  //     setLeftPlayerMovingUp(true);
  //   }
  //   if (event.key === "s" || event.key === "S") {
  //     setLeftPlayerMovingDown(true);
  //   }
  //   if (event.key === "ArrowUp") {
  //     setRightPlayerMovingUp(true);
  //   }
  //   if (event.key === "ArrowDown") {
  //     setRightPlayerMovingDown(true);
  //   }
  // }

  // const handleKeyUp = (event: any) => {
  //   if (event.key === "z" || event.key === "Z" || event.key === "w" || event.key === "W") {
  //     setLeftPlayerMovingUp(false);
  //   }
  //   if (event.key === "s" || event.key === "S") {
  //     setLeftPlayerMovingDown(false);
  //   }
  //   if (event.key === "ArrowUp") {
  //     setRightPlayerMovingUp(false);
  //   }
  //   if (event.key === "ArrowDown") {
  //     setRightPlayerMovingDown(false);
  //   }
  // }

  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    drawGame(context);
  }, []);

  function update() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    if (!pause) {
      moveBall();
      // moveLeftPaddle();
      // moveRightPaddle();
      drawGame(context);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      update();
    }, 1000 / TARGET_FPS);
    
    return () => clearInterval(interval);
  }, [pause, drawGame]);

  return ([
    {
      ball: ball,
      leftPlayer: leftPlayer,
      rightPlayer: rightPlayer,
      pause: pause,
    },
    resetGame,
    drawGame,
  ]);
}

export default usePong;