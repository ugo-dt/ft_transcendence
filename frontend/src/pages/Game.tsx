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

import { useParams } from "react-router";
import usePong from "../hooks/usePong";
import { IPlayer } from "../types";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants";
import { useEffect } from "react";

export interface GameProps {
  player1: IPlayer,
  player2: IPlayer,
}

function Game({ player1, player2 }: GameProps) {
  const params = useParams();
  const [gameState,
    setLeftPaddleMovingUp, setLeftPaddleMovingDown,
    setRightPaddleMovingUp, setRightPaddleMovingDown,
    setPause, resetGame] = usePong();

  const handleKeyDown = (event: any) => {
    if (event.key === ' ') { setPause(!(gameState.pause)); }

    // Left paddle
    if (event.key === "z" || event.key === "Z" || event.key === "w" || event.key === "W") { setLeftPaddleMovingUp(true); }
    if (event.key === "s" || event.key === "S") { setLeftPaddleMovingDown(true); }

    // Right paddle
    if (event.key === "ArrowUp") { setRightPaddleMovingUp(true); }
    if (event.key === "ArrowDown") { setRightPaddleMovingDown(true); }
  };

  const handleKeyUp = (event: any) => {
    // Left paddle
    if (event.key === "z" || event.key === "Z" || event.key === "w" || event.key === "W") { setLeftPaddleMovingUp(false); }
    if (event.key === "s" || event.key === "S") { setLeftPaddleMovingDown(false); }

    // Right paddle
    if (event.key === "ArrowUp") { setRightPaddleMovingUp(false); }
    if (event.key === "ArrowDown") { setRightPaddleMovingDown(false); }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp])

  return (
    <>
      <div className="Game"
        style={{
          userSelect: 'none',
          border: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h3>{player1.name} vs {player2.name}</h3>
        <canvas id="canvas"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{
            // border: '10px solid white',
            overflow: 'hidden',
            padding: '10px',
          }}
        >
          Your browser does not support the HTML 5 Canvas.
        </canvas>
        <button style={{ padding: '10px' }} onClick={resetGame}>Reset</button>
        {gameState.pause && <h2>paused</h2>}
      </div>
    </>
  );
}

export default Game;