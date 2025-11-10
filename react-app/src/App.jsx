import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<Header />
      <div>
        <h1>Papa's Pizzeria To Go</h1>
      </div>
    </>
  )
}

export default App
