import RoomList from "../layouts/RoomList";
import "./style/Watch.css"

function Watch() {
  document.title = "ft_transcendence - Spectate games";

  return (
    <div className="Watch">
      <h1>Live games</h1>
      <RoomList />
    </div>
  );
}

export default Watch;