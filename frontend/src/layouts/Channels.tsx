// import { useEffect, useState } from "react";
// import { IUser } from "../types/IUser";
// import { IChannel } from "../types/IChannel";
// import { CHAT_BROWSE_CHANNEL_ICON, CHAT_GEAR_ICON, CHAT_LEAVE_CHANNEL_ICON } from "../constants";
// import CreateChannelForm from "./CreateChannelForm";
// import ChannelNewPasswordForm from "./ChannelNewPasswordForm";
// import './style/Channels.css'
// import Request from "../components/Request";
// import BrowseChannels from "./BrowseChannels";

// interface ChannelsProps {
// 	user: IUser;
// 	channels: IChannel[];
// 	setChannels: (arg0: IChannel[]) => void;
// 	currentChannel: IChannel | undefined;
// 	setChannel: (channelId: IChannel | undefined) => void;
// }

// function Channels({ user, channels, setChannels, currentChannel, setChannel }: ChannelsProps) {
// 	const [isCreateChannelFormOpen, setIsCreateChannelFormOpen] = useState(false);
// 	const [isChannelNewPasswordFormOpen, setIsChannelNewPasswordFormOpen] = useState(false);
// 	const [isBrowseChannelsOpen, setIsBrowseChannelsOpen] = useState(false);
// 	const [ChanneSettingslInputValue, setChanneSettingslInputValue] = useState("");
// 	const [allChannels, setAllChannels] = useState<IChannel[]>([]);

// 	function onClickCreateChannel() { setIsCreateChannelFormOpen(!isCreateChannelFormOpen); }
// 	function onClickChannelSettings() { setIsChannelNewPasswordFormOpen(!isChannelNewPasswordFormOpen); }
// 	function onClickBrowseChannels() { setIsBrowseChannelsOpen(!isBrowseChannelsOpen); }

// 	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
// 		setChanneSettingslInputValue(e.target.value);
// 	}

// 	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
// 		if (e.key === 'Enter') {
// 			e.preventDefault();
// 		}
// 	}

// 	function inviteUser(): void {

// 	}

// 	function kickUser(): void {

// 	}

// 	function muteUser(): void {
// 		console.log('muteUser');
// 	}

// 	function banUser(): void {
// 		console.log('banUser');

// 	}

// 	function unBanUser(): void {

// 	}

// 	function adminUser(): void {
// 		console.log('adminUser');

// 	}

// 	function changePassword(): void {
// 		console.log('changePassword');
// 	}

// 	function leaveChannel(): void {
// 		if (!currentChannel) {
// 			return;
// 		}
// 		Request.leaveChannel(currentChannel.id).then(() => {
// 			refresh();
// 		});
// 		const currentIndex = channels.findIndex((channel) => channel.id === currentChannel.id);
// 		const previousChannel = channels[currentIndex - 1];
// 		const subsequentChannel = channels[currentIndex + 1];
// 		let newChannelId = -1;
// 		if (previousChannel) {
// 			setChannel(previousChannel);
// 		} else if (subsequentChannel) {
// 			setChannel(subsequentChannel);
// 		}
// 	}

// 	async function refresh() {
// 		console.log('refresh');
// 		Request.getAllChannels().then((res) => {
// 			if (res)
// 				setAllChannels(res);
// 		});
// 		Request.getUserChannels().then(res => {
// 			if (res)
// 				setChannels(res);
// 		});
// 	}

// 	function browseChannels() {
// 		console.log("user.userChannels: ", user.userChannels);
// 		setIsBrowseChannelsOpen(!isBrowseChannelsOpen);
// 		refresh();
// 	}

// 	return (
// 		<>
// 			<div className="div-channels">
// 				<h1>Channels</h1>
// 				<div className="div-channels-list">
// 					<button
// 						className="btn-channels-create"
// 						onClick={() => onClickCreateChannel()}
// 					>+</button>
// 					{channels && channels.map((channel, index) => (
// 						<button
// 							className={currentChannel && channel.id === currentChannel.id ? 'btn-channels-current' : 'btn-channels'}
// 							onClick={() => setChannel(channel)}
// 							key={index}>
// 							{channel.name}
// 						</button>
// 					))}
// 				</div>
// 				<div
// 					className="user-tag">
// 					<img
// 						id="avatar-component"
// 						width={40}
// 						height={40}
// 						src={user.avatar} />
// 					<b><p
// 						className="p-username"
// 					>{user.username}</p></b>
// 				</div>
// 				<div className="div-btns">
// 					<button
// 						disabled={currentChannel && currentChannel.id === -1}
// 						className="btn-channels-settings"
// 						onClick={onClickChannelSettings}
// 					>
// 						<img
// 							className="btn-channels-settings-img"
// 							src={CHAT_GEAR_ICON} />
// 					</button>
// 					<button
// 						className="btn-channels-settings"
// 						onClick={browseChannels}
// 					>
// 						<img
// 							className="btn-channels-settings-img"
// 							src={CHAT_BROWSE_CHANNEL_ICON} />
// 					</button>
// 					<button
// 						className="btn-channels-settings"
// 						onClick={leaveChannel}
// 					>
// 						<img
// 							className="btn-channels-settings-img"
// 							src={CHAT_LEAVE_CHANNEL_ICON} />
// 					</button>
// 				</div>
// 			</div>
// 			{isCreateChannelFormOpen && <CreateChannelForm onClose={onClickCreateChannel} />}
// 			{isChannelNewPasswordFormOpen && <ChannelNewPasswordForm onClose={onClickChannelSettings} currentChannel={currentChannel} />}
// 			{isBrowseChannelsOpen && <BrowseChannels
// 				onClose={onClickBrowseChannels}
// 				allChannels={allChannels}
// 				refresh={refresh}
// 				user={user}
// 				setChannels={setChannels}
// 				currentChannel={currentChannel}
// 				setChannel={setChannel} />}
// 		</>
// 	);
// }

