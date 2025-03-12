import ArticleList from '@/components/ArticleList';
import articles from '@/articles.json';

export default function Writing() {
    return (
        <>
            <div className='relative flex flex-col w-full flex-1 items-center overflow-hidden h-full'>
                <div className='absolute top-0 bottom-0'>
                    <ArticleList articles={articles} />   
                </div>     
                  
            </div>
            {/* add absolutely positioned filtering component */}
        </>
    );
}