'use client'

import { getURL } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Resume() {
    const [url, setUrl] = useState<string>(''); // state for resume url
    const [loading, setLoading] = useState<boolean>(true); // loading state

    // fetch and set url
    useEffect(() => {
        setUrl(getURL('thumbnails', 'BetancourtIvan.pdf'));
        setLoading(false);
    });

    return (
        <div className='flex w-full justify-center items-center'>
            {loading ? (
                <div className='animate-spin rounded-full h-13 w-13 border-9 border-gray-300 border-t-amber-200 mt-[200px]' />
            ) : (
                <iframe src={url} />
            )}
            
            <a href={url} download target='_blank' rel='noopener noreferrer' className='font-bold text-2xl'>
                Download
            </a>
        </div>
    );
}
