import { cookies } from 'next/headers';
import { verifyToken, JWTPayload } from './jwt';

export async function getCurrentUser(): Promise<JWTPayload | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return null;
        }

        return verifyToken(token);
    } catch (error) {
        return null;
    }
}
