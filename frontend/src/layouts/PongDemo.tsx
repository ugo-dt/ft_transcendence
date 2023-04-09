import { DEBUG_MODE, DEMO_MODE } from "../constants";
import { IPlayer } from "../types";
import Pong from "./Pong";

const PongDemo = () => {
  const leftPlayerDemo: IPlayer = {
    id: 0,
    name: "",
    avatar: null,
    isLeft: true,
    isCom: true,
    score: 0,
    keyboardState: null,
    backgroundColor: "black",
  };
  const rightPlayerDemo: IPlayer = {
    id: 1,
    name: "Computer",
    avatar: null,
    isLeft: false,
    isCom: true,
    score: 0,
    keyboardState: null,
    backgroundColor: "black",
  };

	return (
    <>
      <Pong
        canvasWidth={390}
        canvasHeight={288}
        leftPlayerData={leftPlayerDemo}
        rightPlayerData={rightPlayerDemo}
        mode={DEMO_MODE}
      />
    </>
  );  
}

export default PongDemo;