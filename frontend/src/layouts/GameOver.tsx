import { useNavigate } from "react-router";
import { IUser } from "../types";
import { useContext, useEffect, useState } from "react";
import { Context, UserContext } from "../context";
import "./style/GameOver.css"
import GameInvite from "./GameInvite";

interface GameOverProps {
  left: IUser,
  right: IUser,
  winnerIsLeft: boolean,
  leftScore: number,
  rightScore: number,
  spectator: boolean
}

function GameOver({ left, right, winnerIsLeft, leftScore, rightScore, spectator }: GameOverProps) {
  const navigate = useNavigate();
  const socket = useContext(Context).pongSocket;
  const user = useContext(UserContext).user;
  const [isOpen, setIsOpen] = useState(false);

  function onClose() {
    setIsOpen(false);
  }

  function onClickRematch() {
    if (!socket.current) {
      return;
    }
    setIsOpen(true);
  }

  function onClickQueueAgain() {
    navigate("/play/online");
  }

  function onClickHome() {
    navigate("/home");
  }

  useEffect(() => {
    if (!socket.current) {
      return;
    }
  }, []);

  return (
    <div className="game-over-container">
      <section className="game-over">
        <div className="game-over-header">
          Game Over
        </div>
        <div className="game-over-results-container">
          <div className="game-over-users game-over-users-left">
            <div className={`game-over-users-avatar ${winnerIsLeft ? 'game-over-users-winner' : ''}`}>
              <img id="avatar-component"
                src={left.avatar}
                width={80}
                height={80}
                alt={left.username}
                role="button"
                title="See profile"
                onClick={() => navigate('/profile/' + left.username.toLowerCase())}
              />
            </div>
            <div className="game-over-users-username">{left.username}</div>
          </div>
          <div className="game-over-results-score">{leftScore + '-' + rightScore}</div>
          <div className="game-over-users game-over-users-right">
            <div className={`game-over-users-avatar ${winnerIsLeft ? '' : 'game-over-users-winner'}`}>
              <img id="avatar-component"
                src={right.avatar}
                width={80}
                height={80}
                alt={right.username}
                role="button"
                title="See profile"
                onClick={() => navigate('/profile/' + right.username.toLowerCase())}
              />
            </div>
            <div className="game-over-users-username">{right.username}</div>
          </div>
        </div>
      </section>
      <section className="game-over-buttons-container">
        {
          !spectator ?
          <div className="game-over-buttons">
            <button id="game-over-btn" onClick={onClickRematch}>Rematch</button>
            <button id="game-over-btn" onClick={onClickQueueAgain}>Queue again</button>
          </div>
          : <button id="game-over-btn" onClick={onClickHome}>Home</button>
        }
      </section>
      {
        user && isOpen &&
        <GameInvite title="Rematch" opponentId={user.id === left.id ? right.id : left.id} isRematch={true} onClose={onClose} />
      }
    </div>
  );
}

export default GameOver;