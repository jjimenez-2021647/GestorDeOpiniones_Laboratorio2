'use strict'

import { Router } from "express";
import {
    createPublication,
    getPublications,
    getPublicationById,
    updatePublication,
    togglePublicationStatus,
    deletePublication
} from "./publications.controller.js";
import {
    validateCreatePublication,
    validateUpdatePublication,
    validatePublicationById
} from "../../middlewares/publication-validators.js";
import { validateJWT } from "../../middlewares/validate-JWT.js"; 
import { upload } from "../../middlewares/cloudinary.js";

const router = Router();

router.post('/create', upload.single('image'), validateCreatePublication, createPublication)
router.get('/', validateJWT, getPublications)
router.get('/:id', validatePublicationById, getPublicationById)
router.put('/:id', upload.single('image'), validateUpdatePublication, updatePublication)
router.patch('/:id/toggle', validatePublicationById, togglePublicationStatus)
router.delete('/:id', validatePublicationById, deletePublication)

export default router;