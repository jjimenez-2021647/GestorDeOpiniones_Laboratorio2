import { body, param } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';
import { requireRole } from './validate-role.js';

export const validateCreateComment = [
    validateJWT,
    requireRole('USER_ROLE'),
    body('postId')
        .notEmpty()
        .withMessage('El ID de la publicación es requerido')
        .isMongoId()
        .withMessage('El ID de la publicación no es válido'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('El contenido es requerido')
        .isLength({ min: 1, max: 500 })
        .withMessage('El comentario debe tener entre 1 y 500 caracteres'),
    checkValidators
];

export const validateUpdateComment = [
    validateJWT,
    requireRole('USER_ROLE', 'ADMIN_ROLE'),
    param('id')
        .notEmpty()
        .withMessage('El ID del comentario es requerido')
        .isMongoId()
        .withMessage('El ID del comentario no es válido'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('El contenido es requerido')
        .isLength({ min: 1, max: 500 })
        .withMessage('El comentario debe tener entre 1 y 500 caracteres'),
    checkValidators
];

export const validateCommentById = [
    validateJWT,
    requireRole('USER_ROLE', 'ADMIN_ROLE'),
    param('id')
        .notEmpty()
        .withMessage('El ID del comentario es requerido')
        .isMongoId()
        .withMessage('El ID del comentario no es válido'),
    checkValidators
];