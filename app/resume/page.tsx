'use client'

import { getURL } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';

// polyfill for Promise.withResolvers if not available
if (!Promise.withResolvers) {
    Promise.withResolvers = function<T>() {
        let resolve: (value: T | PromiseLike<T>) => void;
        let reject: (reason?: any) => void;
        const promise = new Promise<T>((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return { promise, resolve: resolve!, reject: reject! };
    };
}

// configure PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function Resume() {
    const [url, setUrl] = useState<string>(''); // state for resume url

    // fetch and set url
    useEffect(() => {
        setUrl(getURL('thumbnails', 'BetancourtIvan.pdf'));
    }, []); 

    return (
        <div className='flex flex-col w-full items-center gap-7'>
            <Document
                file={url}
                loading={<div className='animate-spin rounded-full h-13 w-13 border-9 border-gray-300 border-t-amber-200 mt-[100px]' />}
                className='bg-gray-300 p-3 rounded-2xl'
            >
                <Page
                    pageNumber={1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    height={525}
                />
            </Document>

            
            <a href='/api/downloadResume' className='font-bold text-2xl hover:underline'>
                Download
            </a>
            
        </div>
    );
}

