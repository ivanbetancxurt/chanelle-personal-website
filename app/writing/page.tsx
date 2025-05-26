'use client'

import ArticleList from '@/components/ArticleList';
import { useState, useEffect } from 'react';
import AddArticleButton from '@/components/AddArticleButton';
import { useViewModeContext } from '@/contexts/ViewModeContext';
import ArticleFilterForm from '@/components/FilterForm';
import type { Articles } from '@/lib/generated/prisma';
import AddArticleForm from '@/components/AddArticleForm';
import { sortArticles } from '@/lib/utils';

// todo: make responsive

export default function WritingPage() {
    const [articles, setArticles] = useState<Articles[]>([]); // state for articles
    const [search, setSearch] = useState<string>(''); // article search state
    const [organization, setOrganization] = useState<string>('All'); // organization choice state
    const { publicMode } = useViewModeContext(); // get mode context for the AddArticle button
    const [isChan, setIsChan] = useState<boolean>(false); // flag for whether this is chanelle
    const [addArticlePressed, setAddArticlePressed] = useState<boolean>(false); // pressed state for AddArticle button
    const [loading, setLoading] = useState<boolean>(true);

    // fetch articles on component mount
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles`)
            .then(res => {
                if (!res.ok) throw new Error(`There was an error fetching articles: ${res.status}`);
                return res.json();
            })
            .then(data => sortArticles(data)) 
            .then(articles => {
                setArticles(articles);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.error(err);
            });
    }, []);

    // set isChan flag depending on the state of the cookie via api
    useEffect(() => { 
        fetch('/api/amChan')
            .then(res => {
                if (!res.ok) throw new Error(`There was an error fetching who you are: ${res.status}`);
                return res.json();
            })
            .then(({ isChan }) => setIsChan(isChan))
            .catch(err => {console.error(err);});
    }, []);

    return (
        <>
            <div className='relative flex w-full flex-1 justify-center overflow-hidden h-full'>
                <div className='flex absolute top-0 bottom-0 min-w-200 justify-center'>
                    {loading ? (
                        <div className='animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-amber-200 mt-20'></div>
                    ) : (
                        <ArticleList articles={articles} search={search} organization={organization} />
                    )}  
                </div>     
                
                <ArticleFilterForm setSearch={setSearch} setOrganization={setOrganization} />

                {isChan && !publicMode && (
                    <AddArticleButton setPressed={setAddArticlePressed} />
                )}

                {addArticlePressed && !publicMode && (
                    <AddArticleForm onArticleAdded={(article) => {
                         // optimistically add the article to the list
                        const optimisticArticles = [...articles, article];
                        setArticles(sortArticles(optimisticArticles)); 
                        
                        setAddArticlePressed(false); // close the form
                    }} />
                )}
            </div>
        </>
    );
}