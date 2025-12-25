
import { NextResponse } from 'next/server';
import Mux from '@mux/mux-node';
import { createClient } from '@supabase/supabase-js';

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

// Configure Supabase Admin for updates
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { userId, muxUploadId } = await req.json();

        if (!userId || !muxUploadId) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // 1. Check Upload Status on Mux
        const upload = await mux.video.uploads.retrieve(muxUploadId);

        if (upload.status === 'asset_created' && upload.asset_id) {
            // 2. Get Asset details
            const asset = await mux.video.assets.retrieve(upload.asset_id);
            const playbackId = asset.playback_ids?.[0]?.id;

            if (playbackId) {
                // 3. Update User in DB
                const { error } = await supabaseAdmin
                    .from('users')
                    .update({
                        mux_asset_id: upload.asset_id,
                        mux_playback_id: playbackId
                    })
                    .eq('id', userId);

                if (error) throw error;

                return NextResponse.json({
                    success: true,
                    playbackId,
                    status: 'synced'
                });
            }
        }

        return NextResponse.json({
            success: true,
            status: upload.status,
            message: 'Video is still processing or no asset found yet.'
        });

    } catch (error: any) {
        console.error('Mux sync error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
