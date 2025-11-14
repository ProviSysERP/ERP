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
import Productos from './pages/Productos.jsx'
import Producto from './pages/Producto.jsx'
import Pedidos from './pages/Pedidos.jsx'
import Home from './pages/Home.jsx'
import CartaProveedores from './components/CartaProveedores.jsx'

function App() {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<Novedades />} />
          <Route path="/perfil/:id" element={<Perfil />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/proveedor/:id" element={<Proveedor />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<Producto />} />
          <Route path="/home" element={<Home />} />
          <Route path="/cartaproveedores" element={<CartaProveedores />} />
        </Routes>
      </Container>
    </Box>


  )
}

export default App