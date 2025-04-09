import { ArticleT } from '@/types/ArticleT';
import Article from './Article';

interface ArticleListProps {
    articles: ArticleT[],
    publication: string,
}

export default function ArticleList({ articles, publication }: ArticleListProps) {
    return (
        <div className='bg-gray-100 flex flex-col w-full rounded-3xl p-5 gap-2 overflow-y-auto max-h-full'>
            {articles.map((article, i) => (
                (article.publication == publication || publication == 'All') ? (
                    <Article article={article} key={i} />
                ) : null
            ))}
        </div>
    );
}