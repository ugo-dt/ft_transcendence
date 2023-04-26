import { createContext } from 'react';
import { Socket } from 'socket.io-client'
import { IUser } from './types';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

interface ContextValue {
  serverUrl: string,
  pongSocket: React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null>
}

export const Context = createContext<ContextValue>({
  serverUrl: "",
  pongSocket: {} as React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null>,
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