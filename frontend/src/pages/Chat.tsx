import { useContext, useEffect, useState } from 'react';
import { Context, UserContext } from '../context';
import { IChannel, IUser } from '../types';
import Request from '../components/Request';
import Channels from '../layouts/Channels';
import ChatWindow from '../layouts/ChatWindow';
import UserList from '../layouts/UserList';
import './style/Chat.css';

/**
 * test invite
 * 
 * update on user join
 * 
 * update on kick
 */

function Chat() {
  const [loading, setLoading] = useState(true);
  const socket = useContext(Context).pongSocket.current;
  const user = useContext(UserContext).user;
  const { currentChannel, setCurrentChannel } = useContext(Context);
  const [userChannels, setUserChannels] = useState<IChannel[]>([]);
  const [channelUsers, setChannelUsers] = useState<IUser[]>([]);
  const [inRoom, setInRoom] = useState(false);
  document.title = "ft_transcendence - Chat";

  function setChannel(channel: IChannel | undefined) {
    if (channel && currentChannel && channel.id === currentChannel.id) {
      return ;
    }
    if (currentChannel && socket && inRoom) {
      console.log("leave room");
      socket.emit('leave-channel-room', currentChannel.id);
      setInRoom(false);
    }
    setCurrentChannel(channel);
  }

  async function getChannelUsers() {
    if (!currentChannel) {
      return;
    }
    setChannelUsers(await Request.getChannelUsers(currentChannel.id));
  }

  async function getUserChannels() {
    setLoading(true);
    Request.getUserChannels().then(res => {
      if (res) {
        setUserChannels(res);
      }
    });
    setLoading(false);
  }

  function onChannelUpdate(data: IChannel) {
    if (user && !data.users.includes(user.id)) {
      console.log(data);
      
      setCurrentChannel(undefined);
      return;
    }
    setCurrentChannel(data);
  }

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('channel-update', onChannelUpdate);
    
    if (currentChannel && !inRoom) {
      console.log("join room");
      socket.emit('join-channel-room', currentChannel.id);
      setInRoom(true);
    }
    getUserChannels();
    getChannelUsers();

    return () => {
      socket.off('channel-update', onChannelUpdate);
    }
  }, [currentChannel]);

  return (
    <div className="chat">
      {
        loading ? (<h2>Loading...</h2>) : (
          <>
            <Channels
              getUserChannels={getUserChannels}
              userChannels={userChannels}
              setUserChannels={setUserChannels}
              setChannel={setChannel}
            />
            <ChatWindow
              channelUsers={channelUsers}
              getChannelUsers={getChannelUsers}
            />
            <UserList
              currentChannel={currentChannel}
              channelUsers={channelUsers}
            />
          </>
        )
      }
    </div>
  );
}

export default Chat;