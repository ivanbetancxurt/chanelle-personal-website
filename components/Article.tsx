import { ArticleT } from '@/types/ArticleT';
import Image from 'next/image';

interface ArticleProps {
    article: ArticleT
}

function isNew(article: ArticleT) {
    const articleDateSplit = article.date.split(' '); // split article date into [month, day, year]
    
    // get day of article as a pure number ('23rd' => '23')
    const articleDayNum = [];
    for (const char of articleDateSplit[1]) {
        if (char.charCodeAt(0) >= '0'.charCodeAt(0) && char.charCodeAt(0) <= '9'.charCodeAt(0)) {
            articleDayNum.push(char);
        }
    }

    const naturalLangArticleDateStr = `${articleDateSplit[0]} ${articleDayNum.join('')}, ${articleDateSplit[2]} 00:00:00`; // natural language string format of article date to use .getMonth() later
    const date = new Date(naturalLangArticleDateStr); // article date in Date type

    let articleMonthNum = (date.getMonth() + 1).toString() // get article month number as string

    // add a 0 to the beginning of the day and month if they are singular digits for the ISO format
    if (articleDayNum.length === 1) {
        articleDayNum.unshift('0');
    }
    if (articleMonthNum.length === 1) {
        articleMonthNum = `0${articleMonthNum}`;
    }

    const articleISODate = `${articleDateSplit[2]}-${articleMonthNum}-${articleDayNum.join('')}T00:00:00Z`; // ISO format of article for parsing

    const thirtyDays = 2592000000; // 30 days in milliseconds

    return Date.parse(articleISODate) >= Date.now() - thirtyDays; // return true if the ariticle was posted within 30 days of today
}

export default function Article({ article }: ArticleProps) {
    return (
        <a href={article.link} target='_blank' rel='noopener noreferrer'>
            <div className='flex w-full gap-2 hover:bg-gray-200 p-3 rounded-2xl'>
                <div className='relative h-[80px] w-[80px] rounded-xl overflow-hidden aspect-square'>
                    <Image src={article.thumbnail} alt={article.thumbnailDescription} fill className='object-cover'/>
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