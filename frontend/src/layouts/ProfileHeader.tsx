import { useContext, useEffect, useState } from "react";
import { IUser } from "../types";
import { QueueContext, UserContext } from "../context";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import EditIcon from '@mui/icons-material/Edit';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Request from "../components/Request";
import EditUsernameForm from "../components/EditUsernameForm";
import EditAvatarForm from "../components/EditAvatarForm";
import { useLocation, useNavigate } from "react-router";
import GameInvite from "../components/GameInvite";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import "./style/ProfileHeader.css"
import { PADDLE_COLORS } from "../constants";

function PaddleColorBox({ color }: { color: string }) {
  const user = useContext(UserContext).user;
  const setUser = useContext(UserContext).setUser;

  function isValidColor(color: string) {
    return (color === "white" || color === "yellow"
      || color === "#fd761b" || color === "#ff0000"
      || color === "#ff14b8" || color === "#9114ff"
      || color === "blue" || color === "#14ebff"
      || color === "green" || color === "#92ff0c");
  }

  async function setPaddleColor(color: string) {
    if (!user || user.paddleColor === color || !isValidColor(color)) {
      return;
    }
    const res = await Request.editPaddleColor(color as PADDLE_COLORS);
    if (res) {
      setUser(res);
    };
  }

  return (
    <div
      style={{ backgroundColor: `${color}` }}
      className={`box ${user && user.paddleColor === color ? 'selected' : ''}`}
      onClick={() => setPaddleColor(`${color}`)}
    />
  );
}

function ProfileHeader({ user, profile }: { user: IUser | null, profile: IUser }) {
  const inQueue = useContext(QueueContext).inQueue;
  const navigate = useNavigate();
  const [isFriend, setIsFriend] = useState(false);
  const [isAvatarFormOpen, setIsAvatarFormOpen] = useState(false);
  const [isUsernameFormOpen, setIsUsernameFormOpen] = useState(false);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [userRanking, setUserRanking] = useState(0);
  const state = useLocation().state;
  const [info, setInfo] = useState('');

  function onClickEditUsername() { setIsUsernameFormOpen(!isUsernameFormOpen); }
  function onClickEditAvatar() { setIsAvatarFormOpen(!isAvatarFormOpen); }
  function onClick2FA() { console.log("2FA"); }

  async function onClickAddFriend() {
    if (!user) {
      return;
    }
    await Request.addFriend(profile.id).then(res => {
      if (res) {
        setIsFriend(true);
      }
    });
    setInfo('Friend added successfully.');
  }

  async function onClickRemoveFriend() {
    if (!user) {
      return;
    }
    await Request.removeFriend(profile.id).then(res => {
      if (res) {
        setIsFriend(false);
      }
    });
    setInfo('Friend removed successfully.');
  }

  async function onClickWatch() {
    const roomList = await Request.getRoomList();
    const room = roomList.find(room => room.left.id === profile.id || room.right.id === profile.id);
    if (room) {
      const gameUrl = "/game/" + room.id;
      navigate(gameUrl, { state: { roomId: room.id, role: 'spectator' } });
    }
  }
  function onClickChallenge() { setIsChallengeOpen(!isChallengeOpen); }

  useEffect(() => {
    if (state && state.info) {
      setInfo(state.info);
    }
    Request.getUserRanking(profile.id).then(res => {
      if (res) {
        setUserRanking(res);
      }
    });
    if (user) {
      if (user.friends.includes(profile.id)) {
        setIsFriend(true);
      }
    }
  }, [user]);

  return (
    <div className="profile-header-container">
      <div className="profile-header-info">
        <section>
          <div className="profile-header-avatar">
            <img id="profile-avatar-component"
              src={profile.avatar}
              width={120}
              height={120}
              alt={profile.username}
            />
            {
              user && profile.username === user.username &&
              <div role="button" onClick={onClickEditAvatar} className="upload-icon-wrapper">
                <AddPhotoAlternateOutlinedIcon className="upload-icon" fontSize="large" />
              </div>
            }
          </div>
        </section>
        <section className="profile-header-content">
          <div className="profile-header-details-container">
            <h1 id="profile-header-details-username">{profile.username}</h1>
          </div>
          <div className="profile-header-details">
            <h3 id="profile-header-details-rating">Rating: {profile.rating} (#{userRanking})</h3>
            <h3 id="profile-header-details-status">Status: {profile.status.charAt(0).toLocaleUpperCase() + profile.status.slice(1)}</h3>
          </div>
          {
            user && profile.username === user.username ? (
              <div className="profile-header-actions">
                <section className="profile-colors-container">
                  <PaddleColorBox color="white" />
                  <PaddleColorBox color="yellow" />
                  <PaddleColorBox color="#fd761b" />
                  <PaddleColorBox color="#ff0000" />
                  <PaddleColorBox color="#ff14b8" />
                  <PaddleColorBox color="#9114ff" />
                  <PaddleColorBox color="blue" />
                  <PaddleColorBox color="#14ebff" />
                  <PaddleColorBox color="green" />
                  <PaddleColorBox color="#92ff0c" />
                </section>
                <section className="profile-buttons-container">
                  <div role="button" className="profile-header-actions-btn edit-profile-btn" onClick={onClickEditUsername}>
                    <EditIcon className="profile-header-actions-icon" /> Edit username
                  </div>
                  <div role="button" className="profile-header-actions-btn edit-profile-btn" onClick={onClick2FA}>
                    <VpnKeyIcon className="profile-header-actions-icon" /> Enable 2FA
                  </div>
                </section>
              </div>
            ) : (
              <div className="profile-buttons-container">
                {
                  !isFriend &&
                  <div role="button" className="profile-header-actions-btn add-friend-btn" onClick={onClickAddFriend}>
                    <PersonAddAlt1Icon className="profile-header-actions-icon" /> Add friend
                  </div>
                }
                {
                  isFriend &&
                  <div role="button" className="profile-header-actions-btn add-friend-btn" onClick={onClickRemoveFriend}>
                    <PersonRemoveIcon className="profile-header-actions-icon" /> Remove friend
                  </div>
                }
                {
                  !inQueue && (
                    (
                      profile.status === 'online' &&
                      <div role="button" className="profile-header-actions-btn challenge-btn" onClick={onClickChallenge}>
                        <SportsTennisIcon className="profile-header-actions-icon" /> Challenge
                      </div>
                    ) ||
                    (
                      profile.status === 'in game' &&
                      <div role="button" className="profile-header-actions-btn challenge-btn" onClick={onClickWatch}>
                        <OndemandVideoIcon className="profile-header-actions-icon" /> Watch
                      </div>
                    )
                  )
                }
              </div>
            )
          }
        </section> {/* className="profile-header-content" */}
      </div>
      <h3 id="profile-state-info">{info}&nbsp;</h3>
      {isAvatarFormOpen && <EditAvatarForm onClose={onClickEditAvatar} />}
      {isUsernameFormOpen && <EditUsernameForm onClose={onClickEditUsername} />}
      {isChallengeOpen && <GameInvite title="Challenge" opponentId={profile.id} isRematch={false} onClose={onClickChallenge} />}
    </div>
  )
}

export default ProfileHeader;