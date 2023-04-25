import './App.css'
import { useContext, useEffect, useRef, useState } from 'react'
import { Link, Navigate, Outlet, redirect, useNavigate, useSearchParams } from 'react-router-dom'
import { Context, QueueContext, UserContext } from './context'
import { Socket, io } from 'socket.io-client'
import { CssBaseline } from '@mui/material'
import { IUser } from './types'
import Navbar from './layouts/Navbar'
import axios from "axios";
import { DefaultEventsMap } from '@socket.io/component-emitter'
import Request from './components/Request'

// todo: document.title = "ft_transcendence - Chat";

function QueueTimer() {
  const socket = useContext(Context).pongSocket;
  const { inQueue, setInQueue, queueTimer, setQueueTimer, queueInterval } = useContext(QueueContext);

  const { minutes, seconds } = queueTimer;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="QueueTimer">
      {
        inQueue &&
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
                return;
              }
              setInQueue(false);
              window.clearInterval(queueInterval.current);
              queueInterval.current = undefined;
              setQueueTimer({ minutes: 0, seconds: 0 });
            }}> Cancel
          </button>
        </div>
      }
    </div>
  );
}

function App() {
  const serverUrl = "http://192.168.1.178:3000";
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [lostConnection, setLostConnection] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [inQueue, setInQueue] = useState(false);
  const [queueTimer, setQueueTimer] = useState({ minutes: 0, seconds: 0 });
  const queueInterval = useRef<number | undefined>(undefined);
  const navigate = useNavigate();
  const [parameters] = useSearchParams();

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
    socket.current = io(serverUrl + '/pong', {
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
    if (parameters.get("code")) {
      Request.signIn(parameters.get("code")).then(res => {
        navigate("/home");
        window.location.reload();
      }).catch(err => {
        if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") {
          console.error("Request has been canceled!");
        } else {
          console.error(err);
        }
      });
    }
    Request.me().then(res => {
      if (res) {
        connect(res);
        setUser(res);
      }
      else {
        navigate("/home");
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
        <Context.Provider value={contextValue}>
          <QueueContext.Provider value={queueContextValue}>
            {
              user ? <Outlet /> :
              <h1>ft_transcendence</h1>
            }
            <QueueTimer />
          </QueueContext.Provider>
        </Context.Provider>
      </UserContext.Provider>
    </div >
  )
}

export default App;