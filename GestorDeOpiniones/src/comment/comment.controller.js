'use strict'

import Comment from './comment.model.js';
import Publication from '../publications/publications.model.js';

// Crear comentario
export const createComment = async (req, res) => {
    try {
        const { postId, content } = req.body;

        // Verificar que la publicación existe
        const publication = await Publication.findById(postId);
        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        const comment = new Comment({
            postId,
            userId: req.userId,
            username: req.username,
            content
        });

        await comment.save();

        res.status(201).json({
            success: true,
            message: 'Comentario creado exitosamente',
            data: comment
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear el comentario',
            error: error.message
        });
    }
};

// Listar comentarios de una publicación
export const getCommentsByPublication = async (req, res) => {
    try {
        const { postId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const comments = await Comment.find({ postId, status: true })
            .limit(parseInt(limit))
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Comment.countDocuments({ postId, status: true });

        res.status(200).json({
            success: true,
            data: comments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los comentarios',
            error: error.message
        });
    }
};

// Obtener comentario por ID
export const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: comment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar el comentario',
            error: error.message
        });
    }
};

// Editar comentario
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        // Solo el dueño o admin puede editar
        if (comment.userId !== req.userId && req.userRole !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para editar este comentario'
            });
        }

        comment.content = content;
        await comment.save();

        res.status(200).json({
            success: true,
            message: 'Comentario actualizado exitosamente',
            data: comment
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar el comentario',
            error: error.message
        });
    }
};

// Eliminar comentario (borrado físico)
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        // Solo el dueño o admin puede eliminar
        if (comment.userId !== req.userId && req.userRole !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para eliminar este comentario'
            });
        }

        await Comment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Comentario eliminado exitosamente'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al eliminar el comentario',
            error: error.message
        });
    }
};