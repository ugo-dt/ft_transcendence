import './App.css'
import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Context } from './context'
import { io } from 'socket.io-client'
import { CssBaseline } from '@mui/material'
import { IClient } from './types'
import Navbar from './layouts/Navbar'
import axios from 'axios'

function App() {
  const serverUrl = "http://localhost:3000";
  const pongSocketRef = useRef(io(serverUrl + '/pong', {
    autoConnect: false,
  }));
  const [client, setClient] = useState({} as IClient);
  const [connected, setConnected] = useState(true);

  const contextValue = {
    serverUrl,
    pongSocketRef,
    client,
    setClient,
  };

  function onConnect() {
    setConnected(true);
    const userUrl = serverUrl + '/api/pong/users/user' + pongSocketRef.current.id;

    axios.get(userUrl).then(res => {
      setClient(res.data);
    }).catch(err => {
      console.error(err);
    });
    // console.log(`Connected to ${serverUrl}.`);
  }

  function onDisconnect() {
    setConnected(false);
    // console.log(`Disconnected from ${serverUrl}.`);
  }

  useEffect(() => {
    pongSocketRef.current.on('connect', onConnect);
    pongSocketRef.current.on('disconnect', onDisconnect);
    pongSocketRef.current.connect();

    return () => {
      pongSocketRef.current.disconnect();
      pongSocketRef.current.removeAllListeners();
    };
  }, []);

  return (
    <div className="App">
      <Context.Provider value={contextValue}>
        <CssBaseline />
        <Navbar isSignedIn={true} />
        {
          !connected &&
          <div className="alert-disconnected">
            <h3>
              You are disconnected. Please refresh the page.
            </h3>
          </div>
        }
        <Outlet />
      </Context.Provider>
    </div>
  )
}

export default App;