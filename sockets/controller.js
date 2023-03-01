const { Socket } = require('socket.io')
const { comprobarJWT } = require('../helpers')
const { ChatMensajes } = require('../models')

const chatMensajes = new ChatMensajes()

const socketController = async( socket = new Socket(), io ) => {

    const usuario = await comprobarJWT( socket.handshake.headers['x-token'] )

    if ( !usuario ) {
        return socket.disconnect()
    }

    // Agregar el usuario conectado
    chatMensajes.conectarUsuario( usuario )
    io.emit('usuarios-activos', chatMensajes.usuariosArr)

    // Conectarlo a una sala especial
    socket.join( usuario.id ) // sala global (io), otra sala por el socket.id y
                              // ahora creamos una última con el usuario.id

    // Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario( usuario.id );
        io.emit('usuarios-activos', chatMensajes.usuariosArr );
    })

    // El servidor funciona como un intermediario, no es que uno le pueda
    // enviar un mensaje de una persona conectada a otra sin que el servidor
    // se de cuenta. Los usuario no están conecetados entre sí directamente.
    // Cualquier usuario que quiera mandar un mensaje a otro primero se lo
    // envía al servidor y luego éste se lo envía al destinario(s) final
    socket.on('enviar-mensaje', ({ uid, mensaje }) => {
        if ( uid ) {
            // Mensaje privado
            socket.to( uid ).emit('mensaje-privado', { de: usuario.nombre, mensaje })
        } else {
            chatMensajes.enviarMensaje( usuario.id, usuario.nombre, mensaje )
            io.emit('recibir-mensajes', chatMensajes.ultimos10)
        }
    })

}



module.exports = {
    socketController
}