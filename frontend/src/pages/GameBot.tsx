import { CANVAS_DEFAULT_BACKGROUND_COLOR, OFFLINE_MODE } from "../constants";
import PongBot from "../layouts/PongBot";
import { IPlayer } from "../types";

function GameBot() {
  const leftPlayerData: IPlayer = {
    id: 0,
    name: "",
    avatar: null,
    isLeft: true,
    isCom: false,
    score: 0,
    backgroundColor: CANVAS_DEFAULT_BACKGROUND_COLOR,
  };
  const rightPlayerData: IPlayer = {
    id: 1,
    name: "Computer",
    avatar: null,
    isLeft: false,
    isCom: true,
    score: 0,
    backgroundColor: CANVAS_DEFAULT_BACKGROUND_COLOR,
  };

  return (
    <>
      <div className="Game" style={{
        display: 'flex',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}>
        <PongBot
          leftPlayerData={leftPlayerData}
          rightPlayerData={rightPlayerData}
          mode={OFFLINE_MODE}
        />
      </div>
    </>
  );
}

export default GameBot;