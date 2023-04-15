// Profile page
//
// Users should be able to:
// 	Add and remove friends
//
// 	See the friends current status: online, offline, in a game, etc)
//
//  See the match history of the current profile
//
//  Watch other people games (if they are playing)
//
// Account settings
// Users should be able to:
// 	Set an avatar
// 	Set a nickame
//	Enable 2FA

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context";
import { Navigate } from "react-router";
import { IClient, IRoom } from "../types";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import ChatIcon from '@mui/icons-material/Chat';
import BlockIcon from '@mui/icons-material/Block';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import "./style/Profile.css"
import "../layouts/style/RoomList.css"

const PAGE_SIZE: number = 10;

function Profile() {
  const serverUrl = useContext(Context).serverUrl;
  const [profile, setProfile] = useState({} as IClient);
  const [history, setHistory] = useState([] as IRoom[]);
  const [historyPage, setHistoryPage] = useState(0);
  const [loading, setLoading] = useState(true);

  console.log(window.location.pathname);

  if (window.location.pathname === '/profile' || window.location.pathname === '/profile/') {
    return <Navigate to={"/home"} />
  }

  async function getProfile() {
    const username = window.location.pathname.split("/").pop();
    const userUrl = serverUrl + '/api/pong/users/' + username;
    console.log(userUrl);
    await axios.get(userUrl).then(res => {
      console.log(res);
      setProfile(res.data);
    }).catch(err => {
      console.error(err);
    });
    const historyUrl = serverUrl + '/api/pong/history/' + username;
    await axios.get(historyUrl).then(res => {
      console.log(res);
      setHistory(res.data);
    }).catch(err => {
      console.error(err);
    });
    setLoading(false);
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="Profile">
      {
        !loading &&
        <div className="profile-header-container">
          <div className="profile-header-info">
            <div className="profile-header-avatar">
              <img id="avatar-component"
                src={profile.avatar}
                width={120}
                height={120}
                alt={profile.name}
              />
            </div>
            <section className="profile-header-content">
              <div className="profile-header-details-container">
                <h1 id="profile-header-details-username">{profile.name}</h1>
                <div className="profile-header-details">
                  <h3 id="profile-header-details-rating">{profile.rating}</h3>
                  <h4 id="profile-header-details-status">{profile.status.charAt(0).toLocaleUpperCase() + profile.status.slice(1)}</h4>
                </div>
              </div>
              <div className="profile-header-actions">
                <section>
                  <div role="button" className="profile-header-actions-btn add-friend-btn"> {/** TODO: change to remove friend if already friend */}
                    <PersonAddAlt1Icon className="profile-header-actions-icon" />
                    <div>Add friend</div>
                  </div>
                  <div role="button" className="profile-header-actions-btn challenge-btn">
                    <SportsTennisIcon className="profile-header-actions-icon" />
                    <div>Challenge</div>
                  </div>
                </section>
                <section>
                  <div role="button" className="profile-header-actions-btn message-btn">
                    <ChatIcon className="profile-header-actions-icon" />
                    <div>Message</div>
                  </div>
                  <div role="button" className="profile-header-actions-btn block-btn">
                    <BlockIcon className="profile-header-actions-icon" />
                    <div>Block</div>
                  </div>
                </section>
              </div>
            </section>
          </div>
        </div>
      }
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
                        <td className="room-list-cell room-list-cell-username" title="See profile" role="button" onClick={() => window.open('/profile/' + room.left.id, '_blank')}>
                          {room.left.name}
                        </td>
                        <td className="room-list-cell room-list-cell-username" title="See profile" role="button" onClick={() => window.open('/profile/' + room.right.id, '_blank')}>
                          {room.right.name}
                        </td>
                        <td className="room-list-cell">
                          {
                            (
                              ((room.left.id === profile.id) &&
                                ((room.gameState.leftPlayer.score > room.gameState.rightPlayer.score) && <div id="match-history-win">Win</div> || <div id="match-history-lose">Loss</div>))
                              || ((room.right.id === profile.id)
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
    </div>
  );
}

export default Profile;