import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); // initialize supabase client

// downloads resume for the user
export async function GET(request: NextRequest) {
    try {
        const url = request.nextUrl.searchParams.get('url'); // get the url of the updated resume passed through as a query parameter
        if (!url) throw new Error("'url' query parameter for downloading was not provided.");

        const res = await fetch(url); // fetch resume
        if (!res.ok) throw new Error(`There was an error fetching Chanelle's resume: ${res.status}`);

        // get pdf buffer and return to client with download header
        const pdfBuffer = await res.arrayBuffer();
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="BetancourtIvan.pdf"',
                'Cache-Control': 'no-cache',
            }
        });
    } catch(err) {
        console.error('GET /api/resume error: ', err); // log the error...
        return NextResponse.json({ // ...and return it as a json
            error: err || 'Unknown error' 
        });
    }
}

// updates resume by replacing the current one in stoage with the one chanelle provided
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData(); // get form data from request
        const resume = formData.get('file') as File; // get thumbnail file from form data

        if (!resume) {
            return NextResponse.json({ error: 'No resume provided to API.'});
        }

        const resumeBuffer = await resume.arrayBuffer(); // get array buffer to uplaod to supabase

        // upload resume to storage with the same name to replace it
        const { data, error } = await supabase.storage
            .from('thumbnails')
            .update('BetancourtIvan.pdf', resumeBuffer, {
                contentType: 'application/pdf',
                upsert: true
            });
        
        if (error) {
            return NextResponse.json({ 
                error: `Uploading resume to storage failed: ${error.message}` 
            });
        }

        // url not needed but returned anyway
        return NextResponse.json({
            url: data.path
        });
    } catch(err) {
        console.error('POST /api/resume error: ', err); // log the error...
        return NextResponse.json({ // ...and return it as a json
            error: err || 'Unknown error' 
        });
    }
}