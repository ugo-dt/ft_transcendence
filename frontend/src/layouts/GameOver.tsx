import { useNavigate } from "react-router";
import { IUser } from "../types";
import "./style/GameOver.css"

interface GameOverProps {
  left: IUser,
  right: IUser,
  winnerIsLeft: boolean,
  leftScore: number,
  rightScore: number,
}

function GameOver({ left, right, winnerIsLeft, leftScore, rightScore }: GameOverProps) {
  const navigate = useNavigate();

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
    </div>
  );
}

export default GameOver;