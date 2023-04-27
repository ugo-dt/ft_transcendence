import "./style/PlayOnline.css"
import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Context, QueueContext } from "../context";

function PlayOnline() {
  document.title = "ft_transcendence - Game";
  const socket = useContext(Context).pongSocket.current;
  const { queueTimer, setQueueTimer, inQueue, setInQueue, queueInterval } = useContext(QueueContext);
  const navigate = useNavigate();
  const inGame = useRef(false);

  const { minutes, seconds } = queueTimer;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  function handleClick() {
    if (!socket || !socket.connected) {
      return ;
    }
    if (!inQueue) {      
      socket.emit('join-queue');
      setInQueue(true);
      queueInterval.current = window.setInterval(() => {
        setQueueTimer((prevTimer) => {
          const seconds = prevTimer.seconds + 1;
          const minutes = prevTimer.minutes + Math.floor(seconds / 60);
          return { minutes, seconds: seconds % 60 };
        });
      }, 1000);
    }
    else {
      setInQueue(false);
      window.clearInterval(queueInterval.current);
      queueInterval.current = undefined;
      setQueueTimer({minutes: 0, seconds: 0});
    }
  }

  function onStartGame(data: any) {
    if (inGame.current) {
      return ;
    }
    setInQueue(false);
    window.clearInterval(queueInterval.current);
    queueInterval.current = undefined;
    setQueueTimer({minutes: 0, seconds: 0});
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
        > <h3>{(inQueue && 'Cancel') || 'Find a match'}</h3>
        </button>
        <h4 id="timer">{inQueue ? formattedTime : ''}</h4>
      </div>
    </div>
  );
}

export default PlayOnline;
