'use client'

import Experience from '@/components/Experience';
import ProfileBanner from '@/components/ProfileBanner';

export default function Home() {
    return (
        <>
            <div className='flex h-auto'>
                <div className='flex flex-col lg:w-2/3 sm:w-full'>
                    <ProfileBanner />

                    <div className='flex-1 flex px-5 items-center'>
                        <p style={{textIndent: '2em'}} className='text-2xl'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>
                </div>

                <Experience />
            </div>
        </>
    );
}
