import { useContext, useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { Context, QueueContext, UserContext } from './context'
import { Socket, io } from 'socket.io-client'
import { CssBaseline } from '@mui/material'
import { IUser } from './types'
import Navbar from './layouts/Navbar'
import axios from "axios";
import { DefaultEventsMap } from '@socket.io/component-emitter'
import Request from './components/Request'
import './App.css'

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
  const serverUrl: string = import.meta.env.VITE_BACKEND_HOST;
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [inQueue, setInQueue] = useState(false);
  const [queueTimer, setQueueTimer] = useState({ minutes: 0, seconds: 0 });
  const queueInterval = useRef<number | undefined>(undefined);
  const navigate = useNavigate();
  const [parameters] = useSearchParams();
  const isServerAvailableRef = useRef<boolean>(true);
  const [isServerAvailable, setIsServerAvailable] = useState<boolean>(true);

  const contextValue = {
    serverUrl: serverUrl,
    pongSocket: socket,
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
      socket.current.connect();
      socket.current.on('disconnect', onDisconnect);
      socket.current.on('client-connected', (res: IUser) => {
        setUser(res);
      })
    }
  }

  function onDisconnect() {
    if (socket.current) {
      socket.current.disconnect();
    }
    isServerAvailableRef.current = false;
    setIsServerAvailable(isServerAvailableRef.current);   
  }
  
  useEffect(() => {
    async function init() {
      isServerAvailableRef.current = await Request.isServerAvailable();
      setIsServerAvailable(isServerAvailableRef.current);      
      if (isServerAvailableRef.current) {
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
      }
    }
    init();

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
              !isServerAvailable &&
              <div className="alert-disconnected">
                <h3>
                  You are disconnected. Please refresh the page.
                </h3>
              </div>
            }
            {
              user && <Outlet />
            }
            <QueueTimer />
          </QueueContext.Provider>
        </Context.Provider>
      </UserContext.Provider>
    </div >
  )
}

export default App;