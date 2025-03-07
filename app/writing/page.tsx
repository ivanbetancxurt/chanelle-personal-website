import ArticleList from '@/components/ArticleList';
import articles from '@/articles.json';

export default function Writing() {
    return (
        <>
            <div className='flex w-full justify-center'>
                <ArticleList articles={articles} />
            </div>

            {/* add absolutely positioned filtering component */}

        </>
    );
}