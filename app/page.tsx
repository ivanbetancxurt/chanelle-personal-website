'use client'

import { useState, useEffect } from 'react';
import Experience from '@/components/Experience';
import ProfileBanner from '@/components/ProfileBanner';
import { useViewModeContext } from '@/contexts/ViewModeContext';
import { useAuthContext } from '@/contexts/AuthContext';

export default function Home() {
    const [isEditing, setIsEditing] = useState<boolean>(false); // flag for whether chanelle is editing the bio
    const { publicMode } = useViewModeContext(); // get mode context for the editable bio
    const { isChan } = useAuthContext(); // get chanelle's cookie state from auth context

    return (
        <>
            <div className='flex h-auto'>
                <div className='flex flex-col lg:w-2/3 sm:w-full'>
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
                                onBlur={() => setIsEditing(false)}
                                className='text-2xl m-2'
                            >
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </div>    
                    
                        <p hidden={!isChan || publicMode}>Double click to edit!</p>
                    </div>
                </div>

                <Experience />
            </div>
        </>
    );
}
