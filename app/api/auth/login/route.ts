import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/db/supabase';
import { signToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // Find user with password
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();

        if (error || !user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate token
        const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            roleCategory: user.role_category,
            status: user.status,
        });

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        });

        return NextResponse.json(
            {
                message: 'Login successful',
                user: {
                    id: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    role: user.role,
                    roleCategory: user.role_category,
                    status: user.status,
                }
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}
