import usePong from "../hooks/usePong";
import { IGameState, IPlayer } from "../types";
import { CANVAS_DEFAULT_HEIGHT, CANVAS_DEFAULT_WIDTH, DEBUG_MODE } from "../constants";
import { useEffect, useState } from "react";
import { useKeyState } from "use-key-state";

import "./style/Pong.css"
import Canvas from "../components/Canvas";

interface DebugProps {
  gameState: IGameState,
  resetGame: any,
  setPause: any,
  setBallPause: any,
  setLeftIsCom: any,
  setRightIsCom: any,
}

const PongDebug = ({
  gameState,
  resetGame,
  setBallPause,
  setPause,
  setLeftIsCom,
  setRightIsCom,
}: DebugProps) => {
  const [__info_, __setDebug_] = useState(true);
  const { r, h, b } = useKeyState({ r: 'r', h: 'h', b: 'b' });

  useEffect(() => {
    if (r.down) { resetGame(); }
    if (h.down) { __setDebug_(!__info_); }
    if (b.down) { setBallPause(!gameState.ball.pause); }
  }, [__info_, gameState, r, h, b]);

  return (
    <>
      <button style={{ position: 'absolute', top: '10%', left: '2%' }} onClick={() => __setDebug_(!__info_)}>{((__info_ && "Hide debug") || "Show debug") + ' (h)'}</button>
      {
        __info_ &&
        <div className="debug" style={{ position: 'absolute', top: '13%', left: '2%' }}>
          <button onClick={resetGame}>Reset game (r)</button><br />
          <button onClick={() => setPause(!gameState.pause)}>{((gameState.pause && "Resume game") || "Pause game") + ' (space)'}</button>
          <div className="debugInfo"
            style={{
              width: '150px',
              outline: '1px solid black',
            }}
          >
            <div style={{ padding: '5px', borderBottom: '1px solid black' }}>
              <h4>Ball</h4>
              <h5>pos x: {gameState.ball.pos.x.toFixed(2)}</h5>
              <h5>pos y: {gameState.ball.pos.y.toFixed(2)}</h5>
              <h5>speed: {gameState.ball.speed.toFixed(2)}</h5>
              <h5>velocity x: {gameState.ball.velocity.x.toFixed(2)}</h5>
              <h5>velocity y: {gameState.ball.velocity.y.toFixed(2)}</h5>
              <h5>active: {gameState.ball.active ? 'true' : 'false'}</h5>
              <button onClick={() => setBallPause(!gameState.ball.pause)}>
                {((gameState.ball.pause && "Resume ball") || "Pause ball") + " (b)"}
              </button>
            </div>

            <div style={{ padding: '5px', borderBottom: '1px solid black' }}>
              <h4>{gameState.leftPlayer.name + ((gameState.leftPlayer.isCom && " (COM)") || " (Human)")}</h4>
              <h5>y: {gameState.leftPlayer.paddle!.pos.y.toFixed(2)}</h5>
              <h5>velocity y: {gameState.leftPlayer.paddle!.velocityY}</h5>
              <h5>id: {gameState.leftPlayer.id}</h5>
              <h5>score: {gameState.leftPlayer.score}</h5>
              <h5>color: {gameState.leftPlayer.backgroundColor}</h5>
            </div>

            <div style={{ padding: '5px', borderBottom: '0px solid black' }}>
              <h4>{gameState.rightPlayer.name + ((gameState.rightPlayer.isCom && " (COM)") || " (Human)")}</h4>
              <button onClick={() => setRightIsCom(!gameState.rightPlayer.isCom)}>
                {((gameState.rightPlayer.isCom && "Set as Human") || "Set as COM")}
              </button>
              <h5>y: {gameState.rightPlayer.paddle!.pos.y.toFixed(2)}</h5>
              <h5>velocity y: {gameState.rightPlayer.paddle?.velocityY}</h5>
              <h5>id: {gameState.rightPlayer.id}</h5>
              <h5>score: {gameState.rightPlayer.score}</h5>
              <h5>color: {gameState.rightPlayer.backgroundColor}</h5>
            </div>
          </div> {/* className="debugArea" */}
        </div> /* className="debug" */
      }
    </>
  );
}

interface PongProps {
  canvasWidth?: number,
  canvasHeight?: number,
  leftPlayerData: IPlayer,
  rightPlayerData: IPlayer,
  mode: string,
}

const Pong = ({
  canvasWidth = CANVAS_DEFAULT_WIDTH,
  canvasHeight = CANVAS_DEFAULT_HEIGHT,
  leftPlayerData,
  rightPlayerData,
  mode
}: PongProps) => {
  function __debugMode_(): boolean { return (mode === DEBUG_MODE); }
  const [canvas, setCanvas]: [Canvas, any] = useState(new Canvas(canvasWidth, canvasHeight, null));
  const [gameState, resetGame, setPause, setBallPause, setRightIsCom] = usePong(canvas, leftPlayerData, rightPlayerData, mode);
  const { space } = useKeyState({ space: 'space' });

  useEffect(() => {
    const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.context = canvasElement.getContext("2d") as CanvasRenderingContext2D;
  }, []);

  useEffect(() => {
    if (window.location.pathname === "/game/computer") {
      if (space.down) {
        setPause(!gameState.pause);
      }
    }
  }, [space]);

  return (
    <>
      {
        __debugMode_() && <PongDebug
          gameState={gameState}
          resetGame={resetGame}
          setPause={setPause}
          setBallPause={setBallPause}
          setLeftIsCom={() => console.log("unimplemented")}
          setRightIsCom={setRightIsCom}
        />
      }

      <div
        className="gameArea"
        style={{
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <canvas id="canvas" width={canvasWidth} height={canvasHeight}>
          Your browser does not support the HTML 5 Canvas.
        </canvas>
        {
          gameState.pause &&
          <div className="pauseText" style={{ textAlign: 'center' }}>
            <h3>Paused</h3>
            <p>Press Space to resume</p>
          </div>
        }
      </div> {/* className="gameArea" */}
    </>
  );
}

export default Pong;