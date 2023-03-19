import './App.css'
import { Route, Routes } from 'react-router'
import { Outlet } from 'react-router-dom'
import Navbar from './layouts/Navbar'
import router from './router'

function App() {
  return (
    <div className="App">
      <Navbar isSignedIn={true}/>
      <Outlet />
    </div>
  )
}

export default App
