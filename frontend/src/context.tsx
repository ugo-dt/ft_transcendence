import { createContext } from 'react';
import { Socket }from 'socket.io-client'
import { IUser } from './types';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

interface ContextValue {
  serverUrl: string,
  pongSocket: React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null>
  loadingSocket: boolean,
  setLoadingSocket: React.Dispatch<React.SetStateAction<boolean>>,
}

export const Context = createContext<ContextValue>({
  serverUrl: "",
  pongSocket: {} as React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null>,
  loadingSocket: false,
  setLoadingSocket: () => {},
});

interface AuthContextValue {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

export const UserContext = createContext<AuthContextValue>({user: null, setUser: () => {}});