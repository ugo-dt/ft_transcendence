// Rankings page
//
// Users should be able to:
//  See the top players (and their profile)
//
//  See their current ranking

import { useContext, useEffect, useState } from "react";
import { IClient } from "../types";
import { Context } from "../context";
import axios from "axios";
import "../layouts/style/RoomList.css"
import "./style/Rankings.css"

function Rankings() {
  const [playerList, setPlayerList] = useState([] as IClient[]);
  const client = useContext(Context).client;
  const serverUrl = useContext(Context).serverUrl;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function getPlayerList() {
      setPlayerList([] as IClient[]);
      setLoading(true); // Set loading state to true before making HTTP requests
      const userUrl = serverUrl + '/api/pong/rankings';
      axios.get(userUrl).then(res => {
        setPlayerList(res.data);
      }).catch(err => {
        console.error(err);
      });
      setLoading(false);
    }
    getPlayerList();
  }, []);

  return (
    <div className="Rankings">
      <h1>Rankings</h1>
      {(loading && <h2>Loading...</h2>) ||
        (
          playerList.length > 0 &&
          <div className="room-list">
            <table className="room-list-table" id="rankings-table">
              <tbody>
              <tr title="Room info" className="room-list-row">
                  <td className="room-list-cell">
                    #
                  </td>
                  <td className="room-list-cell">
                    Name
                  </td>
                  <td className="room-list-cell">
                    Points
                  </td>
                </tr>
                {
                  playerList.map((player, index) => (
                    <tr className="room-list-row" key={player.id}>
                      <td className="room-list-cell">
                        {index + 1}
                      </td>
                      <td className="room-list-cell room-list-cell-username" title="See profile" role="button" onClick={() => window.open('/profile/' + player.name, '_blank')}>
                        {player.name}
                      </td>
                      <td className="room-list-cell room-list-cell-username" title="See profile" role="button" onClick={() => window.open('/profile/' + player.name, '_blank')}>
                        {player.rating}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div > /* className="room-list" */
        )
      }
    </div>
  );
}

export default Rankings;