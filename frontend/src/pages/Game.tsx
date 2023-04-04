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

import { Navigate, useLocation, useNavigate } from "react-router";
import { useContext, useEffect, useRef, useState } from "react";
import { useKeyState } from "use-key-state";
import { Context } from "../context";
import { CANVAS_DEFAULT_NET_COLOR, CANVAS_DEFAULT_NET_GAP, TARGET_FPS } from "../constants";
import { IGameState, IPaddle } from "../types";
import Canvas from "../components/Canvas";

function Game() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {    
    return <Navigate to={"/play/online"} />
  }
  else {
    const socket = useContext(Context).socketRef.current;
    const [canvas] = useState(new Canvas(650, 480, null));
    const gameState = useRef((null as unknown) as IGameState);
    const keyboardState = useKeyState().keyStateQuery;

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
      _drawPaddle(gameState.leftPaddle);
      _drawPaddle(gameState.rightPaddle);
    }

    function _update() {
      _updateKeyState();
      try {
        _render(gameState.current);
      }
      catch {
        onEndGame();
      }
    }

    function onUpdate(data: any) {
      gameState.current = data.gameState;
    }

    function onEndGame() {
      navigate("/home");
    }

    useEffect(() => {
      canvas.context = (document.getElementById("canvas") as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
      socket.on('update', onUpdate);
      socket.on('endGame', onEndGame);
      const interval = setInterval(_update, 1000 / TARGET_FPS);

      return () => {        
        clearInterval(interval);
        socket.off('update', onUpdate);
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