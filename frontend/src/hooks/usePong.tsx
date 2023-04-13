// customization ideas:
// 
// ball slowly gets smaller over time
// different map color (maybe one for each player? maybe player gets to choose their color?)

import { Dispatch, SetStateAction, useState } from "react";
import { CANVAS_DEFAULT_FOREGROUND_COLOR, CANVAS_DEFAULT_NET_COLOR, CANVAS_DEFAULT_NET_GAP, DEMO_MODE } from "../constants";
import { IGameState, IPlayer } from "../types";
import useBall from "../hooks/useBall";
import usePlayer from "./usePlayer";
import Canvas from "../components/Canvas";
import usePaddle from "./usePaddle";

function usePong(
  canvas: Canvas,
  mode: number,
  leftPlayerData: IPlayer,
  rightPlayerData: IPlayer,
): [
    IGameState,
    (gameState: IGameState) => void,
    () => void,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    Dispatch<SetStateAction<boolean>>,
    Dispatch<SetStateAction<boolean>>,
    Dispatch<SetStateAction<boolean>>,
  ] {
  function __demoMode_(): boolean { return !!(mode & DEMO_MODE); }
  const [pause, setPause] = useState(!__demoMode_());
  const [ball, moveBall, drawBall, checkBallCollisions, resetBall, setBallPause] = useBall(canvas, false);
  const [leftPlayer, setLeftScore] = usePlayer(leftPlayerData);
  const [rightPlayer, setRightScore] = usePlayer(rightPlayerData);
  const [leftPaddle, moveLeftPaddle, setLeftIsCom, drawLeftPaddle] = usePaddle(canvas, true, leftPlayerData.isCom);
  const [rightPaddle, moveRightPaddle, setRightIsCom, drawRightPaddle] = usePaddle(canvas, false, rightPlayerData.isCom);

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
    drawLeftPaddle();
    drawRightPaddle();
    drawBall();
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
    checkBallCollisions(leftPaddle, rightPaddle);
    if (ball.x > canvas.width || ball.x < 0) {
      if (!__demoMode_()) {
        _scorePoint();
      }
      setTimeout(() => {
        resetBall();

      }, 450);
    }
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

  return ([
    {
      ball: ball,
      leftPlayer: leftPlayer,
      rightPlayer: rightPlayer,
      leftPaddle: leftPaddle,
      rightPaddle: rightPaddle,
      gameOver: false,
    },
    update,
    resetGame,
    pause,
    setPause,
    setBallPause,
    setLeftIsCom,
    setRightIsCom,
  ]);
}

export default usePong;