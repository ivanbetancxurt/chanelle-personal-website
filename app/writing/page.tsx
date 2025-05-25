import WritingPage from '@/components/WritingPage';
import { Articles } from '@/lib/generated/prisma';
import React from 'react';

export default async function Writing() {
    //todo: sort articles
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles`, { // fetch from the articles api to get all articles and cache, repeating every 60 seconds
        method: 'GET',
        next: { revalidate: 60 } 
    }); 
    const articles: Articles[] = await res.json(); // get the actual list of articles

    return (
        <WritingPage articles={articles} />
    );
}