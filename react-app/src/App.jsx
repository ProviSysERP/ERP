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
import Productos from './pages/Productos.jsx'
import Producto from './pages/Producto.jsx'
import HistorialPedidos from './pages/HistorialPedidos.jsx'
import Home from './pages/Home.jsx'
import CartaProveedores from './components/CartaProveedores.jsx'
import Inventario from './pages/Inventario.jsx'
import Pedidos from './pages/Pedidos.jsx'
import Chat from './pages/Chat.jsx'
import { AuthProvider } from "./components/authContext.jsx"


function App() {
  return (
    <AuthProvider>
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <Container>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Register />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
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
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
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
          <Route
            path="/contactos"
            element={
              <ProtectedRoute>
                <Contactos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productos"
            element={
              <ProtectedRoute>
                <Productos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/producto/:id"
            element={
              <ProtectedRoute>
                <Producto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cartaproveedores"
            element={
              <ProtectedRoute>
                <CartaProveedores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pedidos"
            element={
              <ProtectedRoute>
                <Pedidos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historialpedidos"
            element={
              <ProtectedRoute>
                <HistorialPedidos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventario"
            element={
              <ProtectedRoute>
                <Inventario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/header"
            element={
              <ProtectedRoute>
                <Header />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </Box>
    </AuthProvider>
  )
}

export default App