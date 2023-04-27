import { DEMO_MODE } from "../constants";
import { IPlayer } from "../types";
import PongBot from "./PongBot";

const PongDemo = () => {
  const leftPlayerDemo: IPlayer = {
    isLeft: true,
    isCom: true,
    score: 0,
  };
  const rightPlayerDemo: IPlayer = {
    isLeft: false,
    isCom: true,
    score: 0,
  };

	return (
    <>
      <PongBot
        canvasWidth={455}
        canvasHeight={336}
        leftPlayerData={leftPlayerDemo}
        rightPlayerData={rightPlayerDemo}
        mode={DEMO_MODE}
      />
    </>
  );  
}

export default PongDemo;