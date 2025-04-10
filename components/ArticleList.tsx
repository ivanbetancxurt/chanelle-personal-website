import { ArticleT } from '@/types/ArticleT';
import Article from './Article';

interface ArticleListProps {
    articles: ArticleT[],
    search: string,
    publication: string,
}

export default function ArticleList({ articles, search, publication }: ArticleListProps) {
    // get aticles that match filter criteria
    const filteredArticles = articles.filter(article => 
        (article.title.includes(search) || article.title.toLowerCase().includes(search)) && 
        (article.publication == publication || publication == 'All')
    );

    return (
        <div className='bg-gray-100 flex flex-col w-full rounded-3xl p-5 gap-2 overflow-y-auto max-h-full'>
            {filteredArticles.length > 0 ? (
                filteredArticles.map((article, i) => (
                    <Article article={article} key={i} />
                ))
            ) : (
                <p>No Results Found for Your Search</p>
            )}
        </div>
    );
}