import { useContext, useEffect, useState } from "react";
import { IChannel } from "../types";
import './style/BrowseChannels.css'
import JoinPasswordForm from "./JoinPasswordForm";
import Request from "./Request";
import { UserContext } from "../context";
import RefreshIcon from '@mui/icons-material/Refresh';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface BrowseChannelsProps {
  onClose: () => void,
  getUserChannels: () => void,
  setChannel: (channel: IChannel | undefined) => void,
}

function BrowseChannels({ onClose, getUserChannels, setChannel }: BrowseChannelsProps) {
  const user = useContext(UserContext).user;
  const [isJoinPasswordOpen, setIsJoinPasswordOpen] = useState(false);
  const [channels, setChannels] = useState<IChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);

  function onClickJoinPassword() { setIsJoinPasswordOpen(!isJoinPasswordOpen); getChannels(); }

  function joinChannel(channel: IChannel) {
    if (!channel || !user) {
      return;
    }
    if (!channel.users.includes(user.id) && !channel.banned.includes(user.id)) {
      if (!channel.password.length) {
        setIsJoinPasswordOpen(true);
        Request.joinChannel(channel.id, '').then(res => {
          if (res) {
            setChannel(channel);
            getUserChannels();
            onClose();
          }
        });
      }
      else {
        setSelectedChannel(channel);
        setIsJoinPasswordOpen(true);
      }
    }
    getChannels();
  }

  async function getChannels() {
    Request.getAllChannels().then(res => {
      if (res) {
        setChannels(res);
      }
    });
  }

  useEffect(() => {
    getChannels();
  }, []);

  return (
    <div className="browse-channels">
      <h1>Browse Channels</h1>
      <RefreshIcon onClick={getChannels} id="browse-refresh-btn" fontSize="large" titleAccess="Refresh channels"/>
      <div className="modal-close" role="button" onClick={onClose}>&times;</div>
      <div className="browse-channels-list">
        {
          channels.length &&
          channels.map((channel, index) => (
            <div
              key={index}
              className='browse-channels-btn'
              onClick={() => joinChannel(channel)}
            > {channel.name} - &#x1F464; {channel.users.length} {channel.password.length ? '\u{1F512}' : ''}
              {user && channel.banned.includes(user.id) && <RemoveCircleOutlineIcon style={{marginLeft: '5px'}} color="error"/>}
              {user && channel.users.includes(user.id) && <CheckCircleOutlineIcon style={{marginLeft: '5px'}} color="success"/>}
            </div>
          )) || <h3>No channels.</h3>
        }
      </div>
      {
        selectedChannel && isJoinPasswordOpen && <JoinPasswordForm
        onClose={onClickJoinPassword}
        channel={selectedChannel}
        setChannel={setChannel}
        setIsJoinPasswordOpen={setIsJoinPasswordOpen}
        getUserChannels={getUserChannels}
      />}
    </div>
  );
}

export default BrowseChannels;