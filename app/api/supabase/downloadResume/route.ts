import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('https://ceksxnfsszwkadypmabe.supabase.co/storage/v1/object/public/thumbnails//BetancourtIvan.pdf'); // fetch resume

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
        console.error('GET /api/downloadResume error: ', err); // log the error...
        return NextResponse.json({ // ...and return it as a json
            error: err || 'Unknown error' 
        });
    }
}