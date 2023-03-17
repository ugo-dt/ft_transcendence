import './App.css'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="App">
      <Navbar isSignedIn={false} />
      <h1 style={{color: 'blue', margin: '20px'}}>
        This is a title.
      </h1>
    </div>
  )
}

export default App