import "./style/Channels.css"
import CreateChannelForm from "./CreateChannelForm";
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LeaveChannelForm from "./LeaveChannelForm";
import Request from "../components/Request";
import ChannelNewPasswordForm from "./ChannelNewPasswordForm";
import BrowseChannels from "./BrowseChannels";
import { IChannel } from "../types";
import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import { Context, UserContext } from "../context";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import InviteToChannel from "./InviteToChannel";

interface ChannelsProps {
  getUserChannels: () => void,
  userChannels: IChannel[],
  setUserChannels: (arg0: IChannel[]) => void;
  setChannel: (channel: IChannel | undefined) => void;
}

function Channels({
  getUserChannels,
  userChannels,
  setChannel,
}: ChannelsProps) {
  const navigate = useNavigate();
  const user = useContext(UserContext).user;
  const socket = useContext(Context).pongSocket.current;
  const { currentChannel } = useContext(Context);
  const [isCreateChannelFormOpen, setIsCreateChannelFormOpen] = useState(false);
  const [isChannelNewPasswordFormOpen, setIsChannelNewPasswordFormOpen] = useState(false);
  const [isBrowseChannelsOpen, setIsBrowseChannelsOpen] = useState(false);
  const [isLeaveChannelFormOpen, setIsLeaveChannelFormOpen] = useState(false);
  const [isInviteToChannelOpen, setIsInviteToChannelOpen] = useState(false);

  function onClickCreateChannel() { setIsCreateChannelFormOpen(!isCreateChannelFormOpen); }
  function onClickBrowseChannels() { setIsBrowseChannelsOpen(!isBrowseChannelsOpen); }
  function onClickChannelSettings() { setIsChannelNewPasswordFormOpen(!isChannelNewPasswordFormOpen); }
  function onClickLeaveChannel() { setIsLeaveChannelFormOpen(!isLeaveChannelFormOpen); }
  function onClickInviteToChannel() { setIsInviteToChannelOpen(!isInviteToChannelOpen); }

  function leaveChannel(): void {
    if (!currentChannel) {
      return;
    }
    Request.leaveChannel(currentChannel.id).then(res => {
      if (res) {
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
      }
    });
    setIsLeaveChannelFormOpen(false);
  }

  return (
    <div className="Channels">
      <h2 className='chat-section-title'>Channels</h2>
      <section className="chat-user-channels">
        <AddIcon
          id="channels-icon-btn"
          fontSize="large"
          onClick={() => onClickCreateChannel()}
        />
        <SearchIcon
          id="channels-icon-btn"
          fontSize="large"
          onClick={() => onClickBrowseChannels()}
        />
        {
          userChannels.map(channel => (
            <div className={`chat-channels ${currentChannel && channel.id === currentChannel.id ? 'selected-channel' : ''}`}
              key={channel.id}
              onClick={() => setChannel(channel)}
            > {channel.name}
            </div>
          ))
        }
      </section>
      <section className="chat-user-channel-options">
        {
          currentChannel &&
          <div>
            <SettingsIcon
              id="channels-icon-btn"
              className="channel-options-btn"
              titleAccess="Channel settings"
              fontSize="large"
              onClick={onClickChannelSettings}
            />
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
      {isCreateChannelFormOpen && <CreateChannelForm setChannel={setChannel} onClose={onClickCreateChannel} />}
      {isLeaveChannelFormOpen && <LeaveChannelForm onClose={onClickLeaveChannel} onSubmit={leaveChannel} />}
      {isChannelNewPasswordFormOpen && <ChannelNewPasswordForm onClose={onClickChannelSettings} currentChannel={currentChannel} />}
      {isBrowseChannelsOpen && <BrowseChannels
          onClose={onClickBrowseChannels}
          getUserChannels={getUserChannels}
          currentChannel={currentChannel}
          setChannel={setChannel}
        />
      }
      {isInviteToChannelOpen && <InviteToChannel onClose={onClickInviteToChannel} />

      }
    </div>
  )
}

export default Channels
