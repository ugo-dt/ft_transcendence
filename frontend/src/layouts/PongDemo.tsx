import { DEBUG_MODE, DEMO_MODE } from "../constants";
import { IPlayer } from "../types";
import PongBot from "./PongBot";

const PongDemo = () => {
  const leftPlayerDemo: IPlayer = {
    id: 0,
    name: "",
    avatar: null,
    isLeft: true,
    isCom: true,
    score: 0,
    backgroundColor: "black",
  };
  const rightPlayerDemo: IPlayer = {
    id: 1,
    name: "Computer",
    avatar: null,
    isLeft: false,
    isCom: true,
    score: 0,
    backgroundColor: "black",
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