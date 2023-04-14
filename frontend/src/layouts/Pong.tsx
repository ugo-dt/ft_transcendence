import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useKeyState } from "use-key-state";
import { Context } from "../context";
import { IClient, IGameState, IPaddle, IPlayer, IRoom } from "../types";
import { CANVAS_DEFAULT_FOREGROUND_COLOR, CANVAS_DEFAULT_NET_COLOR, CANVAS_DEFAULT_NET_GAP, TARGET_FPS } from "../constants";
import GameOver from "./GameOver";
import Canvas from "../components/Canvas";

function PlayerInfo({ player, isLeft }: { player: IClient, isLeft: boolean }) {
  return (
    <div className={`game-player-info ${isLeft ? 'game-player-info-left' : 'game-player-info-right'}`}>
      {
        (
          player.avatar
          && <img src={player.avatar}></img>
        )
        ||
        <img id="game-player-info-avatar"
          src="/assets/images/noavatar.png"
          width={40}
          height={40}
          alt={player.name}
          onClick={() => window.open('/profile/' + player.id, '_blank')}
          title='See profile'
        />
      }
      <h4 id="game-player-info-username">{player.name}</h4>
    </div>
  );
}

interface PongProps {
  role: 'player' | 'spectator',
  roomId: number,
}

function Pong({ role, roomId }: PongProps) {
  const navigate = useNavigate();
  const socket = useContext(Context).pongSocketRef.current;
  const [canvas] = useState(new Canvas(650, 480, null));
  const roomRef = useRef<IRoom>({} as IRoom);
  const [room, setRoom] = useState<IRoom>({} as IRoom);
  const keyboardState = useKeyState().keyStateQuery;
  const gameInterval = useRef<NodeJS.Timer | undefined>(undefined);
  const [gameOver, setGameOver] = useState(false);

  function _updateKeyState() {
    if (keyboardState.pressed('w') || keyboardState.pressed('up')) {
      socket.emit('upKeyPressed');
    }
    else {
      socket.emit('upKeyUnpressed');
    }
    if (keyboardState.pressed('s') || keyboardState.pressed('down')) {
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
    if (roomRef.current.gameState) {
      const gameState: IGameState = roomRef.current.gameState;
      
      if (gameState.gameOver) {
        onEndGame();
        return;
      }
      _updateKeyState();
      _render(gameState);
    }
    else {
      socket.emit('game-results', roomId, (data: {room: IRoom}) => {
        console.log('lol');
        console.log(data);
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

  function onUpdate(data: IRoom) {
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
    canvas.context = (document.getElementById("canvas") as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D;
    if (role === 'spectator') {
      socket.emit('spectate', roomId);
    }
    socket.on('update', onUpdate);
    socket.on('endGame', onEndGame);
    gameInterval.current = setInterval(_update, 1000 / TARGET_FPS);

    return () => {
      if (role === 'spectator') {
        socket.emit('stop-spectate', roomId);
      }
      clearInterval(gameInterval.current);
      socket.off('update', onUpdate);
      socket.off('endGame', onEndGame);
    }
  }, []);

  return (
    <div className="Pong">
      <div className="game-area">
        {
          gameOver &&
          <GameOver
          leftPlayer={room!.gameState.leftPlayer}
          rightPlayer={room!.gameState.rightPlayer}
          />
        }
        {room.left && <PlayerInfo player={room.left} isLeft={true} />}
        <canvas id="canvas" width={650} height={480}>
          Your browser does not support the HTML 5 Canvas.
        </canvas>
        {room.right && <PlayerInfo player={room.right} isLeft={false} />}
      </div> {/* className="gameArea" */}
    </div>
  );
}

export default Pong;