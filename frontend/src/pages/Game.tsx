/**
 * Pong
 * 
 * When mounted:
 *  set default positions of paddles, ball
 *  draw the first frame
 * 
 * On start:
 *  render a new frame each time the state changes
 * 
 * On each re-render:
 *  clear canvas
 *  draw net, ball, paddles
 * 
 * State:
 *  game class
 *    Ball: (radius, pos(x, y), velocity(x, y), color)
 *    Paddles: (pos(x, y), width, height color)
 *    Player: (id, name, avatar)
 * 
 * fix paddle movements
 * check collisions with paddle
 * add score
 */

import { useContext, useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useKeyState } from "use-key-state";
import { Context } from "../context";
import { CANVAS_DEFAULT_FOREGROUND_COLOR, CANVAS_DEFAULT_NET_COLOR, CANVAS_DEFAULT_NET_GAP, TARGET_FPS } from "../constants";
import { IGameState, IPaddle, IRoom } from "../types";
import Canvas from "../components/Canvas";
import "./style/Game.css"
import GameOver from "../layouts/GameOver";

const WIN_SCORE = 1;

function Game() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {    
    return <Navigate to={"/play/online"} />
  }
  else {
    const socket = useContext(Context).socketRef.current;
    const [canvas] = useState(new Canvas(650, 480, null));
    const room: React.MutableRefObject<IRoom> = useRef<IRoom>({} as IRoom);
    const keyboardState = useKeyState().keyStateQuery;
    const gameInterval = useRef<NodeJS.Timer | undefined>(undefined);
    const [gameOver, setGameOver] = useState(false);

    function _updateKeyState() {
      if (keyboardState.pressed('w')) {
        socket.emit('upKeyPressed');
      }
      else {
        socket.emit('upKeyUnpressed');
      }
      if (keyboardState.pressed('s')) {
        socket.emit('downKeyPressed');
      }
      else {
        socket.emit('downKeyUnpressed');
      }
    }

    function _drawPaddle(paddle: IPaddle) {
      canvas.drawRect(paddle.x, paddle.y, paddle.width, paddle.height, paddle.color);
    }

    function _render(gameState: IGameState) {
      canvas.clear();
      canvas.drawRect(0, 0, canvas.width / 2, canvas.height, gameState.leftPlayer.backgroundColor);
      canvas.drawRect(canvas.width / 2, 0, canvas.width, canvas.height, gameState.rightPlayer.backgroundColor);

      canvas.drawText(gameState.leftPlayer.score.toString(), canvas.width / 4, canvas.height / 5, CANVAS_DEFAULT_FOREGROUND_COLOR);
      canvas.drawText(gameState.rightPlayer.score.toString(), 3 * canvas.width / 4, canvas.height / 5, CANVAS_DEFAULT_FOREGROUND_COLOR);

      // net
      for (let i = 7.5; i < canvas.height; i += CANVAS_DEFAULT_NET_GAP) {
        canvas.drawRect(canvas.width / 2 - 5, i, 10, 15, CANVAS_DEFAULT_NET_COLOR);
      }

      // ball
      canvas.drawCircle(gameState.ball.x, gameState.ball.y, gameState.ball.radius, gameState.ball.color);

      // paddles
      _drawPaddle(gameState.leftPaddle);
      _drawPaddle(gameState.rightPaddle);
    }

    function _update() {
      if (room.current.gameState) {
        const gameState: IGameState = room.current.gameState;

        if (gameState.gameOver) {
          onEndGame(gameState);
          return;
        }
        _updateKeyState();
        _render(gameState);
      }
      // else {
      //   navigate("/home");
      // }
    }

    function onUpdate(data: IRoom) {
      room.current = data;
    }

    function onEndGame(gameState: IGameState) {
      canvas.clear();
      canvas.drawRect(0, 0, canvas.width / 2, canvas.height, gameState.leftPlayer.backgroundColor);
      canvas.drawRect(canvas.width / 2, 0, canvas.width, canvas.height, gameState.rightPlayer.backgroundColor);
      setGameOver(true);
      clearInterval(gameInterval.current);
      gameInterval.current = undefined;
    }

    useEffect(() => {
      canvas.context = (document.getElementById("canvas") as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
      socket.on('update', onUpdate);
      socket.on('endGame', onEndGame);
      gameInterval.current = setInterval(_update, 1000 / TARGET_FPS);

      return () => {
        clearInterval(gameInterval.current);
        if (location.state.role === 'spectator') {
          socket.emit('stop-spectate', location.state.roomId);
        }
        socket.off('update', onUpdate);
        socket.off('endGame', onEndGame);
      }
    }, [])

    return (
      <div className="Game">
        <div className="game-area">
          <canvas id="canvas" width={650} height={480}>
            Your browser does not support the HTML 5 Canvas.
          </canvas>
          {
            gameOver &&
            <GameOver
              leftPlayer={room.current!.gameState.leftPlayer}
              rightPlayer={room.current!.gameState.rightPlayer}
            />
          }
        </div> {/* className="gameArea" */}
      </div>
    );
  }
}

export default Game;