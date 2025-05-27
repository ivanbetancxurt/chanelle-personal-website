'use client'

import Image from 'next/image';
import { ReactTyped } from 'react-typed';
import { getURL } from '@/lib/utils';

export default function ProfileBanner() {
    return (
        <>
            <div className='flex items-center mb-3'>
                <div className='relative bg-[#f7f8fb] w-60 aspect-square rounded-full overflow-hidden items-center justify-center pt-13 
                    hidden md:flex shadow-2xl flex-shrink-0'
                >
                    <Image 
                        src='https://ceksxnfsszwkadypmabe.supabase.co/storage/v1/object/public/thumbnails//headshot2.webp' 
                        alt="Chanelle's profile picture" 
                        fill 
                        className='object-cover object-top' 
                        style={{objectPosition: '50% 10%'}}
                    />
                </div>
                <div className='flex flex-col h-[100px] px-8 justify-evenly'>
                    <div className='font-bold text-6xl '>
                        Hi, I'm Chanelle!
                    </div>
                    <div className='text-2xl hidden md:flex'>
                        <ReactTyped 
                            strings={[
                                "I'm an <span style='color: #45d435'>Environmental Studies</span> and <span style='color: #16aafa'>Law, Jurisprudence, and Social Thought</span> major",
                                "I'm a <span style='color: #facb32'>Climate Activist</span>",
                                "I'm a proud <span style='color: #12d8db'>New Mexican</span>",
                                "I'm an aspiring <span style='color: #db124e'>Environmental Lawyer</span>",
                                "I'm a <span style='color: #543e7d'>400m Runner</span>",
                                "I'm a <span style='color: #f0269c'>Writer</span>"
                            ]}
                            typeSpeed={50}
                            backSpeed={25}
                            loop={true}
                            backDelay={1250}
                        />
                    </div>
                    
                </div>
            </div>
        </>
    );
}

