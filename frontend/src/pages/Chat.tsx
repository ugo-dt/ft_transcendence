import { useContext, useEffect, useState } from 'react';
import { Context, UserContext } from '../context';
import { IChannel, IUser } from '../types';
import Request from '../components/Request';
import Channels from '../layouts/Channels';
import ChatWindow from '../layouts/ChatWindow';
import UserList from '../layouts/UserList';
import './style/Chat.css';
import { IMessage } from '../types/IMessage';

/**
 * todo
 * 
 * fix create channel -> no update
 * leave room after kick
 * join room when click on channel 
 */

export function useChat(): {
  userChannels: IChannel[],
  getUserChannels: () => Promise<void>,
  currentChannel: IChannel | undefined,
  setCurrentChannel: React.Dispatch<React.SetStateAction<IChannel | undefined>>,
  setChannel: (channel: IChannel | undefined) => void,
  channelUsers: IUser[],
  getChannelUsers: () => void,
  channelMessages: IMessage[],
  getChannelMessages: (messageIds: number[]) => void,
  channelSenders: Map<number, IUser>,
} {
  const socket = useContext(Context).pongSocket;
  const user = useContext(UserContext).user;
  const [userChannels, setUserChannels] = useState<IChannel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<IChannel | undefined>(undefined);
  const [channelUsers, setChannelUsers] = useState<IUser[]>([]);
  const [channelMessages, setChannelMessages] = useState<IMessage[]>([]);
  const [channelSenders, setChannelSenders] = useState<Map<number, IUser>>(new Map());
  const [inRoom, setInRoom] = useState<boolean>(false);

  async function getChannelUsers() {
    if (!currentChannel) {
      setChannelUsers([]);
      return;
    }
    setChannelUsers(await Request.getChannelUsers(currentChannel.id));
  }

  async function getUserChannels() {
    Request.getUserChannels().then(res => {
      if (res) {
        setUserChannels(res);
      }
    });
  }

  function setChannel(channel: IChannel | undefined) {
    if (channel && currentChannel && channel.id === currentChannel.id) {
      return;
    }
    if (currentChannel && socket.current && inRoom) {
      console.log("leave");
      socket.current.emit('leave-channel-room', currentChannel.id);
      setInRoom(false);
    }
    setCurrentChannel(channel);
  }

  async function getChannelMessages(messageIds: number[]) {
    const messagesData: IMessage[] = [];
    for (const id of messageIds.values()) {
      const message = await Request.getMessage(id);
      if (message) {
        messagesData.push(message);
      }
    }
    setChannelMessages(messagesData);
    const senders: Map<number, IUser> = new Map();
    for (const message of messagesData.values()) {
      const sender = await Request.getProfileFromId(message.senderId);
      if (sender) {
        senders.set(message.senderId, sender);
      }
    }
    setChannelSenders(senders);
  }

  function onNewMessage(data: IChannel) {
    getChannelMessages(data.messages);
  }

  function onChannelUpdate(data: IChannel) {
    if (user && !data.users.includes(user.id)) {
      setCurrentChannel(undefined);
      return;
    }
    setCurrentChannel(data);
  }

  function onLeaveChannel() {
    if (!currentChannel) {
      return;
    }
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
  
  function onNewChannel(channel: IChannel) {
    console.log("new chaneneenenen");
    
    getUserChannels();
    if (currentChannel && socket.current && inRoom) {
      getChannelMessages(currentChannel.messages);
      getChannelUsers();
    }
  }

  useEffect(() => {
    if (!currentChannel) {
      setChannelUsers([]);
      setChannelMessages([]);
      setChannelSenders(new Map());
      return ;
    }
    getChannelUsers();
    getChannelMessages(currentChannel.messages);

    if (socket.current && !inRoom) {
      console.log("join");
      
      socket.current.emit('join-channel-room', currentChannel.id);
      setInRoom(true);
    }
  }, [currentChannel]);

  useEffect(() => {
    if (!socket.current) {
      return ;
    }
    getUserChannels();
    socket.current.on('new-message', onNewMessage);
    socket.current.on('leave-channel', onLeaveChannel);
    socket.current.on('channel-update', onChannelUpdate);
    socket.current.on('new-channel', onNewChannel);

    return () => {
      if (socket.current) {
        socket.current.off('new-message', onNewMessage);
        socket.current.off('leave-channel', onLeaveChannel);
        socket.current.off('channel-update', onChannelUpdate);
        socket.current.off('new-channel', onNewChannel);
      }
    }
  }, []);

  return ({
    userChannels,
    getUserChannels,
    currentChannel,
    setCurrentChannel,
    setChannel,
    channelUsers,
    getChannelUsers,
    channelMessages,
    getChannelMessages,
    channelSenders,
  })
}

function Chat() {
  const [loading, setLoading] = useState(true);
  const chat = useChat();
  document.title = "ft_transcendence - Chat";

  async function init() {
    setLoading(true);
    await chat.getUserChannels();
    setLoading(false);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="chat">
      {
        loading ? (<h2>Loading...</h2>) : (
          <>
            <Channels chat={chat} />
            <ChatWindow chat={chat} />
            <UserList chat={chat}/>
          </>
        )
      }
    </div>
  );
}

export default Chat;