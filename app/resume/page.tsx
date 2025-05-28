'use client'

import { getURL } from "@/lib/utils";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { useViewModeContext } from '@/contexts/ViewModeContext';
import { TiDocumentAdd } from 'react-icons/ti';
import UpdateResumeForm from "@/components/UpdateResumeForm";

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
    const { publicMode } = useViewModeContext(); // get mode context for the update resume button
    const [updateResumePressed, setUpdateResumePressed] = useState<boolean>(false); // pressed state for update resume button
    const [updatedMessageHidden, setUpdatedMessageHidden] = useState<boolean>(true); // flag for whether 'resume updated' message shows
    
    // fetch and set url of resume with cache busting
    function getUpdatedResume() {
        const timestamp = Date.now(); // get current time 
        setUrl(`${getURL('BetancourtIvan.pdf')}?v=${timestamp}`); // set the url with a unique parameter to bust cache
    }

    // get resume on mount
    useEffect(() => {
        getUpdatedResume();
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

    const downloadEndpoint = `/api/supabase/resume?url=${url}`;

    return (
        <div className='relative flex w-full'>
            <div className='flex flex-col w-full justify-center items-center gap-7'>
                <a href={url} target='_blank' rel='noopener noreferrer'>
                    <Document
                        file={url}
                        loading={
                            <div className='bg-gray-200 p-3 rounded-2xl hover:bg-gray-300 flex items-center justify-center w-[408px] h-[531px]'>
                                <div className='animate-spin rounded-full h-13 w-13 border-9 border-gray-300 border-t-amber-200' />
                            </div>
                        }
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

                <a
                    href={downloadEndpoint} 
                    className='font-bold text-2xl hover:underline cursor-pointer'
                >
                    Download
                </a>
            </div>

            <button 
                onClick={() => setUpdateResumePressed(pressed => !pressed)}
                hidden={!isChan || publicMode}
                className='absolute flex right-[100px] top-8 bg-green-400 hover:bg-green-500 w-[260px] text-2xl justify-center items-center p-2 rounded-lg gap-1 cursor-pointer'
            >
                <TiDocumentAdd size={30} />
                Update Resume
            </button>
            
            {updateResumePressed && !publicMode ? (
                <UpdateResumeForm onResumeUpdated={() => {
                    setUpdateResumePressed(false); // close the form
                    getUpdatedResume(); // update displayed resume

                    // display 'Resume updated!' message for 3 seconds after resume is submitted
                    setUpdatedMessageHidden(false);
                    setTimeout(() => {
                        setUpdatedMessageHidden(true);
                    }, 3000);
                }} />
            ) : null}

            <p
                hidden={updatedMessageHidden}
                className='absolute text-green-400 text-sm right-[170px] top-[80px]'
            >
                Resume updated!
            </p>
        </div>
    );
}

