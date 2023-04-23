import { useContext, useEffect, useRef } from "react";
import { Context } from "../context";
import { useNavigate } from "react-router";

interface GameInviteProps {
  opponentId: number,
  onClose: () => void,
}

function GameInvite({
  opponentId, // id,
  onClose,
}: GameInviteProps) {
  const socket = useContext(Context).pongSocket;
  const inGame = useRef(false);
  const navigate = useNavigate();
  
  function onStartGame(data: any) {
    if (inGame.current) {
      return ;
    }
    inGame.current = true;
    const gameUrl = "/game/" + data.roomId;
    navigate(gameUrl, { state: { roomId: data.roomId, role: 'player' } });
  }

  function handleOnClose() {
    if (socket.current) {
      socket.current.emit('cancel-challenge');
    }
    onClose();
  }

  useEffect(() => {
    if (!socket.current) {
      onClose();
      return ;
    }
    socket.current.emit('challenge', opponentId);
    socket.current.on('startGame', (data: any) => { onStartGame(data) });
    return () => {
      if (socket.current) {
        socket.current.off('startGame', (data: any) => { onStartGame(data) });
      }
      handleOnClose();
    }
  }, []);

  return (
    <div className="GameInvite modal-overlay">
      <div className="modal">
        <div className="modal-content">
        <div className="modal-close" role="button" onClick={onClose}>&times;</div>
          <div className="modal-title">Challenge</div>
          <section>
            Waiting for opponent...
          </section>
          <button className="form-submit-button" onClick={handleOnClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameInvite;