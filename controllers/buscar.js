const { response } = require("express")
const { ObjectId } = require('mongoose').Types

const { Usuario, Categoria, Producto } = require("../models")


const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios',
]


const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }
    
    const regex = new RegExp( termino, 'i' )

    const usuarios = await Usuario.find({ 
        $or: [ { nombre: regex}, { correo: regex }],    
        $and: [{ estado: true}]
    })
    
    return res.json({
        results: usuarios
    });

}
const buscarCategoria = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }
    
    const regex = new RegExp( termino, 'i' )

    const categoria = await Categoria.find({ nombre: regex, estado: true })
    
    return res.json({
        results: categoria
    });
}
const buscarProducto = async( termino = '', res = response ) => {
    
    console.log(`El termino es: ${termino}`)
    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const producto = await Producto.findById(termino)
                                .populate('categoria', 'nombre')
                                .populate('usuario', 'nombre')
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }
    
    const regex = new RegExp( termino, 'i' )
    
    const producto = await Producto.find({ nombre: regex, estado: true })
                            .populate('categoria', 'nombre')
                            .populate('usuario', 'nombre')
    
    
    return res.json({
        results: producto
    });
}

// search product by category


// validate an email with regex and comment each line

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params

    console.log(`Coleccion: ${coleccion}, termino: ${termino}`)
    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategoria( termino, res )
        break;
        case 'productos':
            buscarProducto( termino, res )
        break;
        case 'usuarios':
            buscarUsuarios( termino, res )
        break;
        default:
            res.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            })
    }

}




module.exports = {
    buscar
}