'use client'

import ProfileBanner from '@/components/profilebanner';
import Image from 'next/image';

export default function Home() {

    //todo: small screen bug, picture shows

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
                <div className='lg:flex lg:flex-col lg:flex-1 hidden items-center gap-12'>
                    <section className='flex flex-col items-center'>
                        <p className='text-2xl h-auto font-bold'>
                            Education
                        </p>
                        <div className='flex justify-evenly py-5 h-auto'>
                            <Image src='/amherst-college-two-line-seal.png' alt='Amherst College logo' width={300} height={100} />
                            <Image src='/atc-logo.png' alt='The Academy of Technology and the Classics logo' width={100} height={100} />
                        </div>
                    </section>
                    <section className='flex flex-col w-full items-center'>
                        <p className='text-2xl h-auto font-bold'>
                            Experience
                        </p>
                        <div className='flex flex-col flex-1 pt-5 gap-7 items-center'>
                            <Image src='/lanl-logo.png' alt='Los Alamos National Laboratory logo' width={400} height={250} />
                            <Image src='/the-amherst-student-logo.png' alt='The Amherst Student logo' width={400} height={250} />
                            <Image src='/santa-fe-new-mexican-logo.png' alt='The Santa Fe New Mexican logo' width={420} height={250} />
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
