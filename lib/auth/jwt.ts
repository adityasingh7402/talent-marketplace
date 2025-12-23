import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';

export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    roleCategory: string;
    status: string;
}

export const signToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '30d',
    });
};

export const verifyToken = (token: string): JWTPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
        return null;
    }
};
