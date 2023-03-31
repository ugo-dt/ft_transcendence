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

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Pong from "../layouts/Pong";
import { CANVAS_DEFAULT_BACKGROUND_COLOR, CANVAS_DEFAULT_NET_COLOR, CANVAS_DEFAULT_NET_GAP, DEBUG_MODE, ONLINE_MODE } from "../constants";
import { IGameState, IPaddle, IPlayer } from "../types";
import Canvas from "../components/Canvas";
import { useKeyState } from "use-key-state";

function Game() {
  const socket = useRef(io("http://localhost:3000/pong", {
    autoConnect: false,
    query: {
      'role': 'player',
    }
  })).current; // If the value wrapped in useRef actually never changes, we can dereference right in the declaration
  const inQueue = useRef(false);
  const isConnected = useRef(socket.connected);
  const [inQueueState, setInQueueState] = useState(inQueue.current);
  const [isConnectedState, setIsConnectedState] = useState(isConnected.current);
  const [inGame, setInGame] = useState(false);

  const [canvas] = useState(new Canvas(650, 480, null));
  const keyboardState = useKeyState().keyStateQuery;

  function _joinQueue() {
    if (!isConnected.current || inQueue.current) {
      return;
    }
    socket.emit('queue', {
      name: 'name',
      action: 'join',
    });
    inQueue.current = true;
    setInQueueState(true);
    console.log("Joined queue.");
  }

  function _leaveQueue() {
    if (!isConnected.current || !inQueue.current) {
      return;
    }
    socket.emit('queue', {
      action: 'leave',
    });
    inQueue.current = false;
    setInQueueState(false);
    console.log("Left queue.");
  }

  function _leaveGame() {
    socket.emit('game', {action: 'leave'});
    setInGame(false);
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

  function _loadGame() {
    canvas.context = (document.getElementById("canvas") as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
    socket.on('update', (...args) => _render(args[0]));
  }

  function _unloadGame() {
    canvas.context = null;
    socket.off('update', (...args) => _render(args[0]));
  }

  function handleOnClick() {
    if (!inQueue.current) {
      _joinQueue();
    }
    else {
      _leaveQueue();
    }
  }

  function onConnect() {
    console.log("Connected.");
    isConnected.current = true;
    setIsConnectedState(true);
  }

  function onDisconnect() {
    console.log("Disconnected.");
    isConnected.current = false;
    setIsConnectedState(false);
  }

  function onStart(args: any) {
    console.log("Start game.");

    _leaveQueue();
    setInGame(true); // this will call _loadGame with useEffect().
  }

  function onEnd() {
    console.log("End game.");
    setInGame(false); // this will call _unloadGame with useEffect().
  }

  useEffect(() => {
    if (inGame) {
      _loadGame();
    }
    else {
      _unloadGame();
    }
  }, [inGame])

  useEffect(() => {
    socket.connect();
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('start', (...args) => onStart(args));
    socket.on('end', onEnd);

    return () => {
      if (inGame) {
        _leaveGame();
      }
      if (inQueue) {
        _leaveQueue();
      }
      socket.disconnect();
      socket.removeAllListeners();
    }
  }, []);

  return (
    <>
      {
        !inGame &&
        (
          <div>
            <h2>{(isConnectedState && 'Socket connected.') || 'Socket disconnected.'}</h2>
            <h4>{(inQueueState && 'In queue') || 'Not in queue'}</h4>
            <button onClick={handleOnClick}>{(inQueueState && 'Cancel') || 'Find game'}</button>
          </div>
        ) ||
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
      }
    </>
  );
}

export default Game;