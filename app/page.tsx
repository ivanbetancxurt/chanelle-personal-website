'use client'

import { useState, useEffect } from 'react';
import Experience from '@/components/Experience';
import ProfileBanner from '@/components/ProfileBanner';
import { useViewModeContext } from '@/contexts/ViewModeContext';
import { useAuthContext } from '@/contexts/AuthContext';

export default function Home() {
    const [isEditing, setIsEditing] = useState<boolean>(false); // flag for whether chanelle is editing the bio
    const [bio, setBio] = useState<string>(''); // state for bio content
    const [loading, setLoading] = useState<boolean>(true); // loading state for bio
    const { publicMode } = useViewModeContext(); // get mode context for the editable bio
    const { isChan } = useAuthContext(); // get chanelle's cookie state from auth context

    // Fetch bio content on mount
    useEffect(() => {
        fetch('/api/supabase/bio')
            .then(res => res.json())
            .then(data => {
                setBio(data.content);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching bio:', err);
                setLoading(false);
            });
    }, []);

    const saveBio = async (content: string) => {
        try {
            const res = await fetch('/api/supabase/bio', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content })
            });

            if (!res.ok) {
                throw new Error(`There was an error replacing bio: ${res.status}`);
            }
        } catch (err) {
            console.error('Error saving bio:', err);
            alert(`Ah shi, sorry bae this isn't your fault! Take a picture of this for me and I'll try to fix it ASAP! <3 ~~~ ${err}`);
        }
    };


    const handleBlur = (e: React.FocusEvent<HTMLParagraphElement>) => {
        const newContent = e.target.textContent || ''; // get the newly wrriten bio
        if (newContent !== bio) {
            setBio(newContent); // set the state
            saveBio(newContent); // save it to supabase
        }
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className='flex flex-1 justify-center items-center'>
                <div className='animate-spin rounded-full h-13 w-13 border-9 border-gray-300 border-t-amber-200' />
            </div>
        );
    }

    return (
        <>
            <div className='flex h-auto'>
                <div className='relative flex flex-col flex-1 lg:min-w-2/3 sm:w-full'>
                    <ProfileBanner />

                    <div className='flex-1 flex flex-col px-5 justify-center'>
                        <div 
                            className={`mb-2 ${(!isChan || publicMode) ? '' : 'border-dashed border-2'}`}
                        >
                            <p
                                style={{textIndent: '2em'}}
                                contentEditable={isChan && !publicMode && isEditing}
                                suppressContentEditableWarning={true}
                                onDoubleClick={() => setIsEditing(true)}
                                onBlur={handleBlur}
                                className='text-2xl m-2'
                            >
                                {bio}
                            </p>
                        </div>    
                    
                        <p 
                            hidden={!isChan || publicMode}
                            className='flex justify-between'
                        >
                            Double click to edit!
                            <span>Click outside the box to save!</span>
                        </p>
                    </div>        
                </div>

                <Experience />
            </div>
        </>
    );
}
