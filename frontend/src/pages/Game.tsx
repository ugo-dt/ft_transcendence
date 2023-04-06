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
import { IGameState, IPaddle } from "../types";
import Canvas from "../components/Canvas";
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import "./style/Game.css"

interface IClientData {
  name: string,
  avatar: string | null,
}

export interface IRoomData {
  id: number,
  left: IClientData,
  right: IClientData,
  gameState: IGameState,
}

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
    const roomData: React.MutableRefObject<IRoomData> = useRef<IRoomData>({} as IRoomData);
    const keyboardState = useKeyState().keyStateQuery;
    const gameInterval = useRef<NodeJS.Timer | undefined>(undefined);
    const [gameOver, setGameOver] = useState(false);
    const [winnerIsLeft, setWinnerIsLeft] = useState(false);

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
      if (roomData.current.gameState) {
        const gameState: IGameState = roomData.current.gameState;

        if (gameState.gameOver) {
          onEndGame(gameState);
          return;
        }
        _updateKeyState();
        _render(gameState);
      }
      else {
        navigate("/home");
      }
    }

    function onUpdate(data: IRoomData) {
      roomData.current = data;
    }

    function onEndGame(gameState: IGameState) {
      setWinnerIsLeft(gameState.leftPlayer.score > gameState.rightPlayer.score)
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
            <div className="game-over-container">
              <section className="game-over">
                <div className="game-over-header">
                  Game Over
                </div>
                <div className="game-over-results-container">
                  <div className="game-over-users game-over-users-left">
                    <div className={`game-over-users-avatar ${winnerIsLeft ? 'game-over-users-winner' : ''}`}>
                      <img id="avatar-component"
                        src="/assets/noavatar.png"
                        width={80}
                        height={80}
                        alt={roomData.current.gameState.leftPlayer.name}
                        onClick={()=>window.open('/profile/' + roomData.current?.gameState.leftPlayer.id,'_blank')}
                      />
                    </div>
                    <div className="game-over-users-username">
                    {
                      roomData.current.gameState.leftPlayer.name
                    }
                    </div>
                  </div>
                  <div className="game-over-results-score">
                    {
                      roomData.current!.gameState.leftPlayer.score + '-' +
                      roomData.current!.gameState.rightPlayer.score
                    }
                  </div>
                  <div className="game-over-users game-over-users-right">
                  <div className={`game-over-users-avatar ${winnerIsLeft ? '' : 'game-over-users-winner'}`}>
                      <img id="avatar-component"
                        src="/assets/noavatar.png"
                        width={80}
                        height={80}
                        alt={roomData.current?.gameState.rightPlayer.name}
                        role="button"
                        onClick={()=>window.open('/profile/' + roomData.current?.gameState.rightPlayer.id,'_blank')}
                      />
                    </div>
                    <div className="game-over-users-username">
                    {
                      roomData.current?.gameState.rightPlayer.name
                    }
                    </div>
                  </div>
                </div>
              </section>
            </div>
          }
        </div> {/* className="gameArea" */}
      </div>
    );
  }
}

export default Game;