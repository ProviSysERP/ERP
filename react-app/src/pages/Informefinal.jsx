import {
  ThemeProvider,
  createTheme
} from "@mui/material/styles";
import {Container, Box, Grid, Card, CardContent, CardMedia, Typography, Divider, List, ListItem, ListItemIcon, ListItemText, Stack} from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import PeopleIcon from "@mui/icons-material/People";

const theme = createTheme({
  palette: {
    primary: { main: "#0f62fe" },
    secondary: { main: "#7c4dff" },
    background: { default: "#fbfdff" }
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif"
  }
});


const paragraphs = [
  `¿QUIÉNES SOMOS?`,
  `Nosotros somos NovaTechZeo, una empresa de Desarrollo de Software orientada a dar soluciones digitales a problemas reales que surgen en empresas de todos tipos y orientaciones.`,
  ``,
  `¿QUÉ ES PROVISYS?`,
  `ProviSys es un ERP (Enterprise Resource Planning), creado por NovaTechZeo; este proyecto nace con el objetivo de ayudar a expandir negocios en el sector de la hostelería, además de querer facilitar las herramientas necesarias para lograr una mejor comunicación entre empresa-proveedor, y viceversa.`,
  ``,
  ``,
  `¿QUÉ APARTADOS TIENE NUESTRO ERP?`,
  `Nuestro ERP contiene tres apartados fundamentales en su estructura:`,
  ``,
  ``,
  `Componentes`,
  ``,
  `Tecnologías`,
  ``,
  `Enfoque Principal`,
  ``,
  `Frontend`,
  ``,
  `JavaScript & Electron`,
  ``,
  `Desarrollo de una aplicación de escritorio multiplataforma.`,
  ``,
  `Diseño`,
  ``,
  `MUI (Material-UI) `,
  ``,
  `Componentes para una interfaz de usuario moderna y profesional.`,
  ``,
  `Backend`,
  ``,
  `Node.js & Express.js`,
  ``,
  `Servidor API RESTful para la lógica de negocio.`,
  ``,
  `Base de Datos`,
  ``,
  `MongoDB`,
  ``,
  `Almacenamiento de datos NoSQL flexible y escalable.`,
  ``,
  ``,
  `Frontend: El frontend es el apartado visual de la página, todo lo que el usuario puede ver o interactuar en la aplicación, como diseño, menús…`,
  ``,
  `Backend: Apartado que gestiona (trabajando “detrás de escena”) lógica del negocio, la comunicación con la base de datos, la autenticación de usuarios y el procesamiento de las solicitudes del frontend. `,
  ``,
  `Base de Datos: Una base de datos es una colección organizada de información estructurada que se almacena electrónicamente en un sistema informático. Permite almacenar, organizar y recuperar grandes volúmenes de datos de forma rápida y eficiente`,
  ``,
  `MongoDB: MongoDB es sistema de gestión de bases de datos (DBMS) NoSQL de código abierto que almacena datos en documentos flexibles con formato JSON en lugar de tablas y filas tradicionales.`,
  ``,
  ``,
  `¿CÓMO PONER EN MARCHA LA APLICACIÓN?`,
  `Para iniciar la aplicación localmente:`,
  ``,
  `Clona los repositorios de Frontend y Backend.`,
  ``,
  `Instala dependencias en cada carpeta: npm install.`,
  ``,
  `Asegúrate de que tu conexión a MongoDB esté configurada en el servidor de Express.`,
  ``,
  `Inicia la API (Backend): node server.js (escuchando en http://localhost:3000).`,
  ``,
  `Inicia el cliente (Frontend/Electron): npm start.`,
  ``,
  ``,
  `Todas las instalaciones necesarias y comandos que hay que utilizar o que hemos utilizado:`,
  ``,
  `API: `,
  ``,
  `npm install npm -g`,
  ``,
  `npm install mongodb express`,
  ``,
  `npm install -g nodemon`,
  ``,
  `npm install --save-dev electronmon`,
  ``,
  `npm install cors`,
  ``,
  `npm install express`,
  ``,
  `npm install mongodb`,
  ``,
  `npm init -y`,
  ``,
  `//npm install express mongodb`,
  ``,
  `npm install lucide-react jspdf   `,
  ``,
  `npm install dotenv`,
  ``,
  `npm install cookie-parser`,
  ``,
  `npm install react-router-dom  react-router-dom@6 `,
  ``,
  `ERP (Frontend): `,
  ``,
  `npm create vite@latest react-app -- --template react  `,
  ``,
  `node upgrade  `,
  ``,
  `node -v     `,
  ``,
  `node update              `,
  ``,
  `npm install electron    `,
  ``,
  ` npm install @mui/material @emotion/react @emotion/styled  `,
  ``,
  `npm install @mui/icons-material `,
  ``,
  `npm install @fontsource/roboto`,
  ``,
  `npm init -y`,
  ``,
  `npm install @mui/material @emotion/react @emotion/styled react-slick slick-carousel`,
  ``,
  `npm install jspdf-autotable`,
  ``,
  ``,
  `COSAS A TENER EN CUENTA:`,
  ``,
  `No vas a poder acceder a la página web con el mismo usuario desde diferentes equipos, esto es, sólo puedes iniciar sesión una vez al mismo tiempo, no varias veces.`,
  ``,
  `Nuestra aplicación contiene dos roles de usuarios distintos, Administradores y Usuarios corrientes.`,
  ``,
  `Para acceder a esta página vas a tener que crear un usuario primero y después, tendrás que iniciar sesión siempre que quieras acceder a ella.`,
  ``,
  `Hacemos uso de cookies.`,
  ``,
  ``,
  `API:`,
  `Apartado que gestiona (trabajando “detrás de escena”) lógica del negocio, la comunicación con la base de datos, la autenticación de usuarios y el procesamiento de las solicitudes del frontend. `,
  ``,
  ``,
  `Herramientas utilizadas en la API:`,
  ``,
  `Express: Es un framework de aplicaciones web minimalista y flexible para Node.js que simplifica la creación de servidores y APIs. Proporciona un conjunto de herramientas para el desarrollo backend en JavaScript, facilitando tareas como el enrutamiento de solicitudes y la gestión de respuestas.`,
  ``,
  `Node: Es un entorno de ejecución de JavaScript de código abierto y multiplataforma que permite ejecutar código JavaScript en el lado del servidor. `,
  ``,
  `Estructura del proyecto:`,
  ``,
  `Para empezar tengo que mencionar que nuestro proyecto comenzó desde otro ejemplo realizado anteriormente, por lo tanto, realizamos varios métodos (GET, POST…) en un mismo archivo, haciendo que se nos complique el separar el proyecto en diferentes carpetas y archivos. `,
  ``,
  ``,
  `Métodos utilizados y sus respectivos ejemplos:`,
  ``,
  `En nuestra API se utilizan varios métodos HTTP que permiten gestionar la información de los usuarios. El método GET se emplea para obtener datos sin modificarlos, por ejemplo cuando se solicita la lista completa de usuarios mediante la ruta /usuarios o cuando se consulta un usuario concreto usando /usuarios/:id_user. El método POST se utiliza cuando es necesario enviar información al servidor para crear nuevos registros o iniciar procesos, como ocurre en /registrar donde se envían los datos del usuario para crear una cuenta con un id_user único, o en /login donde se envían las credenciales y el servidor responde con un access token y un refresh token para manejar la autenticación. También se usa POST al solicitar los datos del usuario autenticado dependiendo de la implementación. El método PUT sirve para actualizar información ya existente, como cuando se modifican datos del usuario mediante /usuarios/:id_user, permitiendo actualizar elementos como el nombre, el correo o la imagen de perfil. Por último, el método DELETE se utiliza para eliminar registros del sistema, como sucede en /usuarios/:id_user donde un usuario puede ser eliminado de forma definitiva. Estos métodos permiten la gestión completa de creación, consulta, actualización y eliminación de datos dentro del sistema.`,
  ``,
  ``,
  ``,
  ``,
  `Apartados realizados fuera de lo pedido por el profesorado:`,
  `En el proyecto hemos implementado un sistema completo de autenticación que es un añadido a lo que se pedía en la práctica. Cuando un usuario se registra, sus datos se almacenan en la base de datos y la contraseña se guarda hasheada para almacenarla segura, evitando que pueda ser recuperada aun si alguien entrase a la base de datos. Al iniciar sesión, el sistema verifica el email y compara la contraseña introducida con el hash almacenado, y si las credenciales son correctas, se generan dos tokens JWT: un access token y un refresh token. El access token se utiliza para autorizar las peticiones a las rutas protegidas del backend y tiene una duración corta para mejorar la seguridad. Cuando caduca, el usuario no necesita volver a introducir sus credenciales porque el refresh token permite solicitar un nuevo access token y mantener la sesión activa. El refresh token tiene una duración mayon y es almacenado en la base de datos para posteriormente cuando un usuario sin access token realiza una petición, poder comprobar la validez y generar un access token y refresh token nuevos.`,
  ``,
  ``,
  `Frontend:`,
  ``,
  `El frontend es el apartado visual de la página, todo lo que el usuario puede ver o interactuar en la aplicación, como diseño, menús…`,
  ``,
  ``,
  `Herramientas utilizadas en el Frontend:`,
  ``,
  `React: Es una biblioteca de JavaScript de código abierto para crear interfaces de usuario (UI) interactivas y dinámicas. Fue desarrollada por Facebook y se utiliza para construir aplicaciones web de una sola página (SPA) mediante componentes reutilizables. `,
  ``,
  `MUI: Es una biblioteca de componentes de interfaz de usuario (UI) para React que implementa el sistema de diseño de Google, Material Design.`,
  ``,
  `Electron: Es un framework de código abierto que permite crear aplicaciones de escritorio multiplataforma (para Windows, macOS y Linux) usando tecnologías web como JavaScript, HTML y CSS.`,
  ``,
  ``,
  `Estructura del proyecto:`,
  ``,
  `Para el desarrollo de esta aplicación, hemos tenido que separar en diferentes partes el proyecto, especialmente en la aplicación de react (react-app) y en el apartado de electron.`,
  ``,
  `Esta es la organización del proyecto:`,
  ``,
  ``,
  `Módulos implementados en la aplicación:`,
  ``,
  `Chat:`,
  ``,
  `Chat es relativamente fácil. El frontend son 3 containers que contienen los chats, el chat actual y el botón de eliminar y añadir a la izquierda. Tienen 4 llamadas en la API: `,
  ``,
  ``,
  ``,
  `Consisten, en órden, de una llamada para crear una nueva conversación, una para añadir mensajes a la conversación, una para borrar conversaciones y una para agarrar las conversaciones del usuario activo. Esto significa que la página solo funciona si usuario NO es nulo, ya que requiere el usuario para funcionar.`,
  ``,
  ``,
  ``,
  `Los mensajes se muestran en un array.`,
  ``,
  ``,
  `Perfil: En perfil, buscamos cargar la información relevante del usuario con  el que has ingresado o has iniciado sesión. Este módulo es una página en la aplicación.`,
  ``,
  `Manejo de datos:  Mencionar que la lógica de comunicación con la API se maneja principalmente con la función FetchWithRefres, lo que sugiere un  manejo de tokens de autenticación.`,
  ``,
  `Carga de datos inicial(useEffect): Se realiza una solicitud GET al endpoint /usuarios/:id. Si tiene éxito, actualiza user y procede a buscar la información del proveedor con pullProviders si el campo provider es verdadero. Gari esto que te parece esque no sabia explicarlo bien.`,
  ``,
  `Después, mediante la función handleSave guardamos la edición.`,
  ``,
  `Realiza validación de formulario básica (nombre y correo).`,
  ``,
  `Construye el payload con los datos del formulario, incluyendo la anidación para address.`,
  ``,
  `Intenta actualizar el usuario mediante múltiples IDs candidatas (user._id, user.id_user, id de la URL) en caso de que la estructura de IDs del backend varíe (MongoDB _id vs. ID relacional id_user).`,
  ``,
  `Intenta un método PUT primero. Si el PUT falla (por ejemplo, con 404 Not Found), intenta un PATCH como método de actualización alternativo, mostrando una robustez ante diferentes implementaciones de la API REST.`,
  ``,
  `Intenta un método PUT primero. Si el PUT falla (por ejemplo, con 404 Not Found), intenta un PATCH como método de actualización alternativo, mostrando una robustez ante diferentes implementaciones de la API REST.`,
  ``,
  `Muestra notificaciones de éxito o error con Snackbar.`,
  ``,
  `Función handleDeleteConfirm (Eliminar)`,
  ``,
  `Realiza una solicitud DELETE al endpoint /usuarios/:id. En caso de éxito, redirige a la ruta /contactos después de una breve pausa.`,
  ``,
  `Interfaz de Usuario (UI) y Componentes Material-UI`,
  ``,
  `El componente utiliza la librería Material-UI (@mui/material) para estilizar y estructurar la interfaz.`,
  ``,
  `Componentes de Estado`,
  ``,
  `CircularProgress: Se muestra durante la carga (isLoading).`,
  ``,
  `Alert: Muestra mensajes de error o cuando el usuario no se encuentra.`,
  ``,
  `Vista Principal`,
  ``,
  `Muestra la información del usuario dentro de un Card, incluyendo nombre, email, teléfono, ID y foto de perfil (CardMedia).`,
  ``,
  `Muestra el Botón de Volver, Editar y Eliminar.`,
  ``,
  `Si el usuario es proveedor (user.provider === true) y los datos del proveedor (provider) se cargaron, muestra la información de la Empresa Proveedora en una Card separada.`,
  ``,
  `Diálogo de Edición (Dialog - Edit)`,
  ``,
  `Contiene un formulario con campos TextField para editar datos personales y de dirección.`,
  ``,
  `Incluye Switch para modificar los estados booleanos provider y admin.`,
  ``,
  ``,
  `El botón Guardar ejecuta handleSave.`,
  ``,
  `Diálogo de Eliminación (Dialog - Delete)`,
  ``,
  `Una confirmación simple con los botones Cancelar y Borrar (que ejecuta handleDeleteConfirm).`,
  ``,
  `Notificaciones (Snackbar)`,
  ``,
  `Muestra mensajes breves (snack) para informar al usuario sobre el progreso de las acciones (guardado, errores, eliminación).`,
  ``,
  ``,
  `Productos: `,
  `Inventario: Inventario es posiblemente la página más compleja de toda nuestra web. Consiste en múltiples llamadas distintas en la API, todas trabajando juntas para formar la página de inventario, que también permite crear y eliminar productos, junto agregar dichos productos al inventario del usuario activo.`,
  ``,
  ``,
  ``,
  ``,
  `Proveedores:`,
  ``,
  ``,
  `Buscar Proveedor por Nombre`,
  ``,
  `La búsqueda por nombre funciona porque el componente guarda en (busqueda) el texto que el usuario escribe en el cuadro de búsqueda, y cada vez que este cambia se actualiza con setBusqueda. Luego, al mostrar los proveedores, la lista original se filtra usando filter, comprobando si el nombre de cada proveedor contiene el texto escrito, comparando ambos valores en minúsculas para evitar errores por mayúsculas o minúsculas. Así solo los proveedores que tengan alguna coincidencia se enseñan.`,
  ``,
  ``,
  `Busqueda:`,
  ``,
  ``,
  ``,
  `Filter:`,
  ``,
  ``,
  ``,
  `Buscar Proveedor por Categoría`,
  ``,
  `La búsqueda por categoría funciona de manera parecida a la búsqueda por nombre. Está el estado (categoriaSeleccionada) donde se guarda la categoría que el usuario elige haciendo click en los botones de la barra lateral. Cada vez que el usuario selecciona una categoría, ese estado cambia. Luego, al filtrar la lista de proveedores, se comprueba si la categoría seleccionada está vacía (lo que significa mostrar todos) o si el proveedor tiene esa categoría dentro de su lista de categorías. Esto se hace usando some() para revisar si alguna de las categorías del proveedor coincide con la seleccionada.`,
  ``,
  ``,
  `Visualizar la Carta del Proveedor`,
  ``,
  `La carta funciona como un contenedor visual y organizado que toma los datos del proveedor desde la API y los muestra de manera estructurada y estilizada, separando imagen de perfil, categorías y detalles de contacto/disponibilidad.`,
  ``,
  ``,
  ``,
  `Ver los Productos del Proveedor`,
  ``,
  `El desplegable de productos funciona mediante un estado booleano openProductos que controla si el panel está abierto o cerrado. Al hacer click en el encabezado del Card (un Box dentro del Card), se invierte el valor de openProductos con setOpenProductos(!openProductos). El contenido que muestra los productos ajusta su altura automáticamente (height: "auto") cuando openProductos es true, y se oculta (height: 0) cuando es false, mientras que transition genera una animación suave al expandirse o colapsarse. Los componentes de Material-UI (MUI) como Card, Box, Typography y el sistema de Grid se usan para la disposición, estilos y responsividad, permitiendo que la sección de productos se muestre u oculte dinámicamente con un diseño consistente. `,
  ``,
  `Los productos se obtienen del backend filtrando todos los productos por id_provider del proveedor y se guardan en el estado products. Cada producto se renderiza en un Card de Material-UI con su imagen (CardMedia), nombre (Typography), precio y botones de acción (Button).`,
  ``,
  ``,
  `Ver las Reseñas de cada Proveedor`,
  ``,
  `El desplegable de reseñas funciona de manera prácticamente igual al de productos, usando un estado booleano openReseñas que indica si el panel está abierto o cerrado. Al hacer click en el encabezado del Card que actúa como título de la sección, se invierte el valor de openReseñas con setOpenReseñas(!openReseñas). El contenido que contiene las reseñas ajusta su altura automáticamente (height: "auto") cuando openReseñas es true y se oculta (height: 0) cuando es false, mientras que transition produce una animación suave al expandirse o colapsarse. Los componentes de Material-UI (MUI) como Card, Box, Typography, Stack y Rating se usan para la estructura, estilos y disposición, permitiendo mostrar u ocultar dinámicamente las reseñas del proveedor de manera clara, visualmente consistente.`,
  ``,
  `Las reseñas con estrellas se muestran desde el estado proveedor.rating, que se obtiene del backend al cargar la página. Cada reseña se renderiza con Material-UI mostrando autor, comentario y puntuación. Los usuarios pueden agregar una reseña con un POST a /proveedores/:id_provider/rating o eliminar la suya con un DELETE. La sección de reseñas tiene un desplegable controlado por openReseñas, que permite expandir o colapsar la lista con animación usando Card, Box y estilos de MUI.`,
  ``,
  ``,
  `Conexión a la base de datos`,
  ``,
  `En Proveedores.jsx, los proveedores se muestran obteniendo primero los datos de la base de datos a través de una llamada a la API del backend usando fetchWithRefresh dentro de un useEffect. Esta llamada solicita GET /proveedores al servidor, que a su vez obtiene los documentos de la colección proveedores en MongoDB. La respuesta, que es un array de proveedores, se guarda en el estado proveedores mediante setProveedores. Luego, en el JSX, se reformula sobre este estado usando map para renderizar cada proveedor dentro de componentes de Material-UI como Card, CardMedia, Typography y Button, mostrando información como la foto, nombre de la empresa y categorías. Cada tarjeta también incluye un enlace (el botón de Más Info) que lleva a la página individual del proveedor (/proveedor/:id). Así, los proveedores de la base de datos se transforman en una lista visual de cartas interactivas en la UI.`,
  ``,
  ``,
  `En Proveedor.jsx, se obtiene la información del proveedor haciendo un fetchWithRefresh en un useEffect, usando el id de la URL con useParams(). Los datos, que vienen de la API /proveedores/:id_provider en index.jsx desde MongoDB, se guardan en el estado proveedor con setProveedor. Luego, la carta del proveedor accede a ese estado para mostrar companyName, description, availability, categories e image usando componentes de Material-UI como Card, CardMedia, Typography y Chip. Las partes clave del código son: el state const [proveedor, setProveedor] = useState(null), el useEffect que hace el fetch, y el JSX que renderiza los datos dentro del Card.`,
  ``,
  ``,
  `Usuarios: `,
  ``,
  ``,
  ``,
  `Registrar:`,
  ``,
  `El usuario completa el formulario de registro (nombre, email, contraseña, etc.)`,
  ``,
  `El frontend envía una petición POST a:`,
  ``,
  `http://localhost:3000/register`,
  ``,
  `El backend recibe los datos y realiza las comprobaciones necesarias:`,
  ``,
  `Que el email no esté registrado ya.`,
  ``,
  `Genera un id_user único.`,
  ``,
  `El backend guarda al usuario en la base de datos, en la tabla de usuarios.`,
  ``,
  `El frontend notifica al usuario de que la cuenta ha sido creada y le redirige a la página de login.`,
  ``,
  ``,
  `Login: `,
  ``,
  `El usuario escribe su email y contraseña en el formulario de login.`,
  ``,
  `El frontend realiza una petición POST a:`,
  ``,
  `http://localhost:3000/login`,
  ``,
  `El backend recibe las credenciales y comprueba en la base de datos:`,
  ``,
  `Que el email existe.`,
  ``,
  `Que la contraseña coincide con la almacenada (después de verificar el hash).`,
  ``,
  `Si la información es correcta, el backend crea los tokens de autenticación, por ejemplo:`,
  ``,
  `Un access token de corta duración.`,
  ``,
  `Un refresh token de más larga duración.`,
  ``,
  `El frontend almacena los tokens (en localStorage y eh https Cookies).`,
  ``,
  `El usuario es redirigido a home y ya puede acceder a rutas protegidas.`,
  ``,
  ``,
  `Pedidos:`,
  ``,
  `Cargar productos del Backend`,
  ``,
  `Al entrar en la página, hace una petición a:`,
  ``,
  `GET http://localhost:3000/productos`,
  ``,
  ``,
  `Los productos recibidos se normalizan y se muestran en una tabla.`,
  ``,
  `Cada producto tiene:`,
  ``,
  `Nombre`,
  ``,
  ``,
  `Precio`,
  ``,
  ``,
  `Proveedor`,
  ``,
  `Estado`,
  ``,
  `Imagen`,
  ``,
  `Descripción (mostrada al expandir la fila)`,
  ``,
  ` 2. Añadir productos al carrito`,
  ``,
  `Cada fila tiene un botón “Añadir al carrito”.`,
  ``,
  `	`,
  ``,
  `El carrito:`,
  ``,
  `Guarda { product, qty }`,
  ``,
  ``,
  `Puede aumentar o disminuir cantidades`,
  ``,
  `Puede eliminar productos`,
  ``,
  `Se muestra en un Drawer (panel lateral)`,
  ``,
  ``,
  `También calcula:`,
  ``,
  `Cantidad total de productos`,
  ``,
  `Precio total`,
  ``,
  `3. Confirmar y enviar pedido`,
  ``,
  `Al pulsar “Confirmar pedido”, se abre un diálogo con:`,
  ``,
  `Datos de dirección: calle, ciudad, estado, postal, país`,
  ``,
  `Notas opcionales`,
  ``,
  `Resumen del carrito`,
  ``,
  `Cuando se envía:`,
  ``,
  `Obtiene el usuario logueado con obtenerUsuario().`,
  ``,
  ``,
  `Construye un objeto payload con:`,
  ``,
  ``,
  `Usuario`,
  ``,
  `Proveedor`,
  ``,
  `Lista de productos con cantidad y precio`,
  ``,
  `Precio total`,
  ``,
  `Dirección`,
  ``,
  `Estado: “Pendiente”`,
  ``,
  `Envía un POST a:`,
  ``,
  `POST http://localhost:3000/pedidos`,
  ``,
  ``,
  `Si la petición es correcta:`,
  ``,
  `Vacía el carrito`,
  ``,
  `Cierra los diálogos`,
  ``,
  `Muestra un mensaje de éxito`,
  ``,
  ``,
  ` 4. Interfaz visual avanzada (Material UI)`,
  ``,
  `El código utiliza Material UI para:`,
  ``,
  `La tabla de productos`,
  ``,
  `Avatares e iconos`,
  ``,
  `Drawer del carrito`,
  ``,
  `Diálogo de confirmación`,
  ``,
  `Snackbars de notificación`,
  ``,
  `Todo esto da una interfaz moderna y profesional.`,
  ``,
  `Historial pedidos:`,
  ``,
  `Este componente muestra al usuario un historial de todos los pedidos que ha realizado.`,
  ``,
  `Incluye:`,
  ``,
  `Tabla con pedidos del usuario`,
  ``,
  `Cambiar el estado del pedido (Pendiente, En tránsito, Entregado)`,
  ``,
  `Eliminar pedidos`,
  ``,
  `Descargar historial en PDF`,
  ``,
  `Es la pantalla complementaria del componente anterior:`,
  `  El componente anterior crea pedidos`,
  `  Este componente muestra y gestiona los pedidos creados`,
  ``,
  `El componente anterior enviaba pedidos al backend, este componente en cambio los recupera mediante un GET y filtra solo los pedidos del usuario actual`,
  ``,
  `Permite ver sus productos, estado y proveedor`,
  ``,
  `Muestra:`,
  ``,
  `Nombre del proveedor (provider_name)`,
  ``,
  `Lista de productos (products[].product_name)`,
  ``,
  `Precio total (total_price)`,
  ``,
  `Estado del pedido (status).`,
  ``,
  `Permite editar el estado del pedido:`,
  ``,
  `Cambia entre “Pendiente”, “En transito” y “Entregado”.`,
  ``,
  ``,
  ` Permite eliminar un pedido:`,
  ``,
  `Puedes eliminar un pedido  con un DELETE`,
  ``,
  ``,
  `Permite descargar un PDF`,
  ``,
  `Crea un PDF con todo el historial usando jsPDF y jspdf-autotable.`,
  ``,
  ``,
  ``,
  `Base de Datos:`,
  ``,
  `Una base de datos es una colección organizada de información estructurada que se almacena electrónicamente en un sistema informático. Permite almacenar, organizar y recuperar grandes volúmenes de datos de forma rápida y eficiente.`,
  ``,
  ``,
  `La base de datos utilizada es Mongodb, sistema de gestión de bases de datos NoSQL, de código abierto, que almacena datos en documentos flexibles similares a JSON en lugar de tablas y filas.`,
  ``,
  ``,
  `Colecciones utilizadas:`,
  ``,
  ` Nuestra base de datos consta de un total de 8 colecciones:`,
  ``,
  `Alérgenos: Se utilizará en futuras versiones, ya que no hemos podido terminar todas las ideas que teníamos pensadas.`,
  ``,
  `Inventario: En el que se almacenan los productos añadidos por el proveedor para su posterior venta.`,
  ``,
  `Mensajes: En esta colección se guardan los mensajes y chats creados por los usuarios.`,
  ``,
  `Pedidos: Almacena los pedidos realizados según el usuario`,
  ``,
  `Posts: En esta colección se guardan los artículos que aparecen en la página “home”, en novedades.`,
  ``,
  `Productos: Se utiliza para almacenar todos los productos de los proveedores.`,
  ``,
  `Proveedores: Almacena todos los proveedores que estén dados de alta en la aplicación.`,
  ``,
  `Usuarios: Almacena todos los usuarios registrados en la aplicación, no guarda los proveedores.`,
  ``,
  ``,
  `USO DE LA IA:`,
  ``,
  `En este proyecto, hemos intentado no hacer uso de la IA para que de esta manera podamos aprender y adquirir la mayoría de conocimientos. Pero tenemos que mencionar que en algunas ocasiones hemos tenido que utilizarla para hacer que esta sea una herramienta de trabajo que nos ayude a resolver problemas.`,
  ``,
  `1. La primera razón del uso de la IA ha sido cuando teníamos un problema y no sabíamos cómo solucionarlo, por ejemplo, no nos cargaban los datos del código postal en editar perfil, y consultando a la IA llegamos a la respuesta del problema, y era que no había declarado bien postalcode en el get, ya que tenía que poner  postalCode con C en mayúsculas.`,
  ``,
  `2. Por otra parte, hemos utilizado la IA para adecuar los estilos, esto es, por ejemplo, al realizar el apartado de novedades, no me cuadraba bien el botón de descubrir más y tuve que acudir a la IA para que me ayudara. Los usos en problemas de estilos son otra razón por la que hemos utilizado la IA, eso sí, solo en casos de no lograr los objetivos, pero al recortar la fecha de entrega una semana nos veíamos obligados a no perder tanto tiempo.`,
  ``,
  ``,
  `ENLACES DE INTERÉS:`,
  ``,
  `Enlaces a nuestros repositorios:`,
  ``,
  `API: https://github.com/ProviSysERP/API.git`,
  ``,
  `ERP (frontend): https://github.com/ProviSysERP/ERP.git`,
  ``,
  `Enlace a la página principal de MUI (componentes utilizados):`,
  ``,
  `https://mui.com/components/`,
  ``,
  `Páginas que en las que nos hemos inspirado para el diseño:`,
  ``,
  `https://www.coca-cola.com/es/es/offerings/powerade-pause-is-power?utm_source=google_p&utm_medium=Search&utm_campaign=EU2550047040&utm_content=link&gad_source=1&gad_campaignid=22825100848&gbraid=0AAAAAoTdRSV2CFM7HtPg_X59eQYNFNSCi&gclid=Cj0KCQiAoZDJBhC0ARIsAERP-F8WexfJ_yu7qmVgrmOvIwMBKPmVIIb7QlxitJ9GKMd-XxgdKCdq6boaAueYEALw_wcB `,
  ``,
  `Mediante la aplicación web de coca-cola nos hemos inspirado para hacer el apartado de novedades.`,
  ``,
  `https://www.pringles.com/es/home.html `,
  ``,
  `Buscábamos más inspiración para los apartados de productos, aunque al final no nos inspiraríamos en muchos apartados. `,
  ``,
  ``,
  `CONCLUSIÓN:`,
  ``,
  `Gracias al desarrollo de este proyecto hemos adquirido muchos conocimientos teniendo una evolución notable en el desarrollo de un ERP.`,
  ``,
  ``,
  `Conocimientos previos:`,
  ``,
  `Para empezar, cuando se nos planteó el reto, anteriormente habíamos trabajado en la creación de una página web, por lo tanto, entendemos la estructura del proyecto (Backend, Frontend y base de datos). `,
  ``,
  ``,
  `Por otra parte, tenemos diferencias respecto al reto anterior, esta vez teníamos que trabajar con una base de datos NoSQL, llamada MongoDB; además, tenemos que trabajar con componentes de MUI para el diseño de la página.`,
  ``,
  `Cosas que tenemos que aprender y tareas que hemos realizado para obtener esos conocimientos:`,
  ``,
  ``,
  `Conocimientos adquiridos:`,
  ``,
  ``,
  `Uso concreto de React junto a express y Node para crear una página web.`,
  ``,
  `Uso de MUI para creación de interfaces más útiles.`,
  ``,
  ``,
  ``,
  `Reflexión/Conclusión individuales:`,
  ``,
  `Iker: En mi opinión, mediante este reto he adquirido una gran cantidad de conocimientos, especial en los apartados de Bases de datos, ya que no había trabajado con ninguna base de datos NoSQL, además de que apenas había trabajado en la conexión a bases de datos. Además, tengo que mencionar que actualmente sé crear colecciones en MongoDB, sé hacer consultas a estas gracias al ejercicio de Iñigo y a las diferentes fases del reto. `,
  ``,
  `Por otra parte, anteriormente ya habíamos trabajado en JavaScript, pero actualmente sé utilizar los diferentes componentes de MUI y sé adaptarlos a un proyecto como el desarrollado actualmente. Por otro lado, tengo que mencionar que no había trabajado con electron, pero ahora sé cómo funciona además, se crear vínculos, menús, etc.`,
  ``,
  ``,
  `Después, una vez que ya hablado del frontend y de la base de datos, me toca hablar sobre la API, para este apartado hemos utilizado express y node, herramienta la cual no había utilizado anteriormente. Pero gracias al trabajo realizado, sé cómo crear métodos GET, POST, PUT y DELETE para editar, crear, añadir y eliminar datos. Después, teníamos que conectar esto con la base de datos y con el frontend, donde hicimos uso del corss… conseguí la conexión y pude hacer esos métodos.`,
  ``,
  ``,
  `En conclusión, he aprendido muchas cosas nuevas, ya que no tenía apenas conocimientos de MUI, MongoDB y de node o express. Y puedo mencionar que actualmente puedo realizar proyectos y entenderlos a la perfección.`,
  ``,
  ``,
  `Jon: En mi opinión, este reto ha sido muy caótico, ya que había muchas cosas que no sabía hacer, como el uso de electron y aunque hubiéramos usado el año pasado también react. Me ha servido para aprender sobre cómo trabajar con una base de datos noSQL, que sinceramente me ha resultado más sencillo que trabajar con MySQL como el año pasado. También he aprendido cosas sobre el uso de MUI, no sabía que había un algo que te ofreciera tantos componentes de forma tan sencilla, y me ha servido mucho a la hora de desarrollar mi módulo. Por otro lado, lo que viene a ser la parte de express y node se me ha complicado un poco, porque no entendía nada. `,
  ``,
  `Por resumir, el reto en sí me habría gustado, desarrollar la aplicación habría sido mucho más divertido si nos hubieran dejado más tiempo. Porque me parece que nos han querido impartir demasiado para el poco tiempo que nos han ofrecido. Para la siguiente deberían pensar un poco en que no podemos hacer un proyecto de este calibre en solo dos semanas.`,
  ``,
  `Gari: Este reto ha sido, en la manera más positiva en la que puedo ponerlo, un desastre administrativo que hubiera necesitado bastante más tiempo si es que realmente quisiéramos conseguir una aplicación semidecente y aprender algo en el camino. He aprendido un par de cosas muy básicas de algunos apartados, como electron y mui, pero no he tenido el tiempo para profundizar y elaborar estos temas como para sentir que haya sinceramente avanzado mis conocimientos en ningún respecto. Se nos han mantenido bastantes fechas de manera poco transparente, y eso ha hecho que todo nuestro trabajo haya sido terminado a prisas y sin ganas, haciendo esto una experiencia muy desagradable. `,
  ``,
  `A estas alturas, no hago una reflexión en mi mismo ya que se en lo que he fallado y en lo que no, sino en el centro y los encargados de este reto por manejarlo de la manera de la que lo han hecho. Espero que la organización mejore de una vez, porque, con todo mi respeto, siento que estoy perdiendo el tiempo, y espero que se tome en cuenta la dificultad de llevar este reto adelante al valorarnos en nuestra entrega.`,
  ``,
  `Odei: En mi caso, este reto ha sido otra vez bastante frustrante que útil. No porque el proyecto no pudiera ser interesante, sino porque la gestión, los tiempos y la forma en la que se han ido marcando las entregas han hecho imposible trabajar con calma o profundizar en lo que realmente deberíamos haber aprendido. Hemos pasado más tiempo intentando adaptarnos a cambios, improvisaciones y fechas que aparecen sin previsión, que entendiendo los contenidos que deberíamos recibir y desarrollar algo de lo cual estemos mínimamente algo orgullosos. Siento que todo se ha construido con prisas, sin continuidad y sin una guía clara, lo que ha convertido el reto en algo agobiante. Ojalá en futuras ediciones exista una planificación realista, porque tal y como se ha planteado, la sensación que queda es la de estar desperdiciando el tiempo.`,
  ``,
  `Kristian: En mi opinión este reto como los anteriores ha faltado organización con los plazos de entrega, se nos pide entregar una aplicación funcional y en condiciones, pero con los conocimientos básicos que teníamos no se nos ha provista el tiempo suficiente para acabar la aplicación y pulir los detalles. He adquirido conocimientos básicos sobre el manejo de apis con JavaScript y el uso de mongoDB y react.`,
  ``,
  ``,
  `En conclusión, este reto me hubiese gustado más si hubiésemos tenido el tiempo necesario para sacar un producto con el que nos sintamos cómodos.`,
];

