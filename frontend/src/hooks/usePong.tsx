// customization ideas:
// 
// ball slowly gets smaller over time
// different map color (maybe one for each player? maybe player gets to choose their color?)

import { useEffect, useState } from "react";
import { CANVAS_DEFAULT_BACKGROUND_COLOR, CANVAS_DEFAULT_FOREGROUND_COLOR, CANVAS_DEFAULT_NET_COLOR, CANVAS_DEFAULT_NET_GAP, DEBUG_MODE, DEMO_MODE, NORMAL_MODE, TARGET_FPS } from "../constants";
import { IGameState, IPlayer } from "../types";
import useBall from "../hooks/useBall";
import usePlayer from "./usePlayer";
import Canvas from "../components/Canvas";


const usePong = (
  canvas: Canvas,
  mode: string,
  leftPlayerData: IPlayer = {
    id: 0,
    name: "",
    avatar: null,
    isLeft: true,
    isCom: false,
    score: 0,
    keyboardState: null,
    backgroundColor: CANVAS_DEFAULT_BACKGROUND_COLOR,
  },
  rightPlayerData: IPlayer = {
    id: 1,
    name: "Computer",
    avatar: null,
    isLeft: false,
    isCom: true,
    score: 0,
    keyboardState: null,
    backgroundColor: CANVAS_DEFAULT_BACKGROUND_COLOR,
  },
): [IGameState, any, any, any, any] => {
  function __debugMode_(): boolean { return (mode === DEBUG_MODE); }
  function __demoMode_(): boolean { return (mode === DEMO_MODE); }
  const [pause, setPause] = useState(__debugMode_());
  const [ball, moveBall, drawBall, checkBallCollisions, resetBall, setBallActive, setBallPause] = useBall(canvas, false);
  const [leftPlayer, moveLeftPaddle, drawLeftPaddle, setLeftScore] = usePlayer(canvas, leftPlayerData);
  const [rightPlayer, moveRightPaddle, drawRightPaddle, setRightScore, setRightIsCom] = usePlayer(canvas, rightPlayerData);

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
    if (ball.pos.x > canvas.width) {
      setLeftScore(leftPlayer.score + 1);
    }
    else {
      setRightScore(rightPlayer.score + 1);
    }
  }

  function _updatePlayers() {
    moveLeftPaddle(ball.pos, __demoMode_());
    moveRightPaddle(ball.pos, __demoMode_());
  }

  function _updateBall() {
    moveBall();
    if (ball.active && (ball.pos.x > canvas.width || ball.pos.x < 0)) {
      setBallActive(false);
      if (!__demoMode_()) {
        _scorePoint();
      }
      setTimeout(() => {
        resetBall();
        setBallActive(true);
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