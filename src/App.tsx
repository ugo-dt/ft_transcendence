import './App.css'
import Navbar from './components/Navbar'
import BottomNavbar from './components/BottomNavbar'

function App() {
  return (
    <div className="App">
      <Navbar isSignedIn={true} />
      <BottomNavbar isSignedIn={true} />
      <h1 style={{color: 'blue', margin: '20px'}}>
        This is a title.
      </h1>
    </div>
  )
}

export default App
