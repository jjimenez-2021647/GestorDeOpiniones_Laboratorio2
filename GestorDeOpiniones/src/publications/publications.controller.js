'use strict'

import Publication from './publications.model.js';
import Comment from '../comments/comment.model.js';

// Crear publicación
export const createPublication = async (req, res) => {
    try {
        const { title, category, content, image } = req.body;

        const publication = new Publication({
            userId: req.userId,
            username: req.username,
            title,
            category,
            content,
            image: image || null
        });

        await publication.save();

        res.status(201).json({
            success: true,
            message: 'Publicación creada exitosamente',
            data: publication
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear la publicación',
            error: error.message
        });
    }
};

// Listar todas las publicaciones
export const getPublications = async (req, res) => {
    try {
        const { page = 1, limit = 10, category } = req.query;

        const filter = {};
        if (category) filter.category = category;

        const publications = await Publication.find(filter)
            .limit(parseInt(limit))
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Publication.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: publications,
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
            message: 'Error al obtener las publicaciones',
            error: error.message
        });
    }
};

// Obtener publicación por ID
export const getPublicationById = async (req, res) => {
    try {
        const { id } = req.params;

        const publication = await Publication.findById(id);

        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: publication
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar la publicación',
            error: error.message
        });
    }
};

// Editar publicación
export const updatePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, content, image } = req.body;

        const publication = await Publication.findById(id);

        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        // Solo el dueño o admin puede editar
        if (publication.userId !== req.userId && req.userRole !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para editar esta publicación'
            });
        }

        const updated = await Publication.findByIdAndUpdate(
            id,
            { title, category, content, image },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Publicación actualizada exitosamente',
            data: updated
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar la publicación',
            error: error.message
        });
    }
};

// Ocultar/Mostrar publicación (toggle status)
export const togglePublicationStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const publication = await Publication.findById(id);

        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        // Solo el dueño o admin puede ocultar
        if (publication.userId !== req.userId && req.userRole !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para realizar esta acción'
            });
        }

        publication.status = !publication.status;
        await publication.save();

        res.status(200).json({
            success: true,
            message: `Publicación ${publication.status ? 'activada' : 'ocultada'} exitosamente`,
            data: publication
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al cambiar el estado de la publicación',
            error: error.message
        });
    }
};

// Eliminar publicación (borrado físico)
export const deletePublication = async (req, res) => {
    try {
        const { id } = req.params;

        const publication = await Publication.findById(id);

        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        // Solo el dueño o admin puede eliminar
        if (publication.userId !== req.userId && req.userRole !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para eliminar esta publicación'
            });
        }

        // Desactivar comentarios asociados
        await Comment.updateMany(
            { postId: id },
            { status: false }
        );

        await Publication.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Publicación eliminada y comentarios desactivados exitosamente'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al eliminar la publicación',
            error: error.message
        });
    }
};