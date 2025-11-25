import { Container, Typography, Box, Divider, Paper } from '@mui/material';

// Pedidos
import HacerPedidoImg from '../assets/hacerPedido.png';
import CancelarPedidoImg from '../assets/cancelarPedido.png';
import EditarPedidoImg from '../assets/editarPedido.png';

// Chat
import EmpezarChatImg from '../assets/iniciarChat.png';
import EliminarChatImg from '../assets/eliminarChat.png';

// Productos
import CrearProductoImg from '../assets/crearProducto.png';
import EliminarProductoImg from '../assets/eliminarProducto.png';
import EditarProductoImg from '../assets/editarProducto.png';

// Proveedores
import BuscarProveedorImg from '../assets/buscarProveedor.png';
import AgregarResenaImg from '../assets/agregarResena.png';
import EliminarResenaImg from '../assets/eliminarResena.png';

// Usuarios
import CrearPerfilImg from '../assets/crearPerfil.png';
import EditarPerfilImg from '../assets/editarPerfil.png';
import EliminarPerfilImg from '../assets/eliminarPerfil.png';

const HowTo = [
  {
    title: 'PEDIDOS',
    steps: [
      {
        title: '¿Cómo hacer un pedido?',
        instructions: [
            'Accede a la página de pedidos utilizando el buscador del Header en la parte superior izquierda o haciendo clic en el icono del carrito en la esquina superior derecha.',
            'Busca el producto que deseas comprar y selecciónalo.',
            'Introduce la cantidad deseada para cada producto. Puedes repetir este paso para añadir más productos al pedido.',
            'Cuando hayas agregado todos los productos que quieras, confirma el pedido haciendo clic en el botón correspondiente.',
            'Completa la información de envío en la ventana emergente que aparecerá. Asegúrate de que los datos sean correctos para evitar errores de entrega.',
            'Una vez confirmado, el pedido se guardará en tu historial de pedidos, donde podrás consultar todos los pedidos realizados y su estado.'
                ],
        image: HacerPedidoImg
      },
      {
        title: '¿Cómo cancelar un pedido?',
        instructions: [
          'Para cancelar un pedido es necesario tener un pedido ya registrado, al tenerlo registrado aparecerá en la pestaña de historial de pedidos.',
          'Al pulsar el botón de “eliminar” se eliminará el pedido.'
        ],
        image: CancelarPedidoImg
      },
      {
        title: '¿Cómo editar un pedido?',
        instructions: [
          'Es posible editar el estado del pedido de manera en que aparecerá de 3 estados posibles “pendiente”, “entregado” o “en tránsito”.'
        ],
        image: EditarPedidoImg
      }
    ]
  },
  {
    title: 'CHAT',
    steps: [
      {
        title: '¿Cómo empezar una conversación?',
        instructions: [
          'Para acceder a las funciones de “chat” es necesario tener una cuenta ya sea de proveedor o de negocio. La de este ejemplo es una cuenta de proveedor:',
          'Para iniciar una conversación con un cliente o proveedor deberemos dirigirnos al apartado de “chat” o bien hacer click en el icono del sobre de la esquina superior derecha:',
          'Una vez hayamos hecho click estaremos en la página de chat:',
          'Para iniciar una conversación es tan sencillo como presionar el botón de “nuevo chat” que se encuentra en la esquina inferior derecha de la página. Seleccionaremos la persona con la que queramos chatear:',
          'Al seleccionar la persona o entidad se nos abrirá un chat con dicha persona o entidad.'
        ],
        image: EmpezarChatImg
      },
      {
        title: '¿Cómo eliminar un chat?',
        instructions: [
          'Si queremos eliminar un chat simplemente tendremos que hacer click en el botón de borrar chat y seleccionar el chat que deseamos eliminar. El programa lanzará una confirmación para validar la operación.'
        ],
        image: EliminarChatImg
      }
    ]
  },
  {
    title: 'PRODUCTOS',
    steps: [
      {
        title: '¿Cómo crear un producto?',
        instructions: [
          'A la hora de crear un producto nuevo, lo que deberás hacer primero es ir al apartado de inventario de nuestra app. Para eso pulsa la barra de búsqueda del header y busca la opción “Inventario”.',
          'Una vez ahí, verás tu inventario. Si eres un usuario que nunca ha accedido a este apartado de nuestra página o que no tiene ningún producto agregado, esta debería de ser la pantalla que aparezca al entrar.',
          'Para crear un nuevo producto deberás, primero, ser un proveedor, y después hacer click en el botón morado que dice “Añadir Productos”, una vez hecho eso, aparecerá una pantalla emergente con todos los productos disponibles y un botón para crear un nuevo producto.',
          'Cuando pulses el botón de crear uno nuevo, aparecerá una ventana con todos los datos que deberás rellenar. Cuando termines, pulsar añadir productos de nuevo revelará el producto ya creado abajo.'
        ],
        image: CrearProductoImg
      },
      {
        title: '¿Cómo eliminar un producto?',
        instructions: [
          'Para poder eliminar un producto, lo primero es saber que sólo puedes eliminar los productos que tú hayas creado o que tu empresa haya registrado.',
          'Deberás hacer click en el botón de “Eliminar Productos de mi Empresa”, y te mostrará los productos que hayas creado o te hayan asignado.',
          'Para eliminar uno solo deberás pulsar el botón de la basura y se habrá eliminado correctamente.'
        ],
        image: EliminarProductoImg
      },
      {
        title: '¿Cómo editar un producto?',
        instructions: [
          'Actualmente no se puede editar un producto, pero planeamos poder hacerlo en una futura actualización.'
        ],
        image: EditarProductoImg
      }
    ]
  },
  {
    title: 'PROVEEDORES',
    steps: [
      {
        title: '¿Cómo buscar proveedores?',
        instructions: [
          'Buscar proveedores es simple. Solo necesitas, primero de todo, navegar a la página de proveedores.',
          'Una vez aquí, es tan fácil como utilizar el campo de búsqueda o nuestro sistema de filtros con tal de dar con el proveedor que desees. Pulsar en más info te llevará a una pestaña en la que podrás consultar información más específica, junto a agregar reseñas o comprobar sus productos.'
        ],
        image: BuscarProveedorImg
      },
      {
        title: '¿Cómo agregar una reseña?',
        instructions: [
          'Para poder agregar una reseña a un proveedor, tienes que saber que cada usuario solo puede escribir una reseña por proveedor.',
          'Primero tienes que seleccionar el proveedor al que quieras escribir la reseña.',
          'Haz click en la barra que pone “Reseñas de Usuarios”, esto abrirá un desplegable con el apartado de las reseñas.',
          'Aquí podrás escribir una reseña y darle de 1 a 5 estrellas al proveedor. También podrás ver las reseñas que diferentes usuarios han escrito. Cuando hayas escrito lo que quieras y seleccionado las estrellas le darás a enviar.'
        ],
        image: AgregarResenaImg
      },
      {
        title: '¿Cómo eliminar una reseña?',
        instructions: [
          'Eliminar una reseña es sencillo, simplemente tienes que pulsar el botón de “Eliminar” que se muestra al lado de la reseña. Esto te mostrará una confirmación y al aceptarla la habrás eliminado correctamente.'
        ],
        image: EliminarResenaImg
      }
    ]
  },
  {
    title: 'USUARIOS',
    steps: [
      {
        title: '¿Cómo crear un perfil?',
        instructions: [
          'Para poder crear un nuevo perfil de usuario, primero debes registrarte en nuestra página mediante nuestro método de login.',
          'Una vez pulses el botón de “Regístrate aquí” deberás rellenar tus datos de cuenta para poder empezar a navegar por nuestra aplicación.'
        ],
        image: CrearPerfilImg
      },
      {
        title: '¿Cómo editar un perfil?',
        instructions: [
          'Para poder editar tu perfil lo que debes hacer es hacer click en el icono de perfil en la esquina superior derecha y pulsar el botón de “Perfil”.',
          'Después de eso verás tu perfil de usuario y tres botones encima de tu foto. Uno de ellos es “Editar”, con el cual podrás editar tus datos de usuario.',
          'Una vez pulses en el botón de “Editar” verás como se abre un cuadro emergente en el que aparecerá toda la información que hayas introducido cuando te has registrado en la aplicación y podrás editarla como te plazca. Para guardar los cambios simplemente deberás pulsar el botón de “Guardar” y tendrás tu información actualizada.'
        ],
        image: EditarPerfilImg
      },
      {
        title: '¿Cómo eliminar un perfil?',
        instructions: [
          'Para eliminar tu perfil, deberás pulsar de nuevo el icono de perfil en la esquina superior derecha y pulsar el botón de “Perfil”.',
          'Una vez dentro, podrás ver tu perfil y un botón rojo llamado “Eliminar” que te permitirá borrar por completo tu perfil.'
        ],
        image: EliminarPerfilImg
      }
    ]
  }
];

const HowTos = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {HowTo.map((howto, tIdx) => (
        <Box key={tIdx} mb={6}>
          <Typography variant="h4" gutterBottom>
            {howto.title}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {howto.steps.map((step, sIdx) => (
            <Paper key={sIdx} elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                {step.title}
              </Typography>
              {step.instructions.map((instr, iIdx) => (
                <Box key={iIdx} mb={2}>
                  <Typography variant="body1">{instr}</Typography>
                  <Box
                    component="img"
                    src={step.image}
                    alt="Imagen del paso"
                    sx={{ width: '100%', maxHeight: 200, mt: 1, borderRadius: 1 }}
                  />
                </Box>
              ))}
            </Paper>
          ))}
        </Box>
      ))}
    </Container>
  );
};

export default HowTos;
