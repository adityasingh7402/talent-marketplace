import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { message: 'User ID is required' },
                { status: 400 }
            );
        }

        // Fetch user profile from Supabase
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Don't send password to client
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json(
            {
                user: userWithoutPassword
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Get profile error:', error);
        return NextResponse.json(
            { message: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}
