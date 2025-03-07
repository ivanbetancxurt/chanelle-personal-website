import { Article } from '@/types/Article';

interface ArticlesProps {
    articles: Article[]
}

export default function Articles({ articles }: ArticlesProps) {
    return (
        <>
            <div className='flex flex-col'>
                {articles.map((article, i) => (
                    <div key={i}>
                        {article.title}
                        {article.date}
                    </div>
                ))}
            </div>
        </>
    )
}
