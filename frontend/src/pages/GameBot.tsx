import { OFFLINE_MODE } from "../constants";
import PongBot from "../layouts/PongBot";
import { IPlayer } from "../types";

function GameBot() {
  const leftPlayerData: IPlayer = {
    isLeft: true,
    isCom: false,
    score: 0,
  };
  const rightPlayerData: IPlayer = {
    isLeft: false,
    isCom: true,
    score: 0,
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