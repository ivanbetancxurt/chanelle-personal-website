import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

export async function GET() {
    const prisma = new PrismaClient(); // initialize prisma client
    const articles = await prisma.articles.findMany(); // get all articles
    return NextResponse.json(articles);
}