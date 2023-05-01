import { useContext, useEffect, useState } from "react";
import Request from "../components/Request";
import { Context, UserContext } from "../context";
import { useNavigate } from "react-router";
import { IUser } from "../types";

function FriendRow({ friendId }: { friendId: number }) {
  const navigate = useNavigate();
  const [friend, setFriend] = useState<IUser | null>(null);
  const socket = useContext(Context).pongSocket.current;
  const currentChannel = useContext(Context).currentChannel;

  function handleClick() {
    if (!socket || !currentChannel || !friend) {
      return ;
    }
    socket.emit('invite-user', {channelId: currentChannel.id, inviteId: friend.id});
    console.log("invite");
    
  }

  useEffect(() => {
    Request.getProfileFromId(friendId).then(res => {
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
            <button title="Invite to channel" id="invite-btn" onClick={handleClick}>
              Invite
            </button>
          </td>
        </tr>
      }
    </>
  )
}

interface InviteToChannelProps {
  onClose: () => void,
}

function InviteToChannel({
  onClose,
}: InviteToChannelProps) {
  const [friendList, setFriendList] = useState<number[]>([]);
  const [friendInputValue, setFriendInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const user = useContext(UserContext).user;

  function getFriendsList() {
    setFriendList([]);
    setLoading(true);
    if (user) {
      Request.getProfile(user.username).then(res => {
        if (res) {
          setFriendList(res.friends);
        }
      }).catch(err => {
        console.error(err);
      });
    }
    setLoading(false);
  }

  function filterFriends() {
    const filter = friendInputValue.toUpperCase();
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
    getFriendsList();
  }, []);

  return (
    <div className="room-list modal-overlay">
      {
        loading ? <h2>Loading...</h2> : (
          <div className="Form modal">
            <div className="modal-content">
              <div className="modal-close" role="button" onClick={onClose}>&times;</div>
              {
                friendList && friendList.length > 0 ?
                <div>
                  <input
                    type="text"
                    id="search-bar"
                    autoComplete="off"
                    onChange={(e) => setFriendInputValue(e.target.value)}
                    onKeyUp={filterFriends}
                    placeholder="Search by username"
                    title="Type in a name"
                    value={friendInputValue}
                  />
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
                          Challenge
                        </td>
                      </tr>
                    </tbody>
                    <tbody id="friends-table">
                      {
                        friendList.map((friendId, index) => (
                          <FriendRow key={index} friendId={friendId} />
                        ))
                      }
                    </tbody>
                  </table>
                </div>
                : <h3>Friend list is empty.</h3>
              }
            </div>
          </div>
        )
      }
    </div> /* className="room-list" */
  )
}

export default InviteToChannel;