// customization ideas:
// 
// ball slowly gets smaller over time
// ball slowly gets faster after each collision
// different map color (maybe one for each player? maybe player gets to choose their color?)

import { useEffect, useState } from "react";
import { useKeyState } from "use-key-state";
import { CANVAS_FOREGROUND_COLOR, CANVAS_HEIGHT, CANVAS_NET_COLOR, CANVAS_NET_GAP, CANVAS_WIDTH, TARGET_FPS } from "../constants";
import { IGameState, IPlayer } from "../types";
import useBall from "../hooks/useBall";
import usePlayer from "./usePlayer";
import Canvas from "../components/Canvas";

const usePong = (
  canvasElementId: string,
  leftPlayerData: IPlayer,
  rightPlayerData: IPlayer,
  debug: boolean = false,
): [IGameState, any, any, any, any] => {
  const [pause, setPause] = useState(debug);
  const [ball, moveBall, drawBall, checkBallCollisions, resetBall, setBallActive, setBallPause] = useBall(false);
  const [leftPlayer, moveLeftPaddle, drawLeftPaddle, setLeftScore] = usePlayer(leftPlayerData);
  const [rightPlayer, moveRightPaddle, drawRightPaddle, setRightScore, setRightIsCom] = usePlayer(rightPlayerData);
  const [canvas] = useState(new Canvas(null));

  function _drawBackground() {
    canvas.clear();
    canvas.drawRect(0, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT, leftPlayer.backgroundColor);
    canvas.drawRect(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, CANVAS_HEIGHT, rightPlayer.backgroundColor);

    for (let i = 7.5; i < CANVAS_HEIGHT; i += CANVAS_NET_GAP) {
      canvas.drawRect(CANVAS_WIDTH / 2 - 5, i, 10, 15, CANVAS_NET_COLOR);
    }
  }

  function _drawScore() {
    canvas.drawText(leftPlayer.score.toString(), CANVAS_WIDTH / 4, CANVAS_HEIGHT / 5, CANVAS_FOREGROUND_COLOR);
    canvas.drawText(rightPlayer.score.toString(), 3 * CANVAS_WIDTH / 4, CANVAS_HEIGHT / 5, CANVAS_FOREGROUND_COLOR);
  }

  function _render() {
    _drawBackground();
    _drawScore();
    drawLeftPaddle(canvas);
    drawRightPaddle(canvas);
    drawBall(canvas);
  }

  function _scorePoint() {
    setBallActive(false);
    if (ball.pos.x > CANVAS_WIDTH) {
      setLeftScore(leftPlayer.score + 1);
    }
    else {
      setRightScore(rightPlayer.score + 1);
    }
  }

  function _updatePlayers() {
    moveLeftPaddle(ball.velocity.x, ball.pos.y);
    moveRightPaddle(ball.velocity.x, ball.pos.y);
  }

  function _updateBall() {
    moveBall();
    if (ball.active && (ball.pos.x > CANVAS_WIDTH || ball.pos.x < 0)) {
      _scorePoint();
      setTimeout(() => {
        resetBall();
      }, 450);
    }
    checkBallCollisions(leftPlayer.paddle, rightPlayer.paddle);
  }

  function update() {
    if (!pause) {
      _updatePlayers();
      _updateBall();    
    }
    _render();
  }
  
  function resetGame() {
    resetBall();
    setLeftScore(0);
    setRightScore(0);
  }

  useEffect(() => {
    canvas.context = (document.getElementById(canvasElementId) as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
    _render();
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
    setPause,
    setBallPause,
    setRightIsCom,
  ]);
}

export default usePong;