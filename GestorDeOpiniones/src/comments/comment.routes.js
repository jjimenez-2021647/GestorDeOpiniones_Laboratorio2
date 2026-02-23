'use strict'

import { Router } from "express";
import {
    createComment,
    getCommentsByPublication,
    getCommentById,
    updateComment,
    deleteComment
} from "./comment.controller.js";
import {
    validateCreateComment,
    validateUpdateComment,
    validateCommentById
} from "../../middlewares/comment-validators.js";
import { validateJWT } from "../../middlewares/validate-JWT.js";

const router = Router();

router.post('/create', validateCreateComment, createComment)
router.get('/publication/:postId', validateJWT, getCommentsByPublication)
router.get('/:id', validateCommentById, getCommentById)
router.put('/:id', validateUpdateComment, updateComment)
router.delete('/:id', validateCommentById, deleteComment)

export default router;