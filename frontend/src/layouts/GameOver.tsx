import { useState } from "react";
import { IPlayer } from "../types";
import "./style/GameOver.css"

interface GameOverProps {
  leftPlayer: IPlayer,
  rightPlayer: IPlayer,
}

function GameOver({ leftPlayer, rightPlayer }: GameOverProps) {
  const [winnerIsLeft] = useState(leftPlayer.score > rightPlayer.score);

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
                src="/assets/images/noavatar.png"
                width={80}
                height={80}
                alt={leftPlayer.name}
                onClick={() => window.open('/profile/' + leftPlayer.id, '_blank')}
              />
            </div>
            <div className="game-over-users-username">
              {
                leftPlayer.name
              }
            </div>
          </div>
          <div className="game-over-results-score">
            {
              leftPlayer.score + '-' +
              rightPlayer.score
            }
          </div>
          <div className="game-over-users game-over-users-right">
            <div className={`game-over-users-avatar ${winnerIsLeft ? '' : 'game-over-users-winner'}`}>
              <img id="avatar-component"
                src="/assets/images/noavatar.png"
                width={80}
                height={80}
                alt={rightPlayer.name}
                role="button"
                onClick={() => window.open('/profile/' + rightPlayer.id, '_blank')}
              />
            </div>
            <div className="game-over-users-username">
              {
                rightPlayer.name
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GameOver;