import { createContext } from 'react';
import { Socket }from 'socket.io-client'

interface ContextValue {
  serverUrl: string,
  socketRef: React.MutableRefObject<Socket>,
}

export const Context = createContext<ContextValue>({
  serverUrl: "",
  socketRef: {} as React.MutableRefObject<Socket>,
});
