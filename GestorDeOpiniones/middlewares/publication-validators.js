import { body, param } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';
import { requireRole } from './validate-role.js';

export const validateCreatePublication = [
    validateJWT,
    requireRole('USER_ROLE'),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('El título es requerido')
        .isLength({ min: 3, max: 100 })
        .withMessage('El título debe tener entre 3 y 100 caracteres'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('La categoría es requerida')
        .isLength({ min: 2, max: 50 })
        .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('El contenido es requerido')
        .isLength({ min: 10 })
        .withMessage('El contenido debe tener al menos 10 caracteres'),
    body('image')
        .optional()
        .isURL()
        .withMessage('La imagen debe ser una URL válida'),
    checkValidators
];

export const validateUpdatePublication = [
    validateJWT,
    requireRole('USER_ROLE', 'ADMIN_ROLE'),
    param('id')
        .notEmpty()
        .withMessage('El ID de la publicación es requerido')
        .isMongoId()
        .withMessage('El ID de la publicación no es válido'),
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('El título debe tener entre 3 y 100 caracteres'),
    body('category')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
    body('content')
        .optional()
        .trim()
        .isLength({ min: 10 })
        .withMessage('El contenido debe tener al menos 10 caracteres'),
    body('image')
        .optional()
        .isURL()
        .withMessage('La imagen debe ser una URL válida'),
    checkValidators
];

export const validatePublicationById = [
    validateJWT,
    requireRole('USER_ROLE', 'ADMIN_ROLE'),
    param('id')
        .notEmpty()
        .withMessage('El ID de la publicación es requerido')
        .isMongoId()
        .withMessage('El ID de la publicación no es válido'),
    checkValidators
];