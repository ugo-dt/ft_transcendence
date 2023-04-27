import './App.css'
import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Context, QueueContext, UserContext } from './context'
import { Socket, io } from 'socket.io-client'
import { CssBaseline } from '@mui/material'
import { IUser } from './types'
import Navbar from './layouts/Navbar'
import axios from "axios";
import { DefaultEventsMap } from '@socket.io/component-emitter'
import Request from './components/Request'

// todo: document.title = "ft_transcendence - Chat";

function App() {
  const serverUrl = "http://192.168.1.136:3000";
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [lostConnection, setLostConnection] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [inQueue, setInQueue] = useState(false);
  const [queueTimer, setQueueTimer] = useState({ minutes: 0, seconds: 0 });
  const queueInterval = useRef<number | undefined>(undefined);

  const { minutes, seconds } = queueTimer;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const contextValue = {
    serverUrl: serverUrl,
    pongSocket: socket,
    socketConnected: socketConnected,
    setSocketConnected: setSocketConnected,
  };

  const queueContextValue = {
    inQueue: inQueue,
    setInQueue: setInQueue,
    queueTimer: queueTimer,
    setQueueTimer: setQueueTimer,
    queueInterval: queueInterval,
  }

  async function connect(data: IUser) {
    if (socket.current && socket.current.connected) {
      return;
    }
    socket.current = io(serverUrl + '/app', {
      autoConnect: false,
      query: data,
    });
    if (socket) {
      socket.current.on('connect', onConnect);
      socket.current.on('disconnect', onDisconnect);
      socket.current.connect();
    }
  }

  async function onConnect() {
    console.log(`Connected to ${serverUrl}.`);
    setTimeout(() => {
      setSocketConnected(true);
    }, 100);
  }

  function onDisconnect() {
    console.log(`Disconnected from ${serverUrl}.`);
    setSocketConnected(false);
    setLostConnection(true);
  }

  useEffect(() => {
    Request.me().then(res => {
      if (res) {
        connect(res);
        setUser(res);
      }
    }).catch(err => {
      if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") {
        console.error("Request has been canceled!");
      } else {
        console.error(err);
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current.removeAllListeners();
      }
    };
  }, []);

  return (
    <div className="App">
      <CssBaseline />
      <UserContext.Provider value={{ user, setUser }}>
        <Navbar />
        {
          lostConnection && user && !socketConnected &&
          <div className="alert-disconnected">
            <h3>
              You are disconnected. Please refresh the page.
            </h3>
          </div>
        }
        <Context.Provider value={contextValue}>
          <QueueContext.Provider value={queueContextValue}>
          <Outlet />
          {
            inQueue && (
              <div className="timer-overlay">
                <h3 id="timer">Queue</h3>
                <h4>{formattedTime}</h4>
                <button
                  style={{
                    padding: '5px',
                    fontWeight: 'bolder',
                  }}
                  onClick={() => {
                  if (!socket.current || !socket.current.connected) {
                    return ;
                  }
                  setInQueue(false);
                  window.clearInterval(queueInterval.current);
                  queueInterval.current = undefined;
                  setQueueTimer({minutes: 0, seconds: 0});
                }}> Cancel
                </button>
              </div>
            )
          }
          </QueueContext.Provider>
        </Context.Provider>
      </UserContext.Provider>
    </div>
  )
}

export default App;