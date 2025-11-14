import { Routes, Route } from 'react-router-dom'
import './App.css'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Header from './components/Header.jsx'
import Contactos from './pages/Contactos.jsx'
import Perfil from './pages/Perfil.jsx'
import Novedades from './pages/Novedades.jsx'
import Proveedores from './pages/Proveedores.jsx'
import Proveedor from './pages/Proveedor.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Register />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Contactos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil/:id"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/novedades"
            element={
              <ProtectedRoute>
                <Novedades />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proveedores"
            element={
              <ProtectedRoute>
                <Proveedores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proveedor/:id"
            element={
              <ProtectedRoute>
                <Proveedor />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </Box>
  )
}

export default App