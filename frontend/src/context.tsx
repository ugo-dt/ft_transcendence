import { createContext } from 'react';
import { Socket }from 'socket.io-client'

interface ContextValue {
  serverUrl: string,
  pongSocketRef: React.MutableRefObject<Socket>,
}

export const Context = createContext<ContextValue>({
  serverUrl: "",
  pongSocketRef: {} as React.MutableRefObject<Socket>,
});
