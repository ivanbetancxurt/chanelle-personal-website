import type { Articles } from '@/lib/generated/prisma';
import Article from './Article';

interface ArticleListProps {
    articles: Articles[],
    onArticleDeleted: (link: string) => Promise<void>;
    search: string,
    organization: string,
    isChan: boolean
}

export default function ArticleList({ articles, onArticleDeleted, search, organization, isChan }: ArticleListProps) {
    // get aticles that match filter criteria
    const filteredArticles = articles.filter(article => 
        (article.title.includes(search) || article.title.toLowerCase().includes(search)) && 
        (article.organization == organization || organization == 'All')
    );

    return (
        <div className='bg-gray-100 flex flex-col w-full rounded-3xl p-5 gap-2 overflow-y-auto max-h-fit'>
            {filteredArticles.length > 0 ? (
                filteredArticles.map((article, i) => (
                    <Article 
                        article={article} 
                        isChan={isChan} 
                        onArticleDeleted={onArticleDeleted} 
                        key={i} 
                    />
                ))
            ) : (
                <div className='flex w-full justify-center'>
                    <p>No matches found for your filters! :(</p>
                </div>
            )}
        </div>
    );
}