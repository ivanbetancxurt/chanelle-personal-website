import { ArticleT } from '@/types/ArticleT';
import Article from './Article';

interface ArticleListProps {
    articles: ArticleT[]
}

export default function ArticleList({ articles }: ArticleListProps) {
    return (
        <>
            <div className='bg-gray-100 flex flex-col rounded-3xl p-5 gap-2'>
                {articles.map((article, i) => (
                    <Article article={article} key={i} />
                ))}
            </div>
        </>
    );
}
