import { useState } from "react";
import { IGameRoom } from "../types";
import { useNavigate } from "react-router";
import "./style/ProfileHistory.css"

function ProfileHistory({ history, profileId }: { history: IGameRoom[], profileId: number }) {
  const navigate = useNavigate();
  const [historyPage, setHistoryPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  return (
    <div className="profile-match-history" style={{ paddingBottom: '20px' }}>
      <h2>Match History</h2>
      {
        history.length > 0 && (
          <div className="room-list">
            <table className="room-list-table">
              <tbody>
                <tr title="Room info" className="room-list-row">
                  <td className="room-list-cell">
                    Left player
                  </td>
                  <td className="room-list-cell">
                    Right player
                  </td>
                  <td className="room-list-cell">
                    Result
                  </td>
                </tr>
                {
                  history.slice(historyPage * pageSize, historyPage * pageSize + pageSize).map((room) => (
                    <tr className="room-list-row" key={room.id}>
                      <td className="room-list-cell room-list-cell-username" title="See profile" role="button"
                        onClick={() => navigate('/profile/' + room.left.username.toLowerCase())}>
                        {room.left.username}
                      </td>
                      <td className="room-list-cell room-list-cell-username" title="See profile" role="button"
                        onClick={() => navigate('/profile/' + room.right.username.toLowerCase())}>
                        {room.right.username}
                      </td>
                      <td className="room-list-cell">
                        {(
                          ((room.left.id === profileId) && ((room.gameState.leftPlayer.score > room.gameState.rightPlayer.score)
                            && <div id="match-history-win">Win</div> || <div id="match-history-lose">Loss</div>))
                          || ((room.right.id === profileId) && (room.gameState.leftPlayer.score < room.gameState.rightPlayer.score)
                          && <div id="match-history-win">Win</div> || <div id="match-history-lose">Loss</div>)
                        )}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <div className="pages">
              <button className="pages-buttons-btn" disabled={pageSize >= history.length ? true : false} onClick={() => {
                setPageSize(pageSize + 5);
              }}
              > Show more
              </button>
            </div> {/* className="pages" */}
          </div> /* className="room-list" */
        ) ||
        <div>No games registered.</div>
      }
    </div>
  )
}

export default ProfileHistory;