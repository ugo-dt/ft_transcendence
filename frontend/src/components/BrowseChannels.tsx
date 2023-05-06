import { useContext, useEffect, useState } from "react";
import { IChannel } from "../types";
import './style/BrowseChannels.css'
import JoinPasswordForm from "./JoinPasswordForm";
import Request from "./Request";
import { Context, UserContext } from "../context";
import RefreshIcon from '@mui/icons-material/Refresh';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { IChat } from "../pages/Chat";

interface BrowseChannelsProps {
  onClose: () => void,
  chat: IChat,
}

function BrowseChannels({ onClose, chat }: BrowseChannelsProps) {
  const user = useContext(UserContext).user;
  const socket = useContext(Context).pongSocket;
  const [isJoinPasswordOpen, setIsJoinPasswordOpen] = useState(false);
  const [allChannels, setAllChannels] = useState<IChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);
  const { setChannel, getUserChannels } = chat;

  function onClickJoinPassword() { setIsJoinPasswordOpen(!isJoinPasswordOpen); getChannels(); }

  function joinChannel(selectedChannel: IChannel) {
    if (!selectedChannel || !user) {
      return;
    }
    if (!selectedChannel.users.includes(user.id) && !selectedChannel.banned.includes(user.id)) {
      if (!selectedChannel.password.length) {
        setIsJoinPasswordOpen(true);
        if (socket.current) {
          socket.current.emit('join-channel', { id: selectedChannel.id, password: '' }, (res: {data: IChannel}) => {
            if (res.data) {
              getUserChannels();
              onClose();
              setChannel(res.data);
            }
          });
        }
      }
      else {
        setSelectedChannel(selectedChannel);
        setIsJoinPasswordOpen(true);
      }
    }
    getChannels();
  }

  async function getChannels() {
    setAllChannels(await Request.getAllChannels());
  }

  useEffect(() => {
    getChannels();
  }, []);

  return (
    <div className="browse-channels">
      <h1>Browse Channels</h1>
      <RefreshIcon onClick={getChannels} id="browse-refresh-btn" fontSize="large" titleAccess="Refresh channels" />
      <div className="modal-close" role="button" onClick={onClose}>&times;</div>
      <div className="browse-channels-list">
        {
          allChannels.length &&
          allChannels.map((channel, index) => (
            <div
              key={index}
              className='browse-channels-btn'
              onClick={() => joinChannel(channel)}
            > {channel.name} - &#x1F464; {channel.users.length} {channel.password.length ? '\u{1F512}' : ''}
              {user && channel.banned.includes(user.id) && <RemoveCircleOutlineIcon style={{ marginLeft: '5px' }} color="error" />}
              {user && channel.users.includes(user.id) && <CheckCircleOutlineIcon style={{ marginLeft: '5px' }} color="success" />}
            </div>
          )) || <h3>No channels.</h3>
        }
      </div>
      {
        selectedChannel && isJoinPasswordOpen && <JoinPasswordForm chat={chat}
          onClose={onClickJoinPassword}
          selectedChannel={selectedChannel}
        />}
    </div>
  );
}

export default BrowseChannels;