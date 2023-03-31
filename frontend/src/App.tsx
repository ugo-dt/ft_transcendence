import './App.css'
import { Outlet } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import Navbar from './layouts/Navbar'

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Navbar isSignedIn={true}/>
      <Outlet />
    </div>
  )
}

export default App;