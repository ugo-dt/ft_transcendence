import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import ComputerIcon from '@mui/icons-material/Computer';
import GroupIcon from '@mui/icons-material/Group';
import "./style/Play.css"

import { useNavigate } from "react-router";
import { IPlayer } from "../types";

function Play() {
  const navigate = useNavigate();
  
  function startRankedGame() {
    const playerData: IPlayer = {
      id: 0,
      name: "Player 1",
      avatar: null,
      isLeft: true,
      isCom: false,
      score: 0,
      keyboardState: null,
      backgroundColor: "black",
    };
    navigate("/game/ranked", { state: {playerData} });
  }

  function startCasualGame() {
  }

  function startComputerGame() {
    const leftPlayerData: IPlayer = {
      id: 0,
      name: "Player 1",
      avatar: null,
      isLeft: true,
      isCom: false,
      score: 0,
      keyboardState: null,
      backgroundColor: "black",
    };
    const rightPlayerData: IPlayer = {
      id: 1,
      name: "Player 2",
      avatar: null,
      isLeft: false,
      isCom: true,
      score: 0,
      keyboardState: null,
      backgroundColor: "black",
    };
    navigate("/game/computer", { state: {leftPlayerData, rightPlayerData} });
  }

  return (
	<div className="gamePage">
		{/* <h1>Play:</h1> */}
		<div className="playModes">
			<div className="modules" role="button" onClick={startRankedGame}>
				<SportsTennisIcon fontSize="large" sx={{ margin: '20px' }} />
				<h2>Online</h2>
			</div>
			<div className="modules" role="button" onClick={startComputerGame}>
				<ComputerIcon fontSize="large" sx={{ margin: '20px' }} />
				<h2>Computer</h2>
			</div>
			<div className="modules" role="button" onClick={startCasualGame}>
				<GroupIcon fontSize="large" sx={{ margin: '20px' }} />
				<h2>Invite a friend</h2>
			</div>
		</div>
	</div>
);
}

export default Play;