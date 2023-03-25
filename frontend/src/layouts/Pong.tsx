import usePong from "../hooks/usePong";
import { IPlayer } from "../types";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants";
import { useEffect, useState } from "react";
import { useKeyState } from "use-key-state";
import { blueGrey } from "@mui/material/colors";

interface PongProps {
  leftPlayerData: IPlayer,
  rightPlayerData: IPlayer,
  debug: boolean,
}

const Pong = ({ leftPlayerData, rightPlayerData, debug }: PongProps) => {
  const [__info_, __setDebug_] = useState(debug);
  const [gameState, resetGame, setPause, setBallPause, setRightIsCom] = usePong("canvas", leftPlayerData, rightPlayerData, debug);
  const {space, r, h, b} = useKeyState({space: 'space', r: 'r', h: 'h', b: 'b'});

  useEffect(() => {
    if (space.down) {setPause(!gameState.pause);}
    if (r.down) {resetGame();}
    if (h.down) {__setDebug_(!__info_);}
    if (b.down) {setBallPause(!gameState.ball.pause);}
  }, [__info_, gameState, space, r, h, b]);

  return (
    <>
      <button style={{ position: 'absolute', top: '10%', left: '2%' }} onClick={() => __setDebug_(!__info_)}>{((__info_ && "Hide debug") || "Show debug") + ' (h)'}</button>
      {
        __info_ &&
        <div className="debug" style={{ position: 'absolute', top: '13%', left: '2%' }}>
          <button onClick={resetGame}>Reset game (r)</button><br/>
          <button onClick={() => setPause(!gameState.pause)}>{((gameState.pause && "Resume game") || "Pause game") + ' (space)'}</button>
          <div className="debugInfo"
            style={{
              width: '150px',
              outline: '1px solid black',
            }}
          >
            <div style={{ padding: '5px', borderBottom: '1px solid black' }}>
              <h4>Ball</h4>
              <h5>speed: {gameState.ball.speed.toFixed(2)}</h5>
              <h5>active: {gameState.ball.active ? 'true' : 'false'}</h5>
              <h5>velocity x: {gameState.ball.velocity.x.toFixed(2)}</h5>
              <h5>velocity y: {gameState.ball.velocity.y.toFixed(2)}</h5>
              <button onClick={() => setBallPause(!gameState.ball.pause)}>
                {((gameState.ball.pause && "Resume ball") || "Pause ball") + " (b)"}
              </button>
            </div>

            <div style={{ padding: '5px', borderBottom: '1px solid black' }}>
              <h4>{gameState.leftPlayer.name}</h4>
              <h5>y: {gameState.leftPlayer.paddle!.pos.y.toFixed(2)}</h5>
              <h5>id: {gameState.leftPlayer.id}</h5>
              <h5>score: {gameState.leftPlayer.score}</h5>
              <h5>color: {gameState.leftPlayer.backgroundColor}</h5>
            </div>

            <div style={{ padding: '5px', borderBottom: '0px solid black' }}>
              <h4>{gameState.rightPlayer.name}</h4>
              <h5>y: {gameState.rightPlayer.paddle!.pos.y.toFixed(2)}</h5>
              <h5>id: {gameState.rightPlayer.id}</h5>
              <h5>score: {gameState.rightPlayer.score}</h5>
              <h5>color: {gameState.rightPlayer.backgroundColor}</h5>
              <button onClick={() => setRightIsCom(!gameState.rightPlayer.isCom)}>
                {((gameState.rightPlayer.isCom && "Set Human") || "Set COM")}
              </button>
            </div>
          </div> {/* className="debugArea" */}
        </div> /* className="debug" */
      }

      <div className="gameArea" style={{
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h3>{gameState.leftPlayer.name} vs {gameState.rightPlayer.name}</h3>
        <canvas id="canvas"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{
            border: `10px solid #cfd8dc`,
            outline: '1px solid black',
            overflow: 'hidden',
            // padding: '10px',
          }}
        >
          Your browser does not support the HTML 5 Canvas.
        </canvas>
      </div>
    </>
  );
}

export default Pong;