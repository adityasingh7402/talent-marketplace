import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/db/supabase';
import { signToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    console.log('🔥 Signup endpoint called!');
    try {
        const { firstName, lastName, email, password, role } = await req.json();
        console.log('📝 Received signup data:', { firstName, lastName, email, role: role || 'actor' });

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email.toLowerCase())
            .single();

        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Determine role category
        let roleCategory = 'talent';
        if (['casting_director', 'production_manager', 'art_director', 'costume_designer', 'makeup_artist', 'sound_engineer'].includes(role)) {
            roleCategory = 'industry_professional';
        } else if (['admin', 'moderator'].includes(role)) {
            roleCategory = 'admin';
        }

        // Create user in Supabase
        const { data: user, error } = await supabase
            .from('users')
            .insert([
                {
                    first_name: firstName,
                    last_name: lastName,
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    role: role || 'actor',
                    role_category: roleCategory,
                    status: 'pending',
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('❌ Supabase error:', error);
            throw new Error(error.message);
        }

        console.log('✅ User created successfully:', user.id);

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
                message: 'User created successfully',
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
            { status: 201 }
        );
    } catch (error: any) {
        console.error('❌ Signup error:', error);
        return NextResponse.json(
            { message: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}
