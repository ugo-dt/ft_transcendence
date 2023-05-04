import { useContext, useEffect, useState } from 'react';
import { Context, UserContext } from '../context';
import { IChannel, IUser } from '../types';
import Request from '../components/Request';
import Channels from '../layouts/Channels';
import ChatWindow from '../layouts/ChatWindow';
import UserList from '../layouts/UserList';
import './style/Chat.css';
import { IMessage } from '../types/IMessage';

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
      socket.current.emit('leave-channel-room', currentChannel.id);
      setInRoom(false);
    }
    setCurrentChannel(channel);
    getChannelUsers();
  }

  async function getChannelMessages(messageIds: number[]) {
    const messagesData: IMessage[] = [];
    for (const id of messageIds.values()) {
      if (channelMessages.find(m => m.id === id)) {
        continue ;
      }
      const message = await Request.getMessage(id);
      if (message) {
        messagesData.push(message);
      }
    }
    setChannelMessages(messagesData);
    const senders: Map<number, IUser> = new Map();
    for (const message of messagesData.values()) {
      if (senders.has(message.senderId)) {
        continue;
      }
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

  useEffect(() => {
    if (!socket.current || !currentChannel) {
      setChannelMessages([]);
      setChannelUsers([]);
      setChannelSenders(new Map());
      return ;
    }
    getChannelUsers();
    getChannelMessages(currentChannel.messages);
    getUserChannels();

    if (currentChannel && !inRoom) {
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
    socket.current.on('channel-update', onChannelUpdate);

    return () => {
      if (socket.current) {
        socket.current.off('new-message', onNewMessage);
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