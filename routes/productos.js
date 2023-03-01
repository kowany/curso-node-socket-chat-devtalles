const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { 
    obtenerProductos, 
    obtenerProducto, 
    actualizarProducto, 
    borrarProducto, 
    crearProducto, 
    obtenerProductoPorCategoria } = require('../controllers/productos');

const router = Router();

/**
 * {{url}}/api/productos
 */

router
// Obtener todos los productos - público
    .get('/', obtenerProductos)
    
    // Obtener un producto por id - público
    .get('/:id',[
        check('id', 'No es un id de Mongo válido').isMongoId(),
        check('id').custom( existeProductoPorId ),
        validarCampos,
    ], obtenerProducto )
    // Obtener un producto por categoria(id) - público

    .get('/categoria/:id',[
        check('id', 'No es un id de Mongo válido').isMongoId(),
        check('id').custom( existeCategoriaPorId ),
        validarCampos,
    ], obtenerProductoPorCategoria )
    
    // Crear un producto - privado - cualquier persona con un token válido
    .post('/', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('categoria', 'No es un id de MongoDB').isMongoId(),
        check('categoria').custom( existeCategoriaPorId ),
        validarCampos
    ], crearProducto)

    // Modificar un producto - cualquier persona con un token válido
    .put('/:id',[
        validarJWT,
        check('id', 'No es un id de MongoDB válido').isMongoId(),
        // check('categoria', 'No es un id de MongoDB válido').isMongoId(),
        check('id').custom( existeProductoPorId ),
        validarCampos
    ], actualizarProducto )

    // Eliminar un producto - Admin - cualquier persona con un token válido
    .delete('/:id', [
        validarJWT,
        esAdminRole,
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( existeProductoPorId ),
        validarCampos,
    ], borrarProducto)

module.exports = router;