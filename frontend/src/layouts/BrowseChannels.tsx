import { useContext, useEffect, useState } from "react";
import { IChannel } from "../types";
import './style/BrowseChannels.css'
import JoinPasswordForm from "./JoinPasswordForm";
import Request from "../components/Request";
import { UserContext } from "../context";
import RefreshIcon from '@mui/icons-material/Refresh';

export const EMPTY: string = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

interface BrowseChannelsProps {
  onClose: () => void,
  getUserChannels: () => void,
  currentChannel: IChannel | undefined,
  setChannel: (channel: IChannel | undefined) => void,
}

function BrowseChannels({ onClose, getUserChannels, currentChannel, setChannel }: BrowseChannelsProps) {
  const user = useContext(UserContext).user;
  const [isJoinPasswordOpen, setIsJoinPasswordOpen] = useState(false);
  const [channels, setChannels] = useState<IChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);

  function onClickJoinPassword() { setIsJoinPasswordOpen(!isJoinPasswordOpen); getChannels(); }

  function joinChannel(channel: IChannel) {
    if (!channel || !user) {
      return;
    }
    if (!channel.users.includes(user.id)) {
      if (!channel.password.length) {
        setIsJoinPasswordOpen(true);
        Request.joinChannel(channel.id, '').then(res => {
          if (res) {
            setChannel(channel);
          }
        });
        onClose();
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