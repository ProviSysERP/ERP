import { Routes, Route } from 'react-router-dom'
import './App.css'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Header from './components/Header.jsx'
import Contactos from './pages/Contactos.jsx'
import Perfil from './pages/Perfil.jsx'
import Novedades from './pages/Novedades.jsx'

function App() {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Contactos />} />
          <Route path="/perfil/:id" element={<Perfil />} />
          <Route path="/novedades" element={<Novedades />} />
        </Routes>
      </Container>
    </Box>


  )
}

export default App