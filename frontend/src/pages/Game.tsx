import { useLocation } from "react-router";
import Pong from "../layouts/Pong";

function Game() {
  const location = useLocation();
  
  if (!location.state) {
    location.state = {
      role: 'spectator',
      roomId: window.location.pathname.split("/").pop(),
    }
  }

  return (
    <div className="Game">
      <Pong role={location.state.role} roomId={location.state.roomId} />
    </div>
  );
}

export default Game;