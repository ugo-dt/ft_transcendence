/**
 * 
 * get friends list
 * show list of friends (name, rating, status, button)
 * disable button if status != online
 * filter friends with search list
 */

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Context, UserContext } from "../context";
import Request from "../components/Request";
import { IUser } from "../types";
import "./style/Friends.css"

function FriendRow({ friendname }: { friendname: string }) {
  const navigate = useNavigate();
  const [friend, setFriend] = useState<IUser | null>(null)
  
  function handleInvite() {
  }

  useEffect(() => {
    Request.getProfile(friendname).then(res => {
      if (res) {
        setFriend(res);
      }
    });
  }, []);

  return (
    <>
      {
        friend &&
        <tr className="room-list-row" key={friend.id}>
          <td className="room-list-cell room-list-cell-username" title="See profile" role="button" onClick={() => navigate('/profile/' + friend.username)}>
            {friend.username}
          </td>
          <td className="room-list-cell">
            {friend.rating}
          </td>
          <td className="room-list-cell">
            {friend.status.charAt(0).toLocaleUpperCase() + friend.status.slice(1)}
          </td>
          <td className="room-list-cell">
            <button title="Watch game" onClick={() => handleInvite}>
              Invite
            </button>
          </td>
        </tr>
      }
    </>
  )
}

function Friends() {
  const context = useContext(UserContext);
  const client = useContext(UserContext).user;
  const setUser = useContext(UserContext).setUser;
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");

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
    // if (!context) {
    //   return ;
    // }
    function getFriendsList() {
      setFriendsList([]);
      setLoading(true); // Set loading state to true before making HTTP requests
      if (client) {
        Request.getProfile(client.username).then(res => {
          if (res) {
            setFriendsList(res.friends);
          }
        }).catch(err => {
          console.error(err);
        });
      }
      setLoading(false);
    }
    getFriendsList();
  }, [context]);

  if (!client) {
    return;
  }

  return (
    <div className="Friends">
      <h1>Friends</h1>
      {(loading && <h2>Loading...</h2>) ||
        (
          friendsList && friendsList.length > 0 &&
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
                  friendsList.map((friendname, index) => (
                    <FriendRow key={index} friendname={friendname} />
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