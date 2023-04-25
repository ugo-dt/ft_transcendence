import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Context, QueueContext, UserContext } from "../context";
import Request from "../components/Request";
import { IUser } from "../types";
import GameInvite from "../layouts/GameInvite";
import "./style/Friends.css"

function InviteRow({ friendId: friendId }: { friendId: number }) {
  const socket = useContext(Context).pongSocket;
  const inQueue = useContext(QueueContext).inQueue;
  const navigate = useNavigate();
  const [friend, setFriend] = useState<IUser | null>(null);
  const inGame = useRef(false);

  function onStartGame(data: any) {
    if (inGame.current) {
      return ;
    }
    inGame.current = true;
    const gameUrl = "/game/" + data.roomId;
    navigate(gameUrl, { state: { roomId: data.roomId, role: 'player' } });
  }

  function handleClick() {
    if (!socket.current) {
      return ;
    }
    socket.current.emit('accept-challenge', friendId, (res: boolean) => {
      if (res === false) {
        navigate("/friends", {state: {info: 'Challenge was cancelled.'}});
        window.location.reload();
      }
    });
  }

  useEffect(() => {
    if (!socket.current) {
      return ;
    }
    Request.getProfileFromId(friendId).then(res => {
      if (res) {
        setFriend(res);
      }
    });
    socket.current.on('startGame', (data: any) => { onStartGame(data) });

    return () => {
      if (socket.current) {
        socket.current.off('startGame', (data: any) => { onStartGame(data) });
      }
    }
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
            <button disabled={inQueue} title="Challenge to a game" id="invite-btn" onClick={handleClick}>
              Accept
            </button>
          </td>
        </tr>
      }
    </>
  )
}

function FriendRow({ friendname }: { friendname: string }) {
  const navigate = useNavigate();
  const [friend, setFriend] = useState<IUser | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const inQueue = useContext(QueueContext).inQueue;

  function handleClick() {
    setIsOpen(!isOpen);
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
            <button disabled={inQueue || !(friend.status === 'online')} title="Challenge to a game" id="invite-btn" onClick={handleClick}>
              Invite
            </button>
            {isOpen && <GameInvite title="Challenge" opponentId={friend.id} isRematch={false} onClose={handleClick} />}
          </td>
        </tr>
      }
    </>
  )
}

function Friends() {
  document.title = "ft_transcendence - Friends";
  const state = useLocation().state;
  const navigate = useNavigate();
  const context = useContext(Context);
  const socket = useContext(Context).pongSocket;
  const user = useContext(UserContext).user;
  const [friendList, setFriendList] = useState<string[]>([]);
  const [challengeList, setChallengeList] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [friendInputValue, setFriendInputValue] = useState("");
  const [challengeInputValue, setChallengeInputValue] = useState("");
  const [info, setInfo] = useState("");

  function filterChallenges() {
    const filter = challengeInputValue.toUpperCase();
    const table = document.getElementById("challenges-table");
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

  function getChallengeList() {
    if (!socket.current) {
      return;
    }
    socket.current.emit('challenge-list', (res: number[]) => {
      setChallengeList(res);
    });
  }

  useEffect(() => {
    if (!context.socketConnected) {
      return;
    }
    window.history.replaceState({}, document.title);
    getFriendsList();
    getChallengeList();
    if (state) {
      setInfo(state.info);
    }
  }, [context]);

  if (!user) {
    navigate("/home");
  }

  return (
    <div className="Friends">
      <h1>Friends</h1>
      <h3 id="friends-state-info">{info}&nbsp;</h3>
      {
        loading ? <h2>Loading...</h2> : (
          <div className="friends-sections">
            <section className="friends-list">
              <h2 id="section-title">Friend list</h2>
              {
                friendList && friendList.length > 0 ? (
                  <div className="room-list">
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
                          friendList.map((friendname, index) => (
                            <FriendRow key={index} friendname={friendname} />
                          ))
                        }
                      </tbody>
                    </table>
                  </div> /* className="room-list" */
                ) : <h3>Friends list is empty.</h3>
              }
            </section>
            <section className="friends-invites">
              <h2 id="section-title">Game invites list</h2>
              {
                challengeList && challengeList.length > 0 ? (
                  <div className="room-list">
                    <input
                      type="text"
                      id="search-bar"
                      autoComplete="off"
                      onChange={(e) => setChallengeInputValue(e.target.value)}
                      onKeyUp={filterChallenges}
                      placeholder="Search by username"
                      title="Type in a name"
                      value={challengeInputValue}
                    />
                    <table className="room-list-table">
                      <tbody>
                        <tr title="Room info" className="room-list-row">
                          <td className="room-list-cell">Username</td>
                          <td className="room-list-cell">Rating</td>
                          <td className="room-list-cell">Status</td>
                          <td className="room-list-cell">Challenge</td>
                        </tr>
                      </tbody>
                      <tbody id="challenges-table">
                        {challengeList.map((friendId, index) => <InviteRow key={index} friendId={friendId} />)}
                      </tbody>
                    </table>
                  </div>
                ) : <h3>No challenges.</h3>
              }
                <button style={{padding: '5px'}} onClick={getChallengeList}>
                  Refresh
                </button>
            </section>
          </div>
        )
      }
    </div>
  );
}

export default Friends;