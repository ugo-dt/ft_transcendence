import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useKeyState } from "use-key-state";
import { Context } from "../context";
import { IUser, IGameState, IPaddle, IGameRoom } from "../types";
import { CANVAS_DEFAULT_FOREGROUND_COLOR, CANVAS_DEFAULT_NET_COLOR, CANVAS_DEFAULT_NET_GAP, TARGET_FPS } from "../constants";
import GameOver from "./GameOver";
import Canvas from "../components/Canvas";
import { io } from "socket.io-client";
import "./style/Pong.css"

function PlayerInfo({ player, isLeft }: { player: IUser, isLeft: boolean }) {
  const navigate = useNavigate();

  return (
    <div className={`game-player-info ${isLeft ? 'game-player-info-left' : 'game-player-info-right'}`}>
      <img id="game-player-info-avatar"
        src={player.avatar}
        width={40}
        height={40}
        alt={player.username}
        onClick={() => navigate('/profile/' + player.username.toLowerCase())}
        title='See profile'
      />
      <h4 id="game-player-info-username">{player.username}</h4>
    </div>
  );
}

interface PongProps {
  role: 'player' | 'spectator',
  roomId: number,
}

function Pong({ role, roomId }: PongProps) {
  const navigate = useNavigate();
  const socket = useContext(Context).pongSocket;
  const context = useContext(Context);
  const [canvas] = useState(new Canvas(650, 480, null));
  const roomRef = useRef<IGameRoom | null>(null);
  const [room, setRoom] = useState<IGameRoom | null>(null);
  const keyboardState = useKeyState().keyStateQuery;
  const gameInterval = useRef<NodeJS.Timer | undefined>(undefined);
  const [gameOver, setGameOver] = useState(false);
  const url = window.location.pathname;

  function _updateKeyState() {
    if (!socket.current || role === 'spectator') {
      return ;
    }
    if (keyboardState.pressed('w') || keyboardState.pressed('up')) {
      socket.current.emit('upKeyPressed');
    }
    else {
      socket.current.emit('upKeyUnpressed');
    }
    if (keyboardState.pressed('s') || keyboardState.pressed('down')) {
      socket.current.emit('downKeyPressed');
    }
    else {
      socket.current.emit('downKeyUnpressed');
    }
  }

  function _drawPaddle(paddle: IPaddle) {
    canvas.drawRect(paddle.x, paddle.y, paddle.width, paddle.height, paddle.color);
  }

  function _render() {
    if (!roomRef.current) {
      return ;
    }
    const gameState: IGameState = roomRef.current.gameState;

    canvas.clear();
    canvas.drawRect(0, 0, canvas.width, canvas.height, 'black');

    canvas.drawText(gameState.leftPlayer.score.toString(), canvas.width / 4, canvas.height / 5, 'white');
    canvas.drawText(gameState.rightPlayer.score.toString(), 3 * canvas.width / 4, canvas.height / 5, 'white');

    // Net
    for (let i = 7.5; i < canvas.height; i += CANVAS_DEFAULT_NET_GAP) {
      canvas.drawRect(canvas.width / 2 - 5, i, 10, 15, CANVAS_DEFAULT_NET_COLOR);
    }

    // Ball
    canvas.drawCircle(gameState.ball.x, gameState.ball.y, gameState.ball.radius, gameState.ball.color);

    // Paddles
    _drawPaddle(gameState.leftPaddle);
    _drawPaddle(gameState.rightPaddle);
  }

  function _update() {
    if (!socket.current) {
      return ;
    }
    if (roomRef.current && roomRef.current.gameState) {
      if (roomRef.current.gameState.gameOver) {
        onEndGame();
        return;
      }
      _updateKeyState();
      _render();
    }
    else {
      socket.current.emit('game-results', roomId, (data: {room: IGameRoom}) => {
        if (data.room) {
          roomRef.current = data.room;
          setRoom(roomRef.current);
          onEndGame();
        }
        else {
          navigate("/home");
        }
      });
      clearInterval(gameInterval.current);
      gameInterval.current = undefined;
    }    
  }

  function onUpdate(data: IGameRoom) {
    roomRef.current = data;
    setRoom(roomRef.current);    
  }

  function onEndGame() {
    canvas.clear();
    canvas.fill('black');
    setGameOver(true);
    clearInterval(gameInterval.current);
    gameInterval.current = undefined;
  }

  useEffect(() => {
    if (!socket.current) {
      return ;
    }
    setGameOver(false);
    canvas.context = (document.getElementById("canvas") as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
    if (role === 'spectator') {
      socket.current.emit('spectate', roomId);
    }
    socket.current.on('update', onUpdate);
    socket.current.on('endGame', onEndGame);
    gameInterval.current = setInterval(_update, 1000 / TARGET_FPS);
    return () => {
      clearInterval(gameInterval.current);
      if (socket.current) {
        if (role === 'spectator') {
          socket.current.emit('stop-spectate', roomId);
        }
        socket.current.off('update', onUpdate);
        socket.current.off('endGame', onEndGame);
      }
    }
  }, [context, url]);

  return (
    <div className="Pong">
      <div className="game-area">
        {
          gameOver &&
          <GameOver
          left={room!.left}
          right={room!.right}
          winnerIsLeft={room!.gameState.leftPlayer.score > room!.gameState.rightPlayer.score}
          leftScore={room!.gameState.leftPlayer.score}
          rightScore={room!.gameState.rightPlayer.score}
          spectator={(role === 'spectator')}
          />
        }
        {room && room.left && <PlayerInfo player={room.left} isLeft={true} />}
        <canvas id="canvas" width={650} height={480}>
          Your browser does not support the HTML 5 Canvas.
        </canvas>
        {room && room.right && <PlayerInfo player={room.right} isLeft={false} />}
      </div> {/* className="gameArea" */}
      {
        role === 'spectator' && <h2>Watching</h2>
      }
    </div>
  );
}

export default Pong;