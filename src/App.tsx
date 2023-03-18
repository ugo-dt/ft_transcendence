import './App.css'
import Navbar from './components/Navbar'
import BottomNavbar from './components/BottomNavbar'
import { Route, Routes } from 'react-router'
import Home from './routes/Home'
import Game from './routes/Game'
import Chat from './routes/Chat'
import Friends from './routes/Friends'
import Leaderboard from './routes/Leaderboard'
import Profile from './routes/Profile'
import Account from './routes/Account'
import NotFound from './routes/NotFound'
import SignIn from './routes/SignIn'

function App() {
  return (
    <div className="App">
      <Navbar isSignedIn={false}/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="play" element={<Game />} />
        <Route path="messages" element={<Chat />} />
        <Route path="friends" element={<Friends />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="account" element={<Account />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <BottomNavbar />
    </div>
  )
}

export default App
