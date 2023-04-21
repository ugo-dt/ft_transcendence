import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { IRoom } from "../types";
import Request from "../components/Request";
import "./style/RoomList.css"

const PAGE_SIZE: number = 10;

function RoomList() {
  const navigate = useNavigate();
  const [roomList, setRoomList] = useState([] as IRoom[]);
  const [roomListPage, setRoomListPage] = useState(0);
  const [loading, setLoading] = useState(true);

  function _getRoomList() {
    Request.getRoomList().then(res => {
      setRoomList(res.sort((a, b) => a.id - b.id));
    }).catch(err => {
      console.error(err);
    });
  }

  function handleWatch(roomId: number) {
    const gameUrl = "/game/" + roomId;
    navigate(gameUrl, { state: { roomId: roomId, role: 'spectator' } });
  }

  function loadList() {
    setLoading(true);
    _getRoomList();
    setLoading(false);
  }

  useEffect(() => {
    loadList();
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
                      <td className="room-list-cell room-list-cell-username" title="See profile" role="button" onClick={() => navigate('/profile/' + room.left.username.toLowerCase())}>
                        {room.left.username}
                      </td>
                      <td className="room-list-cell room-list-cell-username" title="See profile" role="button" onClick={() => navigate('/profile/' + room.right.username.toLowerCase())}>
                        {room.right.username}
                      </td>
                      <td className="room-list-cell">
                        <button title="Watch game" onClick={() => handleWatch(room.id)}>
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
                <button className="pages-buttons-btn" disabled={roomListPage <= 0 ? true : false} onClick={() => roomListPage > 0 && setRoomListPage(roomListPage - 1)}>
                  Previous
                </button>
                <button className="pages-buttons-btn" disabled={roomListPage + 1 < Math.ceil(roomList.length / PAGE_SIZE) ? false : true} onClick={() => roomListPage < roomList.length / PAGE_SIZE - 1 && setRoomListPage(roomListPage + 1)}>
                  Next
                </button>
              </section>
              {'Page ' + (roomListPage + 1) + ' of ' + Math.ceil(roomList.length / PAGE_SIZE)}
            </div> {/* className="pages" */}
          </div> /* className="room-list" */
        ) ||
        <div style={{ textAlign: 'center', margin: '5px' }}>
          <h3>No current live games.</h3>
        </div>
      )
      }
      <div className="refresh">
        <button id="refresh-button"
          onClick={loadList}
          style={{
            padding: '10px',
            margin: '10px'
          }}
        >
          <h3>Refresh</h3>
        </button>
      </div>
    </div>
  );
}

export default RoomList;