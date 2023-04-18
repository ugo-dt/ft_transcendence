/**
 * 
 * get friends list
 * show list of friends (name, rating, status, button)
 * disable button if status != online
 * filter friends with search list
 */

import { useContext, useEffect, useState } from "react";
import { IClient } from "../types";
import { Context } from "../context";
import axios from "axios";
import "./style/Friends.css"
import Requests from "../components/Requests";

function Friends() {
  const [friendsList, setFriendsList] = useState<IClient[]>([]);
  const client = useContext(Context).client;
  const serverUrl = useContext(Context).serverUrl;
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");

  function handleInvite(friend: string) {
  }

  function filterFriends() {
    const filter = inputValue.toUpperCase();
    const table = document.getElementById("friends-table");
    const tr = table!.getElementsByTagName("tr");
    for (let i = 0; i < tr.length; i++) {
      const td = tr[i].getElementsByTagName("td")[0];
      const txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }

  useEffect(() => {
    function getFriendsList() {
      setFriendsList([] as IClient[]);
      setLoading(true); // Set loading state to true before making HTTP requests
      Requests.getFriendList(client.name).then(listData => {
        setFriendsList(listData);
      });
      setLoading(false);
    }
    getFriendsList();
  }, []);

  return (
    <div className="Friends">
      <h1>Friends</h1>
      {(loading && <h2>Loading...</h2>) ||
        (
          friendsList.length > 0 &&
          <div className="room-list">
            <input type="text" id="friends-search-bar" onChange={(e) => setInputValue(e.target.value)} onKeyUp={filterFriends} placeholder="Search by username" title="Type in a name"
              value={inputValue}
            ></input>
            <table className="room-list-table">
              <tbody>
                <tr title="Room info" className="room-list-row">
                  <td className="room-list-cell">
                    Username
                  </td>
                  <td className="room-list-cell">
                    Rating
                  </td>
                  <td className="room-list-cell">
                    Status
                  </td>
                  <td className="room-list-cell">
                    Invite
                  </td>
                </tr>
              </tbody>
              <tbody id="friends-table">
                {
                  friendsList.map((friend) => (
                    <tr className="room-list-row" key={friend.id}>
                      <td className="room-list-cell room-list-cell-username" title="See profile" role="button" onClick={() => window.open('/profile/' + friend.name, '_blank')}>
                        {friend.name}
                      </td>
                      <td className="room-list-cell">
                        {friend.rating}
                      </td>
                      <td className="room-list-cell">
                        {friend.status.charAt(0).toLocaleUpperCase() + friend.status.slice(1)}
                      </td>
                      <td className="room-list-cell">
                        <button title="Watch game" onClick={() => handleInvite(friend.name)}>
                          Invite
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div> /* className="room-list" */
        ) ||
        <h3>Friends list is empty.</h3>
      }
    </div>
  );
}

export default Friends;