// Rankings page
//
// Users should be able to:
//  See the top players (and their profile)
//
//  See their current ranking

import { useEffect, useState } from "react";
import { IUser } from "../types";
import "../layouts/style/RoomList.css"
import "./style/Rankings.css"
import Request from "../components/Request";
import { useNavigate } from "react-router";

function Rankings() {
  const navigate = useNavigate();
  const [playerList, setPlayerList] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function getPlayerList() {
      setPlayerList([]);
      setLoading(true);
      
      Request.getRankings().then(res => {
        setPlayerList(res);
      }).catch(err => {
        console.error(err);
      });
      setLoading(false);
    }
    getPlayerList();
  }, []);

  return (
    <div className="Rankings">
      <h1>Ratings</h1>
      {(loading && <h2>Loading...</h2>) ||
        (
          playerList && playerList.length > 0 &&
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
                      <td className="room-list-cell room-list-cell-username" title="See profile" role="button" onClick={() => navigate('/profile/' + player.username.toLowerCase())}>
                        {player.username}
                      </td>
                      <td className="room-list-cell" title="See profile" role="button">
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