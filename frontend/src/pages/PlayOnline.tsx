import "./style/PlayOnline.css"
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Context } from "../context";

function PlayOnline() {
  const { serverUrl, socketRef } = useContext(Context);
  const socket = socketRef.current;
  const inQueueRef = useRef(false);
  const [inQueue, setInQueue] = useState(false);
  
  const navigate = useNavigate();

  function handleClick() {
    if (!socket.connected) {
      return ;
    }
    if (!inQueueRef.current) {
      socket.emit('join-queue');
      inQueueRef.current = true;
      setInQueue(true);
      console.log('Joined queue.');
    }
    else {
      socket.emit('leave-queue');
      inQueueRef.current = false;
      setInQueue(false);
      console.log('Left queue.');
    }
  }

  function onStartGame(data: any) {
    if (data.roomId) {
      console.log("Game started", data);
      const gameUrl = "/game/" + data.roomId;
      navigate(gameUrl, { state: { roomId: data.roomId } });
    }
  }

  function onEndGame() {
    console.log("game ends");
  }

  useEffect(() => {
    socket.on('startGame', (data: any) => { onStartGame(data) });
    socket.on('endGame', onEndGame);

    return () => {
      socket.off('startGame', (data: any) => { onStartGame(data) });
      socket.off('endGame', onEndGame);
    };
  }, []);

  return (
    <div className="PlayOnline">
      <div className="play-online-content" style={{ display: 'flex', flexDirection: 'column', userSelect: 'none' }}>
        <h1>Play online</h1>
        <button
          id="find-match-btn"
          onClick={handleClick}
          style={{
            padding: '10px',
            margin: '10px'
          }}
        >
          <h3>
            {
              (inQueue && 'Cancel') || 'Find match'
            }
          </h3>
        </button>
      </div>
    </div>
  );
}

export default PlayOnline;
