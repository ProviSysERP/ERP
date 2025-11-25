import { Container }  from '@mui/material';
import Novedades from './Novedades.jsx'
import CartaProveedores from "../components/CartaProveedores.jsx";
import Header from '../components/Header.jsx'

const Home = () => {
    return (
        <Container>
            <Header/>
            <Novedades/>
            <Container>
                <h1>PROVEEDORES</h1>
                <CartaProveedores/>
            </Container>
            
        </Container>
    );
}
export default Home;