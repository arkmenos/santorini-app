import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/home/Home'

function App() {
  return (    
    <div className='app'>
      <Routes>
        <Route path="/" element= {<Home />}/>
        <Route path="/:paramRoomId" element= {<Home />}/> 
        <Route path="*" element={<p>Path not resolved</p>} />       
      </Routes>
    </div>
  )
}

export const Approot = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

export default App
