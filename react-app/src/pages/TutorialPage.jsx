import React from 'react';
import { Container, Typography, Box, Divider, Paper } from '@mui/material';

// Imágenes Tutorial 1
import CrearPerfilImg from '../assets/crearPerfil.png';
import EditarPerfilImg from '../assets/editarPerfil.png';
import EliminarPerfilImg from '../assets/eliminarPerfil.png';

// Imágenes Tutorial 2
import AccederChatImg from '../assets/accederChat.png';
import IniciarChatImg from '../assets/iniciarChat.png';
import EliminarChatImg from '../assets/eliminarChat.png';

const tutorials = [
  {
    title: 'Tutorial 1: Gestionando tu perfil de usuario',
    steps: [
      {
        title: '1. Crear un perfil',
        context: `El perfil de usuario permite identificarte en la plataforma, gestionar tus pedidos, productos y comunicaciones. Cada usuario necesita un perfil único para usar la aplicación, ¡Así que asegúrate de crear un perfil para acceder a Provisys!.`,
        instructions: [
          'Accede a la página de registro mediante el botón “Regístrate aquí”.',
          'Completa los campos con tus datos personales y de contacto (asegúrate de que sean veraces, ya que se requieren datos reales para utilizar nuestra aplicación).',
          'Una vez finalizado, confirma tu registro para activar tu cuenta.'
        ],
        notes: `Al crear un perfil, se genera un usuario único que te permite iniciar sesión usando tu correo y contraseña, recibir notificaciones y acceder a funciones restringidas según tu rol (usuario, proveedor o negocio). La funcionalidad de dichas opciones se verán más adelante.`,
        image: CrearPerfilImg
      },
      {
        title: '2. Editar tu perfil',
        context: `Actualizar tu perfil asegura que tu información esté siempre vigente y correcta, lo que facilita la comunicación con otros usuarios y el correcto funcionamiento de la aplicación, viendo que utilizamos muchos datos a tiempo real para, por ejemplo, el sistema de pedidos.`,
        instructions: [
          'Haz clic en el icono de perfil ubicado en la esquina superior derecha.',
          'Selecciona el botón “Perfil” para acceder a tu información.',
          'Pulsa “Editar” y modifica los campos necesarios.',
          'Guarda los cambios con el botón “Guardar”.'
        ],
        notes: `Puedes cambiar datos como nombre, correo electrónico o foto de perfil. Mantener estos datos actualizados garantiza que tus contactos y proveedores puedan reconocerte y contactarte correctamente, y es especialmente importante si tu empresa cambia de localización, por ejemplo.`,
        image: EditarPerfilImg
      },
      {
        title: '3. Eliminar tu perfil',
        context: `Eliminar tu perfil es una acción definitiva que elimina toda tu información del sistema. Solo debes hacerlo si ya no deseas usar la aplicación, ya que no hay manera de revertirlo y eliminará todo rastro de tu existencia en la página, incluyendo contactos, conversaciones, inventarios...`,
        instructions: [
          'Accede a tu perfil desde el icono en la esquina superior derecha.',
          'Haz clic en el botón “Perfil”.',
          'Presiona el botón rojo “Eliminar” y confirma la operación.'
        ],
        notes: `Esta acción elimina todos tus datos personales, historial de pedidos y cualquier interacción que hayas tenido dentro de la plataforma. Si eliminas tu cuenta, ni siquiera podrá restaurar tus datos un administrador. ¡Ten cuidado!`,
        image: EliminarPerfilImg
      }
    ]
  },
  {
    title: 'Tutorial 2: Usar el Chat en la plataforma',
    steps: [
      {
        title: '1. Acceder al chat',
        context: `El chat permite mantener una comunicación directa y rápida dentro de la plataforma, ya sea para resolver dudas, coordinar pedidos o compartir información relevante. Solo los usuarios registrados (proveedores o negocios) pueden enviar y recibir mensajes.`,
        instructions: [
          'Inicia sesión con tu cuenta de proveedor o negocio.',
          'Dirígete al apartado “Chat” desde:\n- El menú lateral, o\n- El icono del sobre en la esquina superior derecha.'
        ],
        notes: `La ubicación del icono y del menú permite acceder rápidamente a tus conversaciones sin importar en qué sección de la aplicación te encuentres. Muy útil para cuando estés en medio de una conversación y tengas que comprobar algún dato en alguna parte.`,
        image: AccederChatImg
      },
      {
        title: '2. Iniciar una conversación',
        context: `Puedes abrir un chat con cualquier contacto autorizado para interactuar directamente, lo que facilita la resolución de dudas o la coordinación de pedidos y productos. Ahora bien, asegurate de solo contactar con alguien cuando sepas que esa persona está dispuesta a contactarte, o de lo contrario es posible que te eliminen la conversación.`,
        instructions: [
          'Dentro de la página de chat, haz clic en el botón “Nuevo chat” (esquina inferior derecha).',
          'Selecciona la persona o entidad con la que deseas conversar desde el menú.',
          'Escribe tu mensaje y envíalo. Les debería de llegar al instante, aunque igual requieren esperar un momento para que les funcione la página.'
        ],
        notes: `Al abrir un chat, se crea un historial que permite revisar conversaciones pasadas, asegurando continuidad y claridad en la comunicación. Es decir, que es tan simple como pulsar el usuario que quieras para seguir la conversación que estuvieras teniendo con ellos.`,
        image: IniciarChatImg
      },
      {
        title: '3. Eliminar una conversación',
        context: `Eliminar un chat permite mantener tu espacio de trabajo organizado y proteger tu información, eliminando conversaciones que ya no son relevantes. Ten en cuenta que las conversaciones que borres se eliminarán para los dos usuarios, haciendo además imposible recuperarla, aunque sí podrás empezar una conversación nueva con el mismo usuario más adelante.`,
        instructions: [
          'Accede al apartado “Chat” y entra en la conversación que desees borrar.',
          'Haz clic en el botón “Borrar chat” y confirma la ventana emergente.'
        ],
        notes: `Esta acción elimina permanentemente el historial de la conversación para ese chat específico. Afecta a ambos usuarios, como ya hemos dicho previamente, así que ten cuidado a la hora de eliminar chats; Quizás haya algo importante en ellos que aún quieras conservar.`,
        image: EliminarChatImg
      }
    ]
  }
];

const TutorialPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {tutorials.map((tutorial, tIdx) => (
        <Box key={tIdx} mb={6}>
          <Typography variant="h4" gutterBottom>
            {tutorial.title}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {tutorial.steps.map((step, sIdx) => (
            <Paper key={sIdx} elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                {step.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" paragraph>
                Contexto: {step.context}
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
              <Typography variant="body2" color="text.secondary">
                Nota: {step.notes}
              </Typography>
            </Paper>
          ))}
        </Box>
      ))}
    </Container>
  );
};

export default TutorialPage;
