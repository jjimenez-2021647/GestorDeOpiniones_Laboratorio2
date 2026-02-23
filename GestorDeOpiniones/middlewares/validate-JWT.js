import jwt from 'jsonwebtoken';

export const validateJWT = (req, res, next) => {
    const jwtConfig = {
        secret: process.env.JWT_SECRET,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE
    }

    if (!jwtConfig.secret) {
        return res.status(500).json({
            success: false,
            message: 'Configuración del servidor inválida: falta JWT_SECRET'
        })
    }

    const token =
        req.header('x-token') ||
        req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No se proporcionó un token',
            error: 'MISSING_TOKEN'
        })
    }

    try {
        const decodedToken = jwt.verify(token, jwtConfig.secret, {
            issuer: jwtConfig.issuer,
            audience: jwtConfig.audience
        })

        req.user = decodedToken;
        req.userId = decodedToken.sub;        // UUID del usuario en PostgreSQL
        req.username = decodedToken.username; // nombre de usuario
        req.userRole = decodedToken.role;     // Admin o user

        next();
    } catch (error) {
        const isExpired = error.name === 'TokenExpiredError';

        return res.status(isExpired ? 401 : 400).json({
            success: false,
            message: isExpired ? 'Token expirado' : 'Token inválido',
            error: isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
            details: error.message
        })
    }
}