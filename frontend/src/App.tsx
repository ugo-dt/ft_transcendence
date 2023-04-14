import './App.css'
import { Outlet } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import Navbar from './layouts/Navbar'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { Context } from './context'

function App() {
  const serverUrl = "http://192.168.1.178:3000";
  const pongSocketRef = useRef(io(serverUrl + '/pong', {
    autoConnect: false,
  }));
  const [connected, setConnected] = useState(true);

  const contextValue = {
    serverUrl,
    pongSocketRef,
  };

  function onConnect() {
    setConnected(true);
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
      <CssBaseline />
      <Navbar isSignedIn={true}/>
      {
        !connected &&
        <div className="alert-disconnected">
          <h3>
            You are disconnected. Please refresh the page.
          </h3>
        </div>
      }
      <Context.Provider value={contextValue}>
        <Outlet />
      </Context.Provider>
    </div>
  )
}

export default App;