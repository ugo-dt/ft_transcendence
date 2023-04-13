import RoomList from "../layouts/RoomList";
import "./style/Watch.css"

function Watch() {
  return (
    <div className="Watch">
      <h1>Spectate live games!</h1>
      <RoomList />
    </div>
  );
}

export default Watch;