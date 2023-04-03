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

import { useContext, useEffect, useState } from "react";
import { CANVAS_DEFAULT_NET_COLOR, CANVAS_DEFAULT_NET_GAP, DEBUG_MODE, ONLINE_MODE, TARGET_FPS } from "../constants";
import { IGameState, IPaddle } from "../types";
import Canvas from "../components/Canvas";
import { Navigate, useLocation } from "react-router";
import { Context } from "../context";
import { useKeyState } from "use-key-state";

function Game() {
  const location = useLocation();
  console.log(location.state);

  if (!location.state) {    
    return <Navigate to={"/play/online"} />
  }
  else {
    const { gameData } = location.state;
    const { serverUrl, socketRef } = useContext(Context);
    const socket = socketRef.current;
    const [canvas] = useState(new Canvas(650, 480, null));
    const keyboardState = useKeyState().keyStateQuery;

    let gameState: any;

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

    function _drawPaddle(paddle: IPaddle | undefined) {
      if (paddle) {
        canvas.drawRect(paddle.x, paddle.y, paddle.width, paddle.height, paddle.color);
      }
    }

    function _render(gameState: IGameState) {
      canvas.clear();
      canvas.drawRect(0, 0, canvas.width / 2, canvas.height, "black");
      canvas.drawRect(canvas.width / 2, 0, canvas.width, canvas.height, "black");

      for (let i = 7.5; i < canvas.height; i += CANVAS_DEFAULT_NET_GAP) {
        canvas.drawRect(canvas.width / 2 - 5, i, 10, 15, CANVAS_DEFAULT_NET_COLOR);
      }
      canvas.drawCircle(gameState.ball.x, gameState.ball.y, gameState.ball.radius, gameState.ball.color);
      _drawPaddle(gameState.leftPlayer.paddle);
      _drawPaddle(gameState.rightPlayer.paddle);
    }

    function _update() {
      // console.log("update", gameState);
      _updateKeyState();
      _render(gameState);
    }

    useEffect(() => {
      canvas.context = (document.getElementById("canvas") as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
      socket.on('update', (data: any) => {gameState = data});
      const interval = setInterval(_update, 1000 / TARGET_FPS);

      return () => {
        socket.off('update', (data: any) => {gameState = data});
        clearInterval(interval);
      }
    }, [])

    return (
      <div className="Game" style={{ margin: '15px' }}>
        <div className="gameArea"
          style={{
            userSelect: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <canvas id="canvas" width={650} height={480}>
            Your browser does not support the HTML 5 Canvas.
          </canvas>
        </div> {/* className="gameArea" */}
      </div>
    );
  }
}

export default Game;