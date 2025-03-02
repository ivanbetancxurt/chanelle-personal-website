import Image from 'next/image';

export default function Home() {
    return (
        <>
            <div className='flex w-full h-full'>
                <div className='flex bg-[#f7f8fb] w-60 h-60 rounded-full overflow-hidden items-center justify-center pt-13'>
                    <Image src='/headshot1.jpg' alt='Profile' width={200} height={200} />
                </div>
            </div>
        </>
    );
}
