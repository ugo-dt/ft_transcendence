import WifiIcon from '@mui/icons-material/Wifi';
import WifiOutlinedIcon from '@mui/icons-material/WifiOutlined';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import ComputerIcon from '@mui/icons-material/Computer';
import TvIcon from '@mui/icons-material/Tv';
import GroupIcon from '@mui/icons-material/Group';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import "./style/Play.css"

import { useNavigate } from "react-router";
import { IPlayer } from "../types";
import { CANVAS_BACKGROUND_COLOR } from '../constants';

function Play() {
  const navigate = useNavigate();
  
  function startRankedGame() {
    alert('Unimplemented yet');
    // navigate("/game/ranked", { state: {playerData} });
  }

  function startCasualGame() {
  }

  function startComputerGame() {
    const leftPlayerData: IPlayer = {
      id: 0,
      name: "",
      avatar: null,
      isLeft: true,
      isCom: false,
      score: 0,
      keyboardState: null,
      backgroundColor: CANVAS_BACKGROUND_COLOR,
    };
    const rightPlayerData: IPlayer = {
      id: 1,
      name: "Computer",
      avatar: null,
      isLeft: false,
      isCom: true,
      score: 0,
      keyboardState: null,
      backgroundColor: CANVAS_BACKGROUND_COLOR,
    };
    navigate("/game/computer", { state: {leftPlayerData, rightPlayerData} });
  }

  return (
	<div className="gamePage" style={{ display: 'flex', flexDirection: 'column'}}>
		<h1>Play Pong</h1>
		<div className="playModes">
			<div className="modules" role="button" onClick={startRankedGame}>
				<SportsTennisIcon className='icon tennis' fontSize="large" />
        <div>
          <h2>Online</h2>
          <h5>Compete with someone of <br/> similar skill</h5>
        </div>
			</div>
			<div className="modules" role="button" onClick={startComputerGame}>
				<TvIcon className='icon tv' fontSize="large" />
				<div>
          <h2>Computer</h2>
          <h5>Challenge a bot</h5>
        </div>
			</div>
			<div className="modules" role="button" onClick={startCasualGame}>
				<PeopleOutlineIcon className='icon people' fontSize="large" />
        <div>
          <h2>Play a friend</h2>
          <h5>Invite a friend to a casual game</h5>
        </div>
			</div>
		</div>
	</div>
);
}

export default Play;