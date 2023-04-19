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
import Requests from "../components/Requests";
import EditUsernameForm from "./EditUsernameForm";

function ProfileHeader({ profile }: { profile: IUser }) {
  const client = useContext(UserContext).user!;
  const [isFriend, setIsFriend] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  function handleClickForm() {
    setIsFormOpen(!isFormOpen);
  }

  function onClickEditAvatar() {
    console.log("upload");
  }

  function onClick2FA() {
    console.log("2FA");
  }

  function onClickAddFriend() {
    Requests.addFriend(client.username, profile.username);
    setIsFriend(true);
  }

  function onClickRemoveFriend() {
    Requests.removeFriend(client.username, profile.username);
    setIsFriend(false);
  }

  function onClickChallenge() {
    console.log("challenge");
  }

  function onClickMessage() {
    console.log("message");
  }

  function onClickBlock() {
    console.log("block");
  }

  useEffect(() => {
    Requests.getFriendList(client.username).then(list => {
      if (list) {
        if (list.find(c => c.username === profile.username))
          setIsFriend(true);
      }
    });
  }, [])

  return (
    <div className="profile-header-container">
      <div className="profile-header-info">
        <section>
          <div className="profile-header-avatar">
            <img id="avatar-component"
              src={profile.avatar}
              width={120}
              height={120}
              alt={profile.username}
            />
            {
              profile.username === client.username &&
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
            <h3 id="profile-header-details-status">{profile.status.charAt(0).toLocaleUpperCase() + profile.status.slice(1)}</h3>
          </div>
          {
            profile.username !== client.username &&
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
            ||
            <div className="profile-header-actions">
              <div role="button" className="profile-header-actions-btn edit-profile-btn"
                onClick={handleClickForm}
              >
                <EditIcon className="profile-header-actions-icon" /> Edit username
              </div>
              <div role="button" className="profile-header-actions-btn edit-profile-btn"
                onClick={onClick2FA}
              >
                <VpnKeyIcon className="profile-header-actions-icon" /> Enable 2FA
              </div>
            </div>
          }
        </section>
      </div>
      {
        isFormOpen && <EditUsernameForm clientName={client.username} onClose={handleClickForm} />
      }
    </div>
  )
}

export default ProfileHeader;