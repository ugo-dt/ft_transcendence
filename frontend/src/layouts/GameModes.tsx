import "./style/GameModes.css"
import { useNavigate } from "react-router";
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import TvIcon from '@mui/icons-material/Tv';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

const GameModes = () => {
  const navigate = useNavigate();

  function startRankedGame() {
    navigate("/game/ranked");
  }

  function startComputerGame() {
    navigate("/computer");
  }
  function startFriendGame() {
    alert("Unimplemented.");
  }

  return (
    <>
      <div className="gamePage" style={{ display: 'flex', flexDirection: 'column' }}>
        <ul className="playModes">
          <li className="modules" role="button" onClick={startRankedGame}>
            <SportsTennisIcon className='icon tennis' fontSize="large" />
            <div>
              <h2>Online</h2>
              <h5>Compete with someone of <br /> similar skill</h5>
            </div>
          </li>
          <li className="modules" role="button" onClick={startComputerGame}>
            <TvIcon className='icon tv' fontSize="large" />
            <div>
              <h2>Computer</h2>
              <h5>Challenge a bot</h5>
            </div>
          </li>
          <li className="modules" role="button" onClick={startFriendGame}>
            <PeopleOutlineIcon className='icon people' fontSize="large" />
            <div>
              <h2>Play a friend</h2>
              <h5>Invite a friend to a casual game</h5>
            </div>
          </li>
        </ul>
      </div>
    </>
  );;
}

export default GameModes;