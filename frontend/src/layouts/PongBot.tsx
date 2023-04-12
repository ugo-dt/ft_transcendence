import { useEffect, useState } from "react";
import { useKeyState } from "use-key-state";
import { IGameState, IPlayer } from "../types";
import { CANVAS_DEFAULT_HEIGHT, CANVAS_DEFAULT_WIDTH, DEBUG_MODE, OFFLINE_MODE, TARGET_FPS } from "../constants";
import usePong from "../hooks/usePong";
import Canvas from "../components/Canvas";

import "./style/Pong.css"

interface DebugProps {
  gameState: IGameState,
  resetGame: () => void,
  pause: boolean,
  setPause: (pause: boolean) => void,
  setBallPause: (pause: boolean) => void,
  setLeftIsCom: (isCom: boolean) => void,
  setRightIsCom: (isCom: boolean) => void,
}

const PongDebug = ({
  gameState,
  resetGame,
  setBallPause,
  pause,
  setPause,
  setLeftIsCom,
  setRightIsCom,
}: DebugProps) => {
  const [__info_, showInfo] = useState(true);
  const { r, h, b } = useKeyState({ r: 'r', h: 'h', b: 'b' });

  useEffect(() => {
    if (r.down) { resetGame(); }
    if (h.down) { showInfo(!__info_); }
    if (b.down) { setBallPause(!gameState.ball.pause); }
  }, [__info_, gameState, r, h, b]);

  return (
    <div className="debug">
      <button style={{ position: 'absolute', top: '10%', left: '2%' }} onClick={() => showInfo(!__info_)}>{((__info_ && "Hide debug") || "Show debug") + ' (h)'}</button>
      {
        __info_ &&
        <div className="debug-area" style={{ position: 'absolute', top: '13%', left: '2%' }}>
          <button onClick={resetGame}>Reset game (r)</button><br />
          <button onClick={() => setPause(!pause)}>{((pause && "Resume game") || "Pause game") + ' (space)'}</button>
          <div className="debug-info" style={{width: '150px'}}>
            <div className="debug-info-cell">
              <h4>Ball</h4>
              <h5>pos x: {gameState.ball.x.toFixed(2)}</h5>
              <h5>pos y: {gameState.ball.y.toFixed(2)}</h5>
              <h5>speed: {gameState.ball.speed.toFixed(2)}</h5>
              <h5>velocity x: {gameState.ball.velocityX.toFixed(2)}</h5>
              <h5>velocity y: {gameState.ball.velocityY.toFixed(2)}</h5>
              <h5>active: {gameState.ball.active ? 'true' : 'false'}</h5>
              <button onClick={() => setBallPause(!gameState.ball.pause)}>
                {((gameState.ball.pause && "Resume ball") || "Pause ball") + " (b)"}
              </button>
            </div>

            <div className="debug-info-cell">
              <h4>{gameState.leftPlayer.name + ((gameState.leftPaddle.isCom && " (COM)") || " (Human)")}</h4>
              <button onClick={() => setRightIsCom(!gameState.leftPaddle.isCom)}>
                {((gameState.leftPaddle.isCom && "Set as Human") || "Set as COM")}
              </button>
              <h5>x: {gameState.leftPaddle.x.toFixed(2)}</h5>
              <h5>y: {gameState.rightPaddle.y.toFixed(2)}</h5>
              <h5>velocity y: {gameState.leftPaddle!.velocityY}</h5>
              <h5>id: {gameState.leftPlayer.id}</h5>
              <h5>score: {gameState.leftPlayer.score}</h5>
              <h5>color: {gameState.leftPlayer.backgroundColor}</h5>
            </div>

            <div className="debug-info-cell">
              <h4>{gameState.rightPlayer.name + ((gameState.rightPaddle.isCom && " (COM)") || " (Human)")}</h4>
              <button onClick={() => setRightIsCom(!gameState.rightPaddle.isCom)}>
                {((gameState.rightPaddle.isCom && "Set as Human") || "Set as COM")}
              </button>
              <h5>x: {gameState.rightPaddle!.x.toFixed(2)}</h5>
              <h5>y: {gameState.rightPaddle!.y.toFixed(2)}</h5>
              <h5>velocity y: {gameState.rightPaddle.velocityY}</h5>
              <h5>id: {gameState.rightPlayer.id}</h5>
              <h5>score: {gameState.rightPlayer.score}</h5>
              <h5>color: {gameState.rightPlayer.backgroundColor}</h5>
            </div>
          </div> {/* className="debugArea" */}
        </div> /* className="debug" */
      }
    </div>
  );
}

interface PongBotProps {
  canvasWidth?: number,
  canvasHeight?: number,
  mode: number,
  leftPlayerData: IPlayer,
  rightPlayerData: IPlayer,
}

function PongBot({
  canvasWidth = CANVAS_DEFAULT_WIDTH,
  canvasHeight = CANVAS_DEFAULT_HEIGHT,
  leftPlayerData,
  rightPlayerData,
  mode,
}: PongBotProps) {
  const [canvas, setCanvas]: [Canvas, any] = useState(new Canvas(canvasWidth, canvasHeight, null));
  const [gameState, updateGame, resetGame, pause, setPause, setBallPause, setLeftIsCom, setRightIsCom] = usePong(canvas, mode, leftPlayerData, rightPlayerData);
  const { space } = useKeyState({ space: 'space' });

  useEffect(() => {
    const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.context = canvasElement.getContext("2d") as CanvasRenderingContext2D;
  }, []);

  useEffect(() => {
    if (mode & (OFFLINE_MODE | DEBUG_MODE)) {
      if (space.down) {
        setPause(!pause);
      }
    }
    const interval = setInterval(updateGame, 1000 / TARGET_FPS);

    return () => {clearInterval(interval);}
  }, [space, gameState, updateGame]);

  return (
    <>
      { /* Debug mode */
        !!(mode & DEBUG_MODE) &&
        <PongDebug
          gameState={gameState}
          resetGame={resetGame}
          pause={pause}
          setPause={setPause}
          setBallPause={setBallPause}
          setLeftIsCom={setLeftIsCom}
          setRightIsCom={setRightIsCom}
        />
      }

      <div className="gameArea"
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
          pause &&
          <div className="pause-text" style={{ textAlign: 'center' }}>
            <h3>Paused</h3>
            <p>Press Space to resume</p>
          </div>
        }
      </div> {/* className="gameArea" */}
    </>
  );
}

export default PongBot;