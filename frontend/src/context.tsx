import { createContext } from 'react';
import { Socket }from 'socket.io-client'
import { IClient } from './types';

interface ContextValue {
  serverUrl: string,
  pongSocketRef: React.MutableRefObject<Socket>,
  client: IClient,
  setClient: React.Dispatch<React.SetStateAction<IClient>>,
}

export const Context = createContext<ContextValue>({
  serverUrl: "",
  pongSocketRef: {} as React.MutableRefObject<Socket>,
  client: {} as IClient,
  setClient: {} as React.Dispatch<React.SetStateAction<IClient>>
});
