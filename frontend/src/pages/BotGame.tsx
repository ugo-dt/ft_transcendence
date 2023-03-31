import { Navigate, useLocation } from "react-router";
import { CANVAS_DEFAULT_BACKGROUND_COLOR, DEBUG_MODE, OFFLINE_MODE } from "../constants";
import Pong from "../layouts/Pong";
import { IPlayer } from "../types";

function BotGame() {
  const leftPlayerData: IPlayer = {
    id: 0,
    name: "",
    avatar: null,
    isLeft: true,
    isCom: false,
    score: 0,
    keyboardState: null,
    backgroundColor: CANVAS_DEFAULT_BACKGROUND_COLOR,
  };
  const rightPlayerData: IPlayer = {
    id: 1,
    name: "Computer",
    avatar: null,
    isLeft: false,
    isCom: true,
    score: 0,
    keyboardState: null,
    backgroundColor: CANVAS_DEFAULT_BACKGROUND_COLOR,
  };

  return (
    <>
      <div className="Game" style={{
        display: 'flex',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}>
        <Pong
          leftPlayerData={leftPlayerData}
          rightPlayerData={rightPlayerData}
          mode={OFFLINE_MODE | DEBUG_MODE}
        />
      </div>
    </>
  );
}

export default BotGame;