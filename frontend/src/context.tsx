import { createContext } from 'react';
import { Socket } from 'socket.io-client'
import { IChannel, IUser } from './types';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { IMessage } from './types/IMessage';

interface ContextValue {
  serverUrl: string,
  pongSocket: React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null>
  loading: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
}

export const Context = createContext<ContextValue>({
  serverUrl: "",
  pongSocket: {} as React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null>,
  loading: false,
  setLoading: () => {},
});

interface AuthContextValue {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

export const UserContext = createContext<AuthContextValue>({ user: null, setUser: () => { } });

interface QueueContextValue {
  inQueue: boolean,
  setInQueue: React.Dispatch<React.SetStateAction<boolean>>
  queueTimer: { minutes: number, seconds: number },
  setQueueTimer: React.Dispatch<React.SetStateAction<{ minutes: number; seconds: number; }>>,
  queueInterval: React.MutableRefObject<number | undefined>,
}

export const QueueContext = createContext<QueueContextValue>({
  inQueue: false,
  setInQueue: () => {},
  queueTimer: { minutes: 0, seconds: 0 },
  setQueueTimer: () => {},
  queueInterval: {} as React.MutableRefObject<number | undefined>,
});

// interface ChatContextValue {
//   userChannels: IChannel[],
//   currentChannel: IChannel | undefined,
//   setCurrentChannel: React.Dispatch<React.SetStateAction<IChannel | undefined>>,
//   setChannel: (channel: IChannel | undefined) => void,
//   channelUsers: IUser[],
//   getChannelUsers: () => void,
//   channelMessages: IMessage[],
//   getChannelMessages: (messageIds: number[]) => void,
//   channelSenders: Map<number, IUser>,
// }

// export const ChatContext = createContext<ChatContextValue>({
//   userChannels: [],
//   currentChannel: undefined,
//   setCurrentChannel: () => {},
//   setChannel: () => {},
//   channelUsers: [],
//   getChannelUsers: () => {},
//   channelMessages: [],
//   getChannelMessages: () => {},
//   channelSenders: new Map(),
// });