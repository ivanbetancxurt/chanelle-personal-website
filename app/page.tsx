'use client'

import ProfileBanner from '@/components/profilebanner';

export default function Home() {
    return (
        <>
            <div className='flex w-full h-full'>
                <div className='flex flex-col w-[66vw]'>
                    <ProfileBanner />
                    <div>
                        About me
                    </div>
                </div>
                <div>
                    Experiences
                </div>
            </div>
        </>
    );
}
