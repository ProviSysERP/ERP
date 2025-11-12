import { useState } from 'react'
import './App.css'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Header from './components/Header.jsx'
import Contactos from './pages/Contactos.jsx'
import Novedades from './components/Novedades.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="lg">
        <Contactos />
        <Box sx={{ py: 4 }}>
          <h1></h1>
        </Box>
      </Container>
      <Novedades />
    </Box>


  )
}

export default App
