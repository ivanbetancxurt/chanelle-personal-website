import { ArticleT } from '@/types/ArticleT';
import Image from 'next/image';

interface ArticleProps {
    article: ArticleT
}

export default function Article({ article }: ArticleProps) {
    return (
        <div className='flex w-full gap-2 hover:bg-gray-200 p-3 rounded-2xl'>
            <div className='relative h-[80px] w-[80px] rounded-xl overflow-hidden aspect-square'>
                <Image src={article.thumbnail} alt={article.thumbnailDescription} fill className='object-cover'/>
            </div>
            
            <div className='flex flex-col'>
                <p className='font-bold'>{article.title}</p>
                <p>{article.publication}</p>
                <p className='right-auto'>{article.date}</p>
            </div>
        </div>
    );
}
