'use client'

import { getURL } from "@/lib/utils";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { useViewModeContext } from '@/contexts/ViewModeContext';

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
    const [isChan, setIsChan] = useState<boolean>(false); // flag for whether this is chanelle
    const { publicMode } = useViewModeContext();

    // fetch and set url of resume
    useEffect(() => {
        setUrl(getURL('BetancourtIvan.pdf'));
    }, []); 

    // set isChan flag depending on the state of the cookie via api
    useEffect(() => { 
        fetch('/api/amChan')
            .then(res => {
                if (!res.ok) throw new Error(`There was an error fetching who you are: ${res.status}`);
                return res.json();
            })
            .then(({ isChan }) => setIsChan(isChan))
            .catch(err => {console.error(err);});
    }, []);

    return (
        <div className='flex w-full'>
            <div className='flex flex-col w-full justify-center items-center gap-7'>
                <a href={url} target='_blank' rel='noopener noreferrer'>
                    <Document
                        file={url}
                        loading={<div className='animate-spin rounded-full h-13 w-13 border-9 border-gray-300 border-t-amber-200 mt-[100px]' />}
                        className='bg-gray-200 p-3 rounded-2xl hover:bg-gray-300'
                    >
                        <div className='overflow-hidden rounded-xl'>
                            <Page
                                pageNumber={1}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                height={525}
                            />
                        </div>
                    </Document>
                </a>

                <a href='/api/downloadResume' className='font-bold text-2xl hover:underline'>
                    Download
                </a>
            </div>

            <div>
                Update Resume
            </div>
        </div>
    );
}

