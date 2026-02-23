'use strict'

import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'La publicación es requerida']
    },
    userId: {
        type: String,
        required: [true, 'El usuario es requerido']
    },
    username: {
        type: String,
        required: [true, 'El nombre de usuario es requerido'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'El contenido es requerido'],
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

commentSchema.index({ postId: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ createdAt: -1 });

export default mongoose.model('Comment', commentSchema);