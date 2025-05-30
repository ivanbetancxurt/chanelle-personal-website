'use client';

import { useState, useEffect } from 'react';
import Experience from '@/components/Experience';
import ProfileBanner from '@/components/ProfileBanner';
import { useViewModeContext } from '@/contexts/ViewModeContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { useBio } from '@/hooks/useBio';

interface ClientHomeProps {
    initialBio: string;
}

export default function ClientHome({ initialBio }: ClientHomeProps) {
    const [isEditing, setIsEditing] = useState(false); // flag for whether chanelle is editing the bio

    const { publicMode } = useViewModeContext(); // get mode context for the editable bio
    const { isChan } = useAuthContext(); // get chanelle's cookie state from auth context
    const { bio, isLoading, updateBio } = useBio({ fallbackData: { content: initialBio } }); // get bio, loading state, and update function from custom hook

    useEffect(() => {
        console.log(
          `[client] ClientHome → initialBio: "${initialBio}", 
           SWR data: "${bio}", isLoading=${isLoading}`
        );
      }, [initialBio, bio, isLoading]);

    const handleBlur = async (e: React.FocusEvent<HTMLParagraphElement>) => {
        const newContent = e.target.textContent || ''; // get the newly wrriten bio
        if (newContent !== bio) {
        try {
            await updateBio(newContent);
        } catch (err) {
            console.error(err);
            alert(`Error saving bio: ${err}`);
        }
        }
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className='flex flex-1 justify-center items-center'>
                <div className='animate-spin rounded-full h-13 w-13 border-9 border-gray-300 border-t-amber-200' />
            </div>
        );
    }

    return (
        <div className='flex h-auto'>
            <div className='relative flex flex-col flex-1 lg:min-w-2/3 sm:w-full'>
                <ProfileBanner />
                <div className='flex-1 flex flex-col px-5 justify-center'>
                    <div className={`${(!isChan || publicMode) ? '' : 'border-dashed border-2'} mb-2`}>
                        <p
                            style={{ textIndent: '2em' }}
                            contentEditable={isChan && !publicMode && isEditing}
                            suppressContentEditableWarning
                            onDoubleClick={() => setIsEditing(true)}
                            onBlur={handleBlur}
                            className='text-2xl m-2'
                        >
                            {bio}
                        </p>
                    </div>
                    <p hidden={!isChan || publicMode} className='flex justify-between'>
                        Double click to edit!<span>Click outside to save!</span>
                    </p>
                </div>
            </div>

            <Experience />
        </div>
    );
}