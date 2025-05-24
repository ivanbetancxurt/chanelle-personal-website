import WritingPage from '@/components/WritingPage';
import React from 'react';

export default async function Writing() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles`, { next: { revalidate: 60 } }); // fetch from the articles api to get all articles and cache, repeating every 60 seconds
    const articles = await res.json(); // get the actual list of articles

    return (
        <WritingPage articles={articles} />
    );
}