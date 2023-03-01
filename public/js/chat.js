const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://curso-node-restserver-devtalles-production.up.railway.app/api/auth/'

let usuario = null
let socket = null

// Referencias HTML
const txtUid     = document.querySelector('#txtUid')
const txtMensaje = document.querySelector('#txtMensaje')
const ulUsuarios = document.querySelector('#ulUsuarios')
const ulMensajes = document.querySelector('#ulMensajes')
const btnSalir   = document.querySelector('#btnSalir')

// Validar el token que se encuentra en el LocalStorage
const validarJWT = async () => {

    const token = localStorage.getItem( 'token' ) || ''

    if ( token.length <= 10 ) {
        window.location = 'index.html'
        throw new Error('No hay token el servidor')
    }

    const resp = await fetch(url, {
        headers: { 'x-token': token }
    })
    
    const { usuario: userDB, token: tokenDB } = await resp.json()
    localStorage.setItem('token', tokenDB)
    usuario = userDB
    document.title = usuario.nombre

    await conectarSocket()
 
}

const conectarSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    })

    socket.on('connect', () => {
        console.log('Socket online')
    })

    socket.on('disconnect', () => {
        console.log('Socket offline')
    })

    socket.on( 'recibir-mensajes', dibujarMensajes )

    socket.on( 'usuarios-activos', dibujarUsuarios )

    socket.on('mensaje-privado', (payload) => {
        console.log('Privado: ', payload)
    })
}

const dibujarUsuarios = ( usuarios = [] ) => {

    let usersHtml = ''
    usuarios.forEach( ({ nombre, uid }) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${nombre}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `
    });
    ulUsuarios.innerHTML = usersHtml
}
const dibujarMensajes = ( mensajes = [] ) => {

    let messagesHtml = ''
    mensajes.forEach( ({ mensaje, nombre }) => {    
        messagesHtml += `
            <li>
                <p>
                    <span class="text-primary">${nombre}</span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `
    });
    ulMensajes.innerHTML = messagesHtml
}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    const mensaje = txtMensaje.value.trim()
    const uid = txtUid.value

    if ( keyCode !== 13 ) { return }
    if (mensaje.length === 0) { return }

    socket.emit('enviar-mensaje', { mensaje, uid })

    txtMensaje.value = ''
})

const main = async () => {

    // validar JWT
    await validarJWT()

}

main()
// https://midufest.com?ticket=kowany


// Railway
// Fly.io
// Render