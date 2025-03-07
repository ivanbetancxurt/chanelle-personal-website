import { ArticleT } from '@/types/ArticleT';

interface ArticleProps {
    article: ArticleT
}

export default function Article({ article }: ArticleProps) {

    //todo: implement article.date to pretty string conversion

    return (
        <div className='flex w-full gap-2 hover:bg-gray-200 p-3 rounded-2xl'>
            <div className='h-[80px] w-[80px] bg-gray-400 rounded-xl'>
                {/* thumbnail */}
            </div>
            <div className='flex flex-col'>
                <p className='font-bold'>{article.title}</p>
                <p>{article.publication}</p>
                <p className='right-auto'>{article.date}</p>
            </div>
        </div>
    );
}
