import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // initialize prisma client

export async function GET() {
    try {
        const articles = await prisma.articles.findMany(); // get all articles
        return NextResponse.json(articles);
    } catch(err) {
        console.error('GET /api/articles error: ', err); // log the error...
        return NextResponse.json({ // ...and return it as a json
            error: err || 'Unknown error' 
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { // get the article to be uploaded from request...
            link,
            title,
            organization,
            date,
            thumbnail,
            thumbnailDescription
        } = await request.json(); 

        const newArticle = await prisma.articles.create({ // ...and upload it
            data: {
                link,
                title,
                organization,
                date,
                thumbnail,
                thumbnailDescription
            }
        });

        return NextResponse.json(newArticle);
    } catch(err) {
        console.error('POST /api/supabase/articles error: ', err); // log the error...
        return NextResponse.json({ // ...and return it as a json
            error: err || 'Unknown error' 
        });
    }
}