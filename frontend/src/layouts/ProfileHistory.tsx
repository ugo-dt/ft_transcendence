import { useState } from "react";
import { IRoom } from "../types";

const PAGE_SIZE: number = 10;

function ProfileHistory({ history, profileId }: { history: IRoom[], profileId: number }) {
  const [historyPage, setHistoryPage] = useState(0);

  return (
    <div className="profile-match-history">
      {
        history.length > 0 && (
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
                    Result
                  </td>
                </tr>
                {
                  history.slice(historyPage * PAGE_SIZE, historyPage * PAGE_SIZE + PAGE_SIZE).map((room) => (
                    <tr className="room-list-row" key={room.id}>
                      <td className="room-list-cell">
                        {room.id}
                      </td>
                      <td className="room-list-cell room-list-cell-username" title="See profile" role="button" onClick={() => window.open('/profile/' + room.left.name, '_blank')}>
                        {room.left.name}
                      </td>
                      <td className="room-list-cell room-list-cell-username" title="See profile" role="button" onClick={() => window.open('/profile/' + room.right.name, '_blank')}>
                        {room.right.name}
                      </td>
                      <td className="room-list-cell">
                        {
                          (
                            ((room.left.id === profileId) &&
                              ((room.gameState.leftPlayer.score > room.gameState.rightPlayer.score) && <div id="match-history-win">Win</div> || <div id="match-history-lose">Loss</div>))
                            || ((room.right.id === profileId)
                              && (room.gameState.leftPlayer.score < room.gameState.rightPlayer.score) && <div id="match-history-win">Win</div> || <div id="match-history-lose">Loss</div>)
                          )
                        }
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <div className="pages">
              <section>
                <button className="pages-buttons-btn" disabled={historyPage <= 0 ? true : false} onClick={() => historyPage > 0 && setHistoryPage(historyPage - 1)}>
                  Previous
                </button>
                <button className="pages-buttons-btn" disabled={historyPage + 1 < Math.ceil(history.length / PAGE_SIZE) ? false : true} onClick={() => historyPage < history.length / PAGE_SIZE - 1 && setHistoryPage(historyPage + 1)}>
                  Next
                </button>
              </section>
              {'Page ' + (historyPage + 1) + ' of ' + Math.ceil(history.length / PAGE_SIZE)}
            </div> {/* className="pages" */}
          </div> /* className="room-list" */
        ) ||
        <div>No games registered.</div>
      }
    </div>
  )
}

export default ProfileHistory;