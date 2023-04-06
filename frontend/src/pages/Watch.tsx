import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../context";
import { IRoomData } from "./Game";

import "./style/Watch.css"

function Watch() {
  const socket = useContext(Context).socketRef.current;
  const [loading, setLoading] = useState(true);
  const [roomList, setRoomList] = useState([] as IRoomData[]);

  function handleClick(roomId: number) {
    console.log(roomId);

  }

  useEffect(() => {
    socket.emit('get-room-list', (data: any) => {
      setRoomList(data);
      console.log(data);
    });
    setLoading(false);
  }, []);

  return (
    <div className="Watch">
      {(loading && <h2>Loading...</h2>) || (
        (
          roomList.length > 0 &&
          <table className="room-list-table">
            <tbody>
              <tr className="room-list-row">
                <td className="room-list-cell">
                  Room ID
                </td>
                <td className="room-list-cell">
                  Left player
                </td>
                <td className="room-list-cell">
                  Right player
                </td>
              </tr>
              {
                roomList.map((room) => (
                  <tr className="room-list-row" key={room.id}>
                    <td className="room-list-cell">
                      {room.id}
                    </td>
                    <td className="room-list-cell">
                      {room.left.name}
                    </td>
                    <td className="room-list-cell">
                      {room.right.name}
                    </td>
                    <td className="room-list-cell">
                      <button onClick={() => handleClick(room.id)}>
                        Watch
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        ) ||
        <h2>No live games. Retry later.</h2>
       )}
    </div>
  );
}

export default Watch;