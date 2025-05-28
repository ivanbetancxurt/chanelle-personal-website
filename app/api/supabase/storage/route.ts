import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); // export supabase client

// store the provided image into storage and return its name (URL)
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData(); // get form data from request
        const thumbanail = formData.get('file') as File; // get thumbnail file from form data
        const thumbnailName = formData.get('fileName') as string; // get thumbnail name

        // check if a file and name were provided
        if (!thumbanail || !thumbnailName) {
            return NextResponse.json({ error: 'No image or image name provided to API.'});
        }

        const thumbnailBuffer = await thumbanail.arrayBuffer(); // get array buffer to uplaod to supabase

        // upload thumbnail to storage
        const { data, error } = await supabase.storage
            .from('thumbnails')
            .upload(thumbnailName, thumbnailBuffer);

        if (error) {
            return NextResponse.json({ 
                error: `Uploading thumbnial to storage failed: ${error.message}` 
            });
        }
        
        // return public url of newly stored thumbnail
        return NextResponse.json({
            url: data.path
        });
    } catch(err) {
        console.error('POST /api/supabase/storage error: ', err); // log the error...
        return NextResponse.json({ // ...and return it as a json
            error: err || 'Unknown error' 
        });
    }
}