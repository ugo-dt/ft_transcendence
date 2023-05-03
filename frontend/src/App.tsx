import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { Context, QueueContext, UserContext } from './context'
import { Socket, io } from 'socket.io-client'
import { CssBaseline, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import { IUser } from './types'
import Navbar from './layouts/Navbar'
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
  const [loading, setLoading] = useState<boolean>(true);
  const [openModalLogin, setOpenModalLogin] = useState(false);
  const [otp, setOtp] = useState('');

  const contextValue = {
    serverUrl: serverUrl,
    pongSocket: socket,
    loading: loading,
    setLoading: setLoading,
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
      setLoading(false);
      return;
    }
    socket.current = io(serverUrl + '/pong', {
      autoConnect: false,
      query: data,
    });
    if (socket.current) {
      socket.current.connect();
      socket.current.on('disconnect', onDisconnect);
      socket.current.on('client-connected', (res: IUser) => {
        setUser(res);
        setLoading(false);
      });
    }
  }

  function onDisconnect() {
    if (socket.current) {
      socket.current.disconnect();
    }
    isServerAvailableRef.current = false;
    setIsServerAvailable(isServerAvailableRef.current);
  }

  async function onModalClose() {
    setOpenModalLogin(false);
    await Request.cancelLoginOtp();
    setOtp('');
  }

  function onChangeOtp(event: ChangeEvent<HTMLInputElement>) {
    setOtp(event.target.value);
  }

  async function onClickValidateOtp() {
    const res = await Request.validateLoginOtp(otp);
    if (res !== null) {
      navigate("/home");
      window.location.reload();
    } else {
      // temp?
    }
    onModalClose();
  }

  useEffect(() => {
    async function init() {
      isServerAvailableRef.current = await Request.isServerAvailable();
      setIsServerAvailable(isServerAvailableRef.current);
      if (isServerAvailableRef.current) {
        if (parameters.get("code")) {
          Request.signIn(parameters.get("code")).then(res => {
            if (res) {
              navigate("/home");
              window.location.reload();
            } else {
              Request.generateLoginOtp().then(res => {
                if (!res) console.log('Request was invalid!');
                else setOpenModalLogin(true);
              });
            }
          });
        }
        Request.me().then(res => {
          if (res) {
            connect(res);
          }
          else {
            setLoading(false);
            navigate("/home");
          }
        });
      }
      else {        
        setLoading(false);
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
        {
          !loading &&
          <>
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
                  user ? <Outlet /> :
                    <div style={{ textAlign: 'center' }}>
                      <h1>ft_transcendence</h1>
                      <NavLink className="NavLink" to={import.meta.env.VITE_API_REDIRECT_URI}>
                        <button style={{ padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                          Sign in with 42
                        </button>
                      </NavLink>
                      <Dialog open={openModalLogin} onClose={onModalClose}>
                        <DialogTitle>Two-factor verification</DialogTitle>
                        <DialogContent>
                          <Stack component="form" direction="column" spacing={2}>
                            <Typography variant="body1">Enter the 6-digit code we sent to your phone number.</Typography>
                            <TextField id="outline-required-size-small" variant="outlined" size="small" required value={otp} onChange={onChangeOtp}/>
                            <Button variant="contained" onClick={onClickValidateOtp}>Log in</Button>
                          </Stack>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={onModalClose}>Close</Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                }
                <QueueTimer />
              </QueueContext.Provider>
            </Context.Provider>
          </>
        }
      </UserContext.Provider>
    </div >
  )
}

export default App;