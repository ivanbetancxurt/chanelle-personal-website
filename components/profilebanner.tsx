import Image from 'next/image';
import { ReactTyped } from 'react-typed';

export default function ProfileBanner() {
    return (
        <>
            <div className='flex ml-5 mt-5 items-center'>
                <div className='flex bg-[#f7f8fb] w-60 h-60 rounded-full overflow-hidden items-center justify-center pt-13 '>
                    <Image src='/headshot1.jpg' alt="Chanelle's profile picture" width={200} height={200} />
                </div>
                <div className='flex flex-col h-[100px] px-8 justify-evenly'>
                    <div className='font-bold text-6xl '>
                        Hi, I'm Chanelle!
                    </div>
                    <div className='text-2xl'>
                        <ReactTyped 
                            strings={[
                                'test',
                                'nother',
                                'hi'
                            ]}
                            typeSpeed={50}
                            backSpeed={50}
                            loop={true}
                        />
                    </div>
                    
                </div>
            </div>
        </>
    );
}

