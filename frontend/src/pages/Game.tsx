import { Navigate, useLocation } from "react-router";
import Pong from "../layouts/Pong";

function Game() {
  const location = useLocation();

  if (!location.state) {
    return <Navigate to={"/play/online"} />
  }
  return (
    <div className="Game">
      <Pong role={location.state.role} roomId={location.state.roomId} />
    </div>
  );
}

export default Game;