const images = [
  { src: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`, alt: `image1.png` },
  { src: `data:image/png;base64,...`, alt: `image2.jpeg` }
];


function groupSections(paragraphsArray) {
  const sections = [];
  let current = { title: null, body: [] };

  const isHeader = (s) => {
    if (!s) return false;
    const trimmed = s.trim();
    return trimmed.length > 0 && trimmed === trimmed.toUpperCase() && trimmed.length < 120;
  };

  for (const p of paragraphsArray) {
    if (isHeader(p)) {
      if (current.title !== null || current.body.length) {
        sections.push({ ...current });
      }
      current = { title: p, body: [] };
    } else {
      current.body.push(p);
    }
  }
  if (current.title !== null || current.body.length) sections.push({ ...current });

  return sections;
}

export default function InformeFinal() {
  const sections = groupSections(paragraphs);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", py: 8, px: 2, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Card
            elevation={6}
            sx={{
              overflow: "hidden",
              borderRadius: 3,
              mb: 4,
              color: "common.white",
              background: "linear-gradient(135deg, #0f62fe 0%, #7c4dff 100%)"
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    NovaTechZeo
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                {sections.map((sec, idx) => (
                  <Card key={idx} elevation={3} sx={{ borderRadius: 3 }}>
                    <CardContent>
                      {sec.title && (
                        <>
                          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                            {sec.title}
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                        </>
                      )}

                      {sec.body.map((p, i) => (
                        <Typography key={i} variant="body1" paragraph sx={{ whiteSpace: "pre-line" }}>
                          {p}
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ position: "sticky", top: 24 }}>
                <Card elevation={2} sx={{ borderRadius: 3, mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      Imágenes del documento
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                      {images.map((img, i) => (
                        <Grid item xs={12} sm={6} key={i}>
                          <Card>
                            <CardMedia
                              component="img"
                              image={img.src}
                              alt={img.alt}
                              sx={{ height: 120, objectFit: "contain", bgcolor: "#f5f5f5" }}
                            />
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>

                <Card elevation={2} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      Resumen rápido
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <List disablePadding dense>
                      <ListItem>
                        <ListItemIcon>
                          <BusinessCenterIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Componentes"
                          secondary="Frontend, Backend, BD"
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemIcon>
                          <RestaurantMenuIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Sector"
                          secondary="Hostelería (enfoque principal)"
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemIcon>
                          <SyncAltIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Integraciones"
                          secondary="Comunicación empresa ↔ proveedor"
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemIcon>
                          <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Roles"
                          secondary="Administradores y usuarios"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
