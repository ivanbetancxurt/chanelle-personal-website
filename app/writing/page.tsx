import Articles from '@/components/Articles';
import articles from '@/articles.json';

export default function Writing() {
    return (
        <>
            <Articles articles={articles} />
        </>
    );
}