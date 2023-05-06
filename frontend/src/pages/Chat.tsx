import { useContext, useEffect, useRef, useState } from 'react';
import { Context, UserContext } from '../context';
import { IChannel, IUser } from '../types';
import Request from '../components/Request';
import Channels from '../layouts/Channels';
import ChatWindow from '../layouts/ChatWindow';
import UserList from '../layouts/UserList';
import { IMessage } from '../types/IMessage';
import './style/Chat.css';

export interface IChat {
  userChannels: IChannel[],
  getUserChannels: () => Promise<void>,
  currentChannel: IChannel | undefined,
  setCurrentChannel: React.Dispatch<React.SetStateAction<IChannel | undefined>>,
  setChannel: (channel: IChannel | undefined) => void,
  channelUsers: IUser[],
  getChannelUsers: () => Promise<void>,
  channelMessages: IMessage[],
  getChannelMessages: (messageIds: number[]) => Promise<void>,
  channelSenders: Map<number, IUser>,
}

export function useChat(): IChat {
  const socket = useContext(Context).pongSocket;
  const user = useContext(UserContext).user;
  const [userChannels, setUserChannels] = useState<IChannel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<IChannel | undefined>(undefined);
  const currentChannelRef = useRef<IChannel | undefined>(undefined);
  const [channelUsers, setChannelUsers] = useState<IUser[]>([]);
  const [channelMessages, setChannelMessages] = useState<IMessage[]>([]);
  const [channelSenders, setChannelSenders] = useState<Map<number, IUser>>(new Map());
  const inRoom = useRef<boolean>(false);

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
    if (currentChannel && socket.current && inRoom.current) {
      socket.current.emit('leave-channel-room', currentChannel.id);
      inRoom.current = false;
    }
    currentChannelRef.current = channel;
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

  function onChannelUpdate(data: IChannel) {
    if (user && !data.users.includes(user.id)) {
      setCurrentChannel(undefined);
      return;
    }
    setCurrentChannel(data);
  }

  function onKickedFromChannel(channelId: number) {
    getUserChannels();
    if (currentChannelRef.current && currentChannelRef.current.id === channelId) {
      setChannel(undefined);
    }
  }
  
  function onNewChannel(channel: IChannel) {
    getUserChannels();
    if (currentChannelRef.current && socket.current && inRoom.current) {
      getChannelMessages(currentChannelRef.current.messages);
      getChannelUsers();
    }
  }

  useEffect(() => {
    if (!currentChannel) {
      setChannelUsers([]);
      setChannelMessages([]);
      setChannelSenders(new Map());
      if (inRoom.current) {
        inRoom.current = false;
      }
      return ;
    }
    getChannelUsers();
    getChannelMessages(currentChannel.messages);
    if (socket.current && !inRoom.current) {
      socket.current.emit('join-channel-room', currentChannel.id);
      inRoom.current = true;
    }
  }, [currentChannel]);

  useEffect(() => {
    if (!socket.current) {
      return ;
    }
    getUserChannels();
    socket.current.on('kicked-from-channel', onKickedFromChannel);
    socket.current.on('channel-update', onChannelUpdate);
    socket.current.on('new-channel', onNewChannel);

    return () => {
      if (socket.current) {
        socket.current.off('kicked-from-channel', onKickedFromChannel);
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