import { useContext, useEffect, useState } from "react";
import { IUser } from "../types";
import { Context, UserContext } from "../context";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import ChatIcon from '@mui/icons-material/Chat';
import BlockIcon from '@mui/icons-material/Block';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Request from "../components/Request";
import EditUsernameForm from "./EditUsernameForm";
import EditAvatarForm from "./EditAvatarForm";
import { useNavigate } from "react-router";
import "./style/ProfileHeader.css"

function ProfileHeader({ profile }: { profile: IUser }) {
  const context = useContext(UserContext);
  const user = useContext(UserContext).user;
  const socket = useContext(Context).pongSocket;
  const navigate = useNavigate();
  const [isFriend, setIsFriend] = useState(false);
  const [isAvatarFormOpen, setIsAvatarFormOpen] = useState(false);
  const [isUsernameFormOpen, setIsUsernameFormOpen] = useState(false);

  function onClickEditUsername() {
    setIsUsernameFormOpen(!isUsernameFormOpen);
  }

  function onClickEditAvatar() {
    setIsAvatarFormOpen(!isAvatarFormOpen);
  }

  function onClick2FA() {
    console.log("2FA");
  }

  function onClickAddFriend() {
    if (!user) {
      return ; // todo: redirect to sign in
    }
    Request.addFriend(profile.username);
    navigate("/profile/" + profile.username.toLowerCase(), {state: {info: 'Friend added successfully.'}});
    window.location.reload();
  }

  function onClickRemoveFriend() {
    if (!user) {
      return ;
    }
    Request.removeFriend(profile.username);
    navigate("/profile/" + profile.username.toLowerCase(), {state: {info: 'Friend removed successfully.'}});
    window.location.reload();
  }

  function onClickChallenge() {
    if (!socket.current ||!socket.current.connected) {
      return ;
    }
    socket.current.emit('challenge', profile.username, (res: string) => {
      console.log(res);
    });
  }

  function onClickMessage() {
    console.log("message");
  }

  function onClickBlock() {
    console.log("block");
  }

  useEffect(() => {
    if (user && profile && user.friends && user.friends.length > 0) {
      if (user.friends.includes(profile.username)) {
        setIsFriend(true);
      }
    }
  }, [context]);

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
                <AddPhotoAlternateIcon className="upload-icon" fontSize="large" />
              </div>
            }
          </div>
        </section>
        <section className="profile-header-content">
          <div className="profile-header-details-container">
            <h1 id="profile-header-details-username">{profile.username}</h1>
          </div>
          <div className="profile-header-details">
            <h3 id="profile-header-details-rating">Rating: {profile.rating}</h3>
            <h3 id="profile-header-details-status">Status: {profile.status.charAt(0).toLocaleUpperCase() + profile.status.slice(1)}</h3>
          </div>
          {
            user && profile.username === user.username &&
            <div className="profile-header-actions">
              <div role="button" className="profile-header-actions-btn edit-profile-btn"
                onClick={onClickEditUsername}
              >
                <EditIcon className="profile-header-actions-icon" /> Edit username
              </div>
              <div role="button" className="profile-header-actions-btn edit-profile-btn"
                onClick={onClick2FA}
              >
                <VpnKeyIcon className="profile-header-actions-icon" /> Enable 2FA
              </div>
            </div>
            &&
            <div className="profile-header-actions">
              {
                !isFriend &&
                <div role="button" className="profile-header-actions-btn add-friend-btn"
                  onClick={onClickAddFriend}
                > <PersonAddAlt1Icon className="profile-header-actions-icon" /> Add friend
                </div>
              }
              {
                isFriend &&
                <div role="button" className="profile-header-actions-btn add-friend-btn"
                  onClick={onClickRemoveFriend}
                > <PersonRemoveIcon className="profile-header-actions-icon" /> Remove friend
                </div>
              }
              <div role="button" className="profile-header-actions-btn challenge-btn"
                onClick={onClickChallenge}
              >
                <SportsTennisIcon className="profile-header-actions-icon" /> Challenge
              </div>
              <div role="button" className="profile-header-actions-btn message-btn"
                onClick={onClickMessage}
              >
                <ChatIcon className="profile-header-actions-icon" /> Message
              </div>
              <div role="button" className="profile-header-actions-btn block-btn"
                onClick={onClickBlock}
              >
                <BlockIcon className="profile-header-actions-icon" /> Block
              </div>
            </div>
          }
        </section>
      </div>
      {
        isAvatarFormOpen && <EditAvatarForm onClose={onClickEditAvatar} />
      }
      {
        isUsernameFormOpen && <EditUsernameForm onClose={onClickEditUsername} />
      }
    </div>
  )
}

export default ProfileHeader;