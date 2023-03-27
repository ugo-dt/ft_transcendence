// Home page
//
// Users should be able to:
//  Start a game
//
//  

import Pong from "../layouts/Pong";
import { IPlayer } from "../types";
import { DEMO_MODE } from "../constants";

function Home() {
  const leftPlayerData: IPlayer = {
    id: 0,
    name: "",
    avatar: null,
    isLeft: true,
    isCom: true,
    score: 0,
    keyboardState: null,
    backgroundColor: "black",
  };
  const rightPlayerData: IPlayer = {
    id: 1,
    name: "",
    avatar: null,
    isLeft: false,
    isCom: true,
    score: 0,
    keyboardState: null,
    backgroundColor: "black",
  };

	return (
    <div className="Home">
		  <h1>
        This is the Home page.
      </h1>
        <Pong
          canvasWidth={325}
          canvasHeight={240}
          leftPlayerData={leftPlayerData}
          rightPlayerData={rightPlayerData}
          mode={DEMO_MODE}
        />
    </div>
	);
}

export default Home;