const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://curso-node-restserver-devtalles-production.up.railway.app/api/auth/'

const miFormulario = document.querySelector('form')

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault()
    const formData = {}

    for( let el of miFormulario.elements ) {
        if ( el.name.length > 0) {
            formData[el.name] = el.value
        }
    }
    // console.log(formData)
    fetch(url + 'login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( formData )
    })
    .then(resp => resp.json())
    .then(({ msg, token }) => {
        if( msg ) {
            return console.error( msg )
        }
        localStorage.setItem('token', token)
        window.location = 'chat.html'
    })
    .catch(console.warn)
    
})

function handleCredentialResponse(response) {
    // Google Token || ID_TOKEN
    // console.log('id_token: ', response.credential)
    
    
    const body = { id_token: response.credential }
    
    fetch(url + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(resp => resp.json())
    .then(({ token }) => {
        console.log('Nuestro server: ', token),
        localStorage.setItem('token', token)
        window.location = 'chat.html'
    })
    .catch(console.warn)
}

const button = document.getElementById('google_signout')

button.onclick = () => {
    google.accounts.id.disableAutoSelect()
    google.accounts.id.revoke(localStorage.getItem('token'), done => {
        localStorage.clear()
        location.reload()
    })
}