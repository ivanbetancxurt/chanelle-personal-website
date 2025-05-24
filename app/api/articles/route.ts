import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
    const prisma = new PrismaClient(); // initialize prisma client
    
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