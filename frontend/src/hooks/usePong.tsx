// customization ideas:
// 
// ball slowly gets smaller over time
// different map color (maybe one for each player? maybe player gets to choose their color?)

import { useState } from "react";
import { CANVAS_DEFAULT_BACKGROUND_COLOR, CANVAS_DEFAULT_FOREGROUND_COLOR, CANVAS_DEFAULT_NET_COLOR, CANVAS_DEFAULT_NET_GAP, DEMO_MODE, ONLINE_MODE, TARGET_FPS } from "../constants";
import { IGameState, IPlayer } from "../types";
import useBall from "../hooks/useBall";
import usePlayer from "./usePlayer";
import Canvas from "../components/Canvas";

function usePong(
  canvas: Canvas,
  mode: number,
  leftPlayerData: IPlayer,
  rightPlayerData: IPlayer,
): [IGameState, any, any, any, any, any, any] {
  function __demoMode_(): boolean { return !!(mode & DEMO_MODE); }
  const [pause, setPause] = useState(!__demoMode_());
  const [ball, setBallPosition, moveBall, drawBall, checkBallCollisions, resetBall, setBallActive, setBallPause, updateBallSize] = useBall(canvas, false);
  const [leftPlayer, moveLeftPaddle, drawLeftPaddle, setLeftScore, updateLeftSize] = usePlayer(canvas, leftPlayerData);
  const [rightPlayer, moveRightPaddle, drawRightPaddle, setRightScore, setRightIsCom, updateRightSize] = usePlayer(canvas, rightPlayerData);

  function updateCanvas(width: number, height: number) {
    canvas.width = width
    canvas.height = height;
  }

  function _drawBackground() {
    canvas.clear();
    canvas.drawRect(0, 0, canvas.width / 2, canvas.height, leftPlayer.backgroundColor);
    canvas.drawRect(canvas.width / 2, 0, canvas.width, canvas.height, rightPlayer.backgroundColor);

    for (let i = 7.5; i < canvas.height; i += CANVAS_DEFAULT_NET_GAP) {
      canvas.drawRect(canvas.width / 2 - 5, i, 10, 15, CANVAS_DEFAULT_NET_COLOR);
    }
  }

  function _drawScore() {
    canvas.drawText(leftPlayer.score.toString(), canvas.width / 4, canvas.height / 5, CANVAS_DEFAULT_FOREGROUND_COLOR);
    canvas.drawText(rightPlayer.score.toString(), 3 * canvas.width / 4, canvas.height / 5, CANVAS_DEFAULT_FOREGROUND_COLOR);
  }

  function _render() {
    _drawBackground();
    if (!__demoMode_()) {
      _drawScore();
    }
    drawLeftPaddle(canvas);
    drawRightPaddle(canvas);
    drawBall(canvas);
  }

  function _scorePoint() {
    if (ball.x > canvas.width) {
      setLeftScore(leftPlayer.score + 1);
    }
    else {
      setRightScore(rightPlayer.score + 1);
    }
  }

  function _updatePlayers() {
    // This runs either humanMovePaddle or computerMovePaddle.
    // Parameters are ignored when human.
    moveLeftPaddle(ball.velocityX, ball.x, ball.y, __demoMode_());
    moveRightPaddle(ball.velocityX, ball.x, ball.y, __demoMode_());
  }

  function _updateBall() {
    moveBall();
    checkBallCollisions(leftPlayer.paddle, rightPlayer.paddle);
    if (ball.active && (ball.x > canvas.width || ball.x < 0)) {
      setBallActive(false);
      if (!__demoMode_()) {
        _scorePoint();
      }
      setTimeout(() => {
        resetBall();
        setBallActive(true);
      }, 450);
    }
  }

  function update(gameState: IGameState) {
    if (mode & ONLINE_MODE) {
      setBallPosition(gameState.ball.x, gameState.ball.y);
    }
    else {

      if (!pause) {
        _updatePlayers();
        _updateBall();
      }
    }
    _render();
  }
  
  function resetGame() {
    resetBall();
    setLeftScore(0);
    setRightScore(0);
  }

  function updateSize() {
    updateBallSize();
    updateLeftSize();
    updateRightSize();
  }

  return ([
    {
      ball: ball,
      leftPlayer: leftPlayer,
      rightPlayer: rightPlayer,
      pause: pause,
    },
    update,
    updateSize,
    resetGame,
    setPause,
    setBallPause,
    setRightIsCom,
  ]);
}

export default usePong;