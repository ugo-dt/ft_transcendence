import './App.css'
import { Outlet } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import Navbar from './layouts/Navbar'
import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { Context } from './context'

function App() {
  const serverUrl = "http://192.168.1.178:3000/pong";
  const socketRef = useRef(io(serverUrl, {
    autoConnect: false,
    query: {
      role: 'player',
    },
  }));

  const contextValue = {
    serverUrl,
    socketRef,
  };

  function onConnect() {
    console.log(`Connected to ${serverUrl}.`);
  }

  function onDisconnect() {
    console.log(`Disconnected from ${serverUrl}.`);
  }

  useEffect(() => {
    socketRef.current.on('connect', onConnect);
    socketRef.current.on('disconnect', onDisconnect);
    socketRef.current.connect();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.removeAllListeners();
    };
  }, []);

  return (
    <div className="App">
      <CssBaseline />
      <Navbar isSignedIn={true}/>
      <Context.Provider value={contextValue}>
        <Outlet />
      </Context.Provider>
    </div>
  )
}

export default App;