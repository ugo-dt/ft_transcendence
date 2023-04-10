import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { IRoom } from "../types";
import { Context } from "../context";
import "./style/RoomList.css"

const PAGE_SIZE: number = 10;

function RoomList() {
  const navigate = useNavigate();
  const socket = useContext(Context).socketRef.current;
  const [roomList, setRoomList] = useState([] as IRoom[]);
  const [roomListPage, setRoomListPage] = useState(0);
  const [loading, setLoading] = useState(true);

  function handleClick(roomId: number) {
    console.log(roomId);
    socket.emit('spectate', roomId);
    const gameUrl = "/game/" + roomId;
    navigate(gameUrl, { state: { roomId: roomId, role: 'spectator' } });
  }

  useEffect(() => {
    socket.emit('get-room-list', (data: IRoom[]) => {
      setRoomList(data.sort((a, b) => a.id - b.id));
      console.log(data);
    });
    setLoading(false);
  }, []);

  return (
    <div className="RoomList">
      {(loading && <h2>Loading...</h2>) || (
        (
          roomList.length > 0 &&
          <div className="room-list">
      <table className="room-list-table">
        <tbody>
          <tr title="Room info" className="room-list-row">
            <td className="room-list-cell">
              Room ID
            </td>
            <td className="room-list-cell">
              Left player
            </td>
            <td className="room-list-cell">
              Right player
            </td>
            <td className="room-list-cell">
              Watch
            </td>
          </tr>
          {
            roomList.slice(roomListPage * PAGE_SIZE, roomListPage * PAGE_SIZE + PAGE_SIZE).map((room) => (
              <tr className="room-list-row" key={room.id}>
                <td className="room-list-cell">
                  {room.id}
                </td>
                <td className="room-list-cell room-list-cell-username" title="See profile" role="button" onClick={() => window.open('/profile/' + room.left.id, '_blank')}>
                  {room.left.name}
                </td>
                <td className="room-list-cell room-list-cell-username" title="See profile" role="button" onClick={() => window.open('/profile/' + room.right.id, '_blank')}>
                  {room.right.name}
                </td>
                <td className="room-list-cell">
                  <button title="Watch game" onClick={() => handleClick(room.id)}>
                    Watch
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <div className="pages">
        <section>
          <button className="pages-buttons-btn" onClick={() => roomListPage > 0 && setRoomListPage(roomListPage - 1)}>
            Previous
          </button>
          <button className="pages-buttons-btn" onClick={() => roomListPage < roomList.length / PAGE_SIZE - 1 && setRoomListPage(roomListPage + 1)}>
            Next
          </button>
        </section>
        {'Page ' + (roomListPage + 1) + ' of ' + Math.floor(roomList.length / PAGE_SIZE + 1)}
      </div> {/* className="pages" */}
    </div> /* className="room-list" */
        ) ||
        <div style={{textAlign: 'center', margin: '5px'}}>
          <h3>No current live games.</h3>
          <h4>Refresh to reload.</h4>
        </div>
      )}
    </div>
  );
}

export default RoomList;