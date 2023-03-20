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
  const [gameState, handleKeyDown, handleKeyUp, handleClick, resetGame] = usePong();
  
  useEffect(() => {
    console.log(params);
    
  }, []);

  return (
    <>
      <div className="Game"
        style={{
          userSelect: 'none',
          border: 0,
          borderBlock: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <canvas id="canvas"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onClick={handleClick}
          style={{
            overflow: 'hidden',
            padding: '10px',
          }}
          >
          Your browser does not support the HTML 5 Canvas. 
        </canvas>
      <button style={{padding: '10px'}} onClick={resetGame}>Reset</button>
      {gameState.pause && <h2>paused</h2>}
      </div>
    </>
  );
}

export default Game;