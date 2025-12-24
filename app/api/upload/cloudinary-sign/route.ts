
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp: timestamp,
                folder: 'talent_profiles', // Optional: organize uploads
            },
            process.env.CLOUDINARY_API_SECRET!
        );

        return NextResponse.json({
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
        });
    } catch (error: any) {
        console.error('Cloudinary signature error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
