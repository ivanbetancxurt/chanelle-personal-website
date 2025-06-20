import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// get current bio
export async function GET() {
    try {
        const bio = await prisma.bio.findFirst(); // get bio from supabase
        const content = bio?.content || 'yoo';

        return NextResponse.json({ content });
    } catch(err) {
        console.error('GET /api/supabase/bio error: ', err); // log the error...
        return NextResponse.json(
            { error: (err as Error).message || 'Unknown error' },
            { status: 500 }
        );
    }
}

// update bio
export async function PUT(request: NextRequest) {
    try {
        const { content } = await request.json(); // get new bio from request

        if (!content) {
            return NextResponse.json({ error: 'No text provided to update bio.' });
        }

        // replace the current bio
        const bio = await prisma.bio.upsert({
            where: { id: 1 }, // always use ID 1 for the single bio
            update: { content },
            create: { content }
        });

        return NextResponse.json({ content: bio.content });
    } catch(err) {
        console.error('PUT /api/supabase/bio error: ', err); // log the error...
        return NextResponse.json({ // ...and return it as a json
            error: err || 'Unknown error' 
        });
    }
}