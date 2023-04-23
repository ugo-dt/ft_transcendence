import "./style/PlayOnline.css"
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Context } from "../context";

function PlayOnline() {
  document.title = "ft_transcendence - Game";
  const socket = useContext(Context).pongSocket.current;
  const navigate = useNavigate();
  const inQueueRef = useRef(false);
  const [inQueue, setInQueue] = useState(false);
  const inGame = useRef(false);
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0 });
  const intervalRef = useRef<number>();

  const { minutes, seconds } = timer;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  function handleClick() {
    if (!socket) {
      return ;
    }
    if (!socket.connected) {
      return ;
    }
    if (!inQueueRef.current) {      
      socket.emit('join-queue');
      inQueueRef.current = true;
      setInQueue(true);
      intervalRef.current = window.setInterval(() => {
        setTimer((prevTimer) => {
          const seconds = prevTimer.seconds + 1;
          const minutes = prevTimer.minutes + Math.floor(seconds / 60);
          return { minutes, seconds: seconds % 60 };
        });
      }, 1000);
    }
    else {
      socket.emit('leave-queue');
      inQueueRef.current = false;
      setInQueue(false);
      window.clearInterval(intervalRef.current);
      setTimer({minutes: 0, seconds: 0});
    }
  }

  function onStartGame(data: any) {
    if (inGame.current) {
      return ;
    }
    inGame.current = true;
    const gameUrl = "/game/" + data.roomId;
    navigate(gameUrl, { state: { roomId: data.roomId, role: 'player' } });
  }

  useEffect(() => {
    if (!socket) {
      navigate("/home");
      return ;
    }
    socket.on('startGame', (data: any) => { onStartGame(data) });

    return () => {
      socket.off('startGame', (data: any) => { onStartGame(data) });
    };
  }, []);

  return (
    <div className="PlayOnline">
      <div className="play-online-content" style={{ display: 'flex', flexDirection: 'column', userSelect: 'none' }}>
        <h1>Play online</h1>
        <button
          onClick={handleClick}
          style={{
            padding: '10px',
            margin: '10px'
          }}
        >
          <h3>
            {
              (inQueue && 'Cancel') || 'Find a match'
            }
          </h3>
        </button>
        <h4 id="timer">
          {inQueue ? formattedTime : ''}
        </h4>
      </div>
    </div>
  );
}

export default PlayOnline;
