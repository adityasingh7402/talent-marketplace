import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';

export async function GET() {
    try {
        const supabase = supabaseAdmin();

        // Get total users
        const { count: totalUsers, error: usersError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        // Get pending users
        const { count: pendingUsers, error: pendingError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        // Get total leads
        const { count: totalLeads, error: leadsError } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true });

        if (usersError || pendingError || leadsError) {
            throw new Error('Failed to fetch stats');
        }

        return NextResponse.json({
            totalUsers: totalUsers || 0,
            pendingUsers: pendingUsers || 0,
            totalLeads: totalLeads || 0,
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
