import { Articles } from '@/lib/generated/prisma';
import Image from 'next/image';
import { isNew } from '@/lib/utils';

export default function Article({ article }: { article: Articles }) {
    return (
        <a href={article.link} target='_blank' rel='noopener noreferrer'>
            <div className='flex w-full gap-2 hover:bg-gray-200 p-3 rounded-2xl'>
                <div className='relative h-[80px] w-[80px] rounded-xl overflow-hidden aspect-square'>
                    <Image 
                        src={article.thumbnail} 
                        alt={article.thumbnailDescription} 
                        fill
                        sizes='80px'
                        className='object-cover'
                    />
                </div>
            
                <div className='flex flex-col'>
                    <div className='flex gap-2 items-center'>
                        {isNew(article) ? (
                            <div className='bg-green-400 h-3 w-3 rounded-full'></div>
                        ) : null}
                        <p className='font-bold'>{article.title}</p>
                    </div>
                    <p>{article.organization}</p>
                    <p className='right-auto'>{article.date}</p>
                </div>
            </div>
        </a>
    );
}