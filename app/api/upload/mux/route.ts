
import { NextResponse } from 'next/server';
import Mux from '@mux/mux-node';

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST() {
    try {
        const upload = await mux.video.uploads.create({
            cors_origin: '*', // In production, replace with your domain
            new_asset_settings: {
                playback_policy: ['public'],
                // mp4_support: 'standard', // optional
            },
        });

        return NextResponse.json({
            uploadUrl: upload.url,
            uploadId: upload.id,
        });
    } catch (error: any) {
        console.error('Mux upload error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
