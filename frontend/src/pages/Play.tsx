// Play page
//
// Play
//  Ranked
//  Invite a friend
//  Against the computer

import { redirect, useNavigate } from "react-router";
import router from "../router";
import { IPlayer } from "../types";

function Play() {
  let navigate = useNavigate();
  const player1: IPlayer = {
    id: 0,
    name: "Duke",
    avatar: undefined,
  };
  const player2: IPlayer = {
    id: 1,
    name: "King",
    avatar: undefined,
  };

  function startGame() {
    navigate("/game/" + player1.id + player2.id);
  }

	return (
    <div className="Play">
      <h1>Play Pong</h1>
      <button>Play online</button>
      <br/>
      <button onClick={startGame}>Computer</button>
      <br/>
      <button>Play a friend</button>
    </div>
	);
}

export default Play;