import { useContext, useState } from "react";
import { IClient, IRoom } from "../types";
import { Context } from "../context";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import ChatIcon from '@mui/icons-material/Chat';
import BlockIcon from '@mui/icons-material/Block';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import axios from "axios";
import { useNavigate } from "react-router";

function ProfileHeader({ profile }: { profile: IClient }) {
  const client = useContext(Context).client;
  const setClient = useContext(Context).setClient;
  const navigate = useNavigate();
  const [editUsernameValue, setEditUsernameValue] = useState("");

  function onClickEditAvatar() {
    console.log("upload");
  }

  function onClickEditUsername() {
    if (editUsernameValue.length < 3 || editUsernameValue.length > 16) {
      return;
    }

    const url = "http://localhost:3000/api/pong/username?username=" + client.name + "&value=" + editUsernameValue;
    console.log(url);

    axios.post(url).then(res => {
      setClient(res.data);
      navigate("/profile/" + res.data.name);
      window.location.reload();
      setEditUsernameValue("");
    }).catch(err => {
      console.error(err);
    });
  }
  
  function onClick2FA() {
    console.log("2FA");
  }

  function onClickAddFriend() {
    console.log("add friend");
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

  return (
    <div className="profile-header-container">
      <div className="profile-header-info">
        <section>
          <div className="profile-header-avatar">
            <img id="avatar-component"
              src={profile.avatar}
              width={120}
              height={120}
              alt={profile.name}
            />
            {/* TODO: only show this on user's own profile */}
            {
              profile.name === client.name &&
              <div role="button" onClick={onClickEditAvatar} className="upload-icon-wrapper">
                <AddPhotoAlternateIcon className="upload-icon" fontSize="large" />
              </div>
            }
          </div>
        </section>
        <section className="profile-header-content">
          <div className="profile-header-details-container">
            <h1 id="profile-header-details-username">{profile.name}</h1>
          </div>
          <div className="profile-header-details">
            <h3 id="profile-header-details-rating">Rating: {profile.rating}</h3>
            <h3 id="profile-header-details-status">{profile.status.charAt(0).toLocaleUpperCase() + profile.status.slice(1)}</h3>
          </div>
          {
            profile.name !== client.name &&
            <div className="profile-header-actions">
              <div role="button" className="profile-header-actions-btn add-friend-btn"
                onClick={onClickAddFriend}
              > {/** TODO: change to remove friend if already friend */}
                <PersonAddAlt1Icon className="profile-header-actions-icon" /> Add friend
              </div>
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
          }
        </section>
      </div>
    </div>
  )
}

export default ProfileHeader;