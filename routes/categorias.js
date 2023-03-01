const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { 
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    borrarCategoria,
    actualizarCategoria } = require('../controllers/categorias');

const { existeCategoriaPorId, esRoleValido } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

router
// Obtener todas las categorías - público
    .get('/', obtenerCategorias)
    
    // Obtener una categoría por id - público
    .get('/:id',[
        check('id', 'No es un id de Mongo válido').isMongoId(),
        check('id').custom( existeCategoriaPorId ),
        validarCampos,
    ], obtenerCategoria )
    
    // Crear una categoría - privado - cualquier persona con un token válido
    .post('/', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        validarCampos
    ], crearCategoria)
    // Modificar una categoría - cualquier persona con un token válido
    .put('/:id',[
        validarJWT,
        check('nombre', 'El campo nombre es obligatorio').notEmpty(),
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( existeCategoriaPorId ),
        validarCampos
    ], actualizarCategoria )
    // Eliminar una categoría - rol => Admin - cualquier persona con un token válido
    .delete('/:id', [
        validarJWT,
        esAdminRole,
        check('id', 'No es un id válido').isMongoId(),
        validarCampos,
        check('id').custom( existeCategoriaPorId ),
        validarCampos,
    ], borrarCategoria)

module.exports = router;