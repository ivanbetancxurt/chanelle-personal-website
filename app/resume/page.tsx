'use client'

import { getURL } from "@/lib/utils";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

// dynamically import Document and Page from react-pdf
const Document = dynamic(
    () => import('react-pdf').then(mod => ({ default: mod.Document })),
    { 
        ssr: false,
        loading: () => <div className='animate-spin rounded-full h-13 w-13 border-9 border-gray-300 border-t-amber-200 mt-[100px]' />
    }
);

const Page = dynamic(
    () => import('react-pdf').then(mod => ({ default: mod.Page })),
    { ssr: false }
);

// configure PDF.js 
if (typeof window !== 'undefined') {
    import('react-pdf').then(({ pdfjs }) => {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
            'pdfjs-dist/build/pdf.worker.min.mjs',
            import.meta.url,
        ).toString();
    });
}

export default function Resume() {
    const [url, setUrl] = useState<string>(''); // state for resume url

    // fetch and set url
    useEffect(() => {
        setUrl(getURL('thumbnails', 'BetancourtIvan.pdf'));
    }, []); 

    return (
        <div className='flex flex-col w-full items-center gap-7'>
            <a href={url} target='_blank' rel='noopener noreferrer'>
                <Document
                    file={url}
                    loading={<div className='animate-spin rounded-full h-13 w-13 border-9 border-gray-300 border-t-amber-200 mt-[100px]' />}
                    className='bg-gray-200 p-3 rounded-2xl hover:bg-gray-300'
                >
                    <Page
                        pageNumber={1}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        height={525}
                    />
                </Document>
            </a>

            <a href='/api/downloadResume' className='font-bold text-2xl hover:underline'>
                Download
            </a>
            
        </div>
    );
}

