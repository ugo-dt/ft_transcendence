// customization ideas:
// 
// ball slowly gets smaller over time
// ball slowly gets faster after each collision
// different map color (maybe one for each player? maybe player gets to choose their color?)

import { useEffect, useState } from "react";
import { useKeyState } from "use-key-state";
import { CANVAS_HEIGHT, CANVAS_NET_COLOR, CANVAS_NET_GAP, CANVAS_WIDTH, TARGET_FPS } from "../constants";
import { IGameState, IPlayer } from "../types";
import useBall from "../hooks/useBall";
import usePlayer from "./usePlayer";
import Canvas from "../components/Canvas";

const usePong = (
  canvasElementId: string,
  leftPlayerData: IPlayer,
  rightPlayerData: IPlayer,
): [IGameState, any] => {
  const [pause, setPause] = useState(true);
  const [ball, moveBall, drawBall, setBallRadius, setBallPosition, ballCollidesWith, calculateBallAngle, resetBall] = useBall(false);
  const [leftPlayer, moveLeftPaddle, drawLeftPaddle, setLeftScore] = usePlayer(leftPlayerData);
  const [rightPlayer, moveRightPaddle, drawRightPaddle, setRightScore] = usePlayer(rightPlayerData);
  const {space} = useKeyState({space: 'space'});
  const [canvas, setCanvas] = useState(new Canvas(null));

  function resetGame() {
    resetBall();
    setLeftScore(0);
    setRightScore(0);
  }

  function ballCollides() {
    return (ballCollidesWith(leftPlayer.paddle!) || ballCollidesWith(rightPlayer.paddle!));
  }

  function drawBackground() {
    canvas.drawRect(0, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT, "black");
    canvas.drawRect(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "black");

    for (var i: number = 0; i < CANVAS_HEIGHT; i += CANVAS_NET_GAP) {
      canvas.drawRect(CANVAS_WIDTH / 2 - 6, i + 8, 10, 15, CANVAS_NET_COLOR);
    }
  }

  function render() {
    drawBackground();
    canvas.drawText(leftPlayer.score.toString(), CANVAS_WIDTH / 4, CANVAS_HEIGHT / 5, "white");
    canvas.drawText(rightPlayer.score.toString(), 3 * CANVAS_WIDTH / 4, CANVAS_HEIGHT / 5, "white");
    drawLeftPaddle(canvas);
    drawRightPaddle(canvas);
    drawBall(canvas);
  }

  function update() {
    if (space.down) {
      setPause(!pause);
    }
    if (!pause) {
      moveBall();
      moveLeftPaddle(ball.velocity.x, ball.pos.y);
      moveRightPaddle(ball.velocity.x, ball.pos.y);
      if (ball.pos.x > CANVAS_WIDTH) {
        setLeftScore(leftPlayer.score + 1);
        resetBall();
      }
      else if (ball.pos.x < 0) {
        setRightScore(rightPlayer.score + 1);
        resetBall();
      }
      else if (ballCollides()) {
        console.log("collides");
        if (ball.pos.x < CANVAS_WIDTH / 2) {
          calculateBallAngle(leftPlayer.paddle, true);
        }
        else {
          calculateBallAngle(rightPlayer.paddle, false);
        }
      }
    }
    render();
  }
  
  useEffect(() => {
    canvas.context = (document.getElementById(canvasElementId) as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
    render();
  }, []);
  
  useEffect(() => {   
    const interval = setInterval(() => {
      update();
    }, 1000 / TARGET_FPS);
    
    return () => clearInterval(interval);
  }, [update, pause, ball, leftPlayer, rightPlayer]);

  return ([
    {
      ball: ball,
      leftPlayer: leftPlayer,
      rightPlayer: rightPlayer,
      pause: pause,
    },
    resetGame,
  ]);
}

export default usePong;