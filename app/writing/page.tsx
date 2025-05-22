'use client'

import ArticleList from '@/components/ArticleList';
import articles from '@/articles.json';
import { useState, useEffect } from 'react';
import AddArticleButton from '@/components/AddArticleButton';
import { useViewModeContext } from '@/contexts/ViewModeContext';
import ArticleFilterForm from '@/components/ArticleFilterForm';

// todo: make responsive

export default function Writing() {
    const [search, setSearch] = useState<string>(''); // article search state
    const [organization, setOrganization] = useState<string>('All'); // organization choice state
    const { publicMode } = useViewModeContext(); // get mode context for the AddArticle button
    const [isChan, setIsChan] = useState<boolean>(false); // flag for whether this is chanelle
    const [addArticlePressed, setAddArticlePressed] = useState<boolean>(false); // pressed state for AddArticle button
     
    // set isChan flag by getting the state of the cookie via api
    useEffect(() => { 
        fetch('/api/amChan')
            .then(res => res.json())
            .then(({ isChan }) => setIsChan(isChan));
    }, []);

    return (
        <>
            <div className='relative flex w-full flex-1 justify-center overflow-hidden h-full'>
                <div className='absolute top-0 bottom-0 min-w-200'>
                    <ArticleList articles={articles} search={search} organization={organization} />   
                </div>     
                
                <ArticleFilterForm setSearch={setSearch} setOrganization={setOrganization} />

                {isChan && !publicMode && (
                    <AddArticleButton setPressed={setAddArticlePressed} />
                )}

                {addArticlePressed && !publicMode && (
                    <div className='bg-red-600 absolute'>hi</div>
                )}
            </div>
        </>
    );
}