'use strict'

import mongoose from "mongoose";

const publicationSchema = mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'El usuario es requerido']
    },
    username: {
        type: String,
        required: [true, 'El nombre de usuario es requerido'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'El título es requerido'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'La categoría es requerida'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'El contenido es requerido'],
        trim: true
    },
    image: {
        type: String,
        default: null
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

publicationSchema.index({ userId: 1 });
publicationSchema.index({ category: 1 });
publicationSchema.index({ status: 1 });
publicationSchema.index({ createdAt: -1 });

export default mongoose.model('Publication', publicationSchema);