import "./style/Channels.css"
import CreateChannelForm from "../components/CreateChannelForm";
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LeaveChannelForm from "../components/LeaveChannelForm";
import ChannelNewPasswordForm from "../components/ChannelNewPasswordForm";
import BrowseChannels from "../components/BrowseChannels";
import { IChannel } from "../types";
import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { Context, UserContext } from "../context";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import InviteToChannel from "../components/InviteToChannel";
import { IChat } from "../pages/Chat";

interface ChannelsProps {
  chat: IChat,
}

function Channels({chat}: ChannelsProps) {
  const navigate = useNavigate();
  const user = useContext(UserContext).user;
  const socket = useContext(Context).pongSocket.current;
  const { userChannels, getUserChannels, currentChannel, setChannel, loadingChannel } = chat;

  const [isCreateChannelFormOpen, setIsCreateChannelFormOpen] = useState(false);
  const [isChannelNewPasswordFormOpen, setIsChannelNewPasswordFormOpen] = useState(false);
  const [isBrowseChannelsOpen, setIsBrowseChannelsOpen] = useState(false);
  const [isLeaveChannelFormOpen, setIsLeaveChannelFormOpen] = useState(false);
  const [isInviteToChannelOpen, setIsInviteToChannelOpen] = useState(false);

  function onClickCreateChannel() { setIsCreateChannelFormOpen(!isCreateChannelFormOpen);}
  function onClickBrowseChannels() { setIsBrowseChannelsOpen(!isBrowseChannelsOpen); }
  function onClickChannelSettings() { setIsChannelNewPasswordFormOpen(!isChannelNewPasswordFormOpen); }
  function onClickLeaveChannel() { setIsLeaveChannelFormOpen(!isLeaveChannelFormOpen); }
  function onClickInviteToChannel() { setIsInviteToChannelOpen(!isInviteToChannelOpen); }

  async function leaveChannel() {
    if (!currentChannel || !socket) {
      setIsLeaveChannelFormOpen(false);
      return;
    }
    socket.emit('leave-channel', currentChannel.id, (res: {data: IChannel | null}) => {
      if (res.data) {
        const currentIndex = userChannels.findIndex((channel) => channel.id === currentChannel.id);
        const previousChannel = userChannels[currentIndex - 1];
        const subsequentChannel = userChannels[currentIndex + 1];
        if (previousChannel) {
          setChannel(previousChannel);
        }
        else if (subsequentChannel) {
          setChannel(subsequentChannel);
        }
        else {
          setChannel(undefined);
        }
        getUserChannels();
      }
    });
    setIsLeaveChannelFormOpen(false);
  }

  useEffect(() => {
    getUserChannels();
  }, []);

  return (
    <div className="Channels">
      <h2 className='chat-section-title'>Channels</h2>
      <section className="chat-user-channels">
        <AddIcon
          id="channels-icon-btn"
          fontSize="large"
          titleAccess="Create channel"
          onClick={() => onClickCreateChannel()}
        />
        <SearchIcon
          id="channels-icon-btn"
          fontSize="large"
          titleAccess="Browse channels"
          onClick={() => onClickBrowseChannels()}
        />
        {
          userChannels.map(channel => (
            <div className={`chat-channels ${currentChannel && channel.id === currentChannel.id ? 'selected-channel' : ''}`}
              key={channel.id}
              onClick={() => {
                if (loadingChannel.current) {
                  return ;
                }
                setChannel(channel);
                getUserChannels();
              }}
            > {channel.name}
            </div>
          ))
        }
      </section>
      <section className="chat-user-channel-options">
        {
          currentChannel &&
          <div>
            {
              user && currentChannel.admins.includes(user.id) &&
              <SettingsIcon
              id="channels-icon-btn"
              className="channel-options-btn"
              titleAccess="Channel settings"
              fontSize="large"
              onClick={onClickChannelSettings}
              />
            }
            <ExitToAppIcon
              id="channels-icon-btn"
              className="channel-options-btn"
              titleAccess="Leave channel"
              fontSize="large"
              onClick={onClickLeaveChannel}
            />
            <PersonAddAlt1Icon
              id="channels-icon-btn"
              className="channel-options-btn"
              titleAccess="Invite people"
              fontSize="large"
              onClick={onClickInviteToChannel}
            />
          </div>
        }
        {
          user &&
          <section className="chat-user-info">
            <img id="chat-user-info-avatar"
              src={user.avatar}
              width={40}
              height={40}
              alt={user.username}
              onClick={() => navigate('/profile/' + user.username.toLowerCase())}
              title='See profile'
            />
            <h4>{user.username}</h4>
          </section>
        }
      </section>
      {isCreateChannelFormOpen && <CreateChannelForm setChannel={setChannel} getUserChannels={getUserChannels} onClose={onClickCreateChannel} />}
      {isLeaveChannelFormOpen && <LeaveChannelForm onClose={onClickLeaveChannel} onSubmit={leaveChannel} />}
      {isChannelNewPasswordFormOpen && <ChannelNewPasswordForm onClose={onClickChannelSettings} currentChannel={currentChannel} />}
      {isBrowseChannelsOpen && <BrowseChannels chat={chat} onClose={onClickBrowseChannels}/>}
      {isInviteToChannelOpen && <InviteToChannel currentChannel={currentChannel} onClose={onClickInviteToChannel} />}
    </div>
  )
}

export default Channels;
