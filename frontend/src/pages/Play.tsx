import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import ComputerIcon from '@mui/icons-material/Computer';
import GroupIcon from '@mui/icons-material/Group';
import "./style/Play.css"

import { useNavigate } from "react-router";
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
  
  function startRankedGame() {
  }

  function startCasualGame() {
  }

  function startComputerGame() {
    navigate("/game/computer");
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