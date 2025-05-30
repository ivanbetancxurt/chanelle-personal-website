'use client'

import React from 'react';
import ArticleList from '@/components/ArticleList';
import { useState, useEffect } from 'react';
import { useViewModeContext } from '@/contexts/ViewModeContext';
import ArticleFilterForm from '@/components/FilterForm';
import type { Articles } from '@/lib/generated/prisma';
import AddArticleForm from '@/components/AddArticleForm';
import { sortArticles } from '@/lib/utils';
import { FaPlus } from 'react-icons/fa';
import { useAuthContext } from '@/contexts/AuthContext';
import { useArticles } from '@/hooks/useArticles';

// todo: make responsive

export default function WritingPage() {
    const [search, setSearch] = useState<string>(''); // article search state
    const [organization, setOrganization] = useState<string>('All'); // organization choice state
    const [addArticlePressed, setAddArticlePressed] = useState<boolean>(false); // pressed state for add article button
    const [addedMessageHidden, setAddedMessageHidden] = useState<boolean>(true); // flag for whether 'article added' message shows
    
    const { publicMode } = useViewModeContext(); // get mode context for the add article button
    const { isChan } = useAuthContext(); // get chanelle's cookie state from auth context

    const { articles, isLoading, addArticle, deleteArticle } = useArticles(); // get articles, loading state, and add/delete functions from custom hook
    {/*
    // fetch articles on component mount
    useEffect(() => {
        fetch('/api/supabase/articles')
            .then(res => {
                if (!res.ok) throw new Error(`There was an error fetching articles: ${res.status}`);
                return res.json();
            })
            .then(data => {
                const articles = Array.isArray(data) ? data : [];
                setArticles(sortArticles(articles));
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.error(err);
            });
    }, []);
    */}

    return (
        <>
            <div className='relative flex w-full flex-1 justify-center overflow-hidden h-full'>
                <div className='flex absolute top-0 bottom-0 min-w-200 justify-center'>
                    {isLoading ? (
                        <div className='animate-spin rounded-full h-13 w-13 border-9 border-gray-300 border-t-amber-200 mt-[200px]' />
                    ) : (
                        <ArticleList 
                            articles={articles} 
                            onArticleDeleted={deleteArticle}
                            search={search} 
                            organization={organization} 
                            isChan={isChan} 
                        />
                    )}  
                </div>     
                
                <ArticleFilterForm setSearch={setSearch} setOrganization={setOrganization} />

                <button 
                    onClick={() => setAddArticlePressed(pressed => !pressed)}
                    hidden={!isChan || publicMode}
                    className='absolute hidden lg:flex right-0 top-8 text-2xl w-[260px] cursor-pointer bg-green-400 hover:bg-green-500 justify-center items-center gap-1 p-2 rounded-lg'
                >
                    <FaPlus size={20} />
                    Add Article
                </button>

                {addArticlePressed && !publicMode && (
                    <AddArticleForm onArticleAdded={async (article) => {
                        {/*
                         // optimistically add the article to the list
                        const optimisticArticles = [...articles, article];
                        setArticles(sortArticles(optimisticArticles)); 

                        setAddArticlePressed(false); // close the form

                        // display 'Article applied!' message for 3 seconds after apply article is submitted
                        setAddedMessageHidden(false);
                        setTimeout(() => {
                            setAddedMessageHidden(true);
                        }, 3000);
                        */}

                        try {
                            await addArticle(article); // optimistically update articles
                            setAddArticlePressed(false);

                            // display 'Article applied!' message for 3 seconds after apply article is submitted
                            setAddedMessageHidden(false);
                            setTimeout(() => {
                                setAddedMessageHidden(true);
                            }, 3000);
                        } catch (err) {
                            console.error('Error adding article:', err);
                            alert(`Ah shi, sorry bae this isn't your fault! Take a picture of this for me and I'll try to fix it ASAP! <3 ~~~ ${err}`);
                        }
                    }} />
                )}

                <p 
                    hidden={addedMessageHidden}
                    className='absolute text-green-400 text-sm right-[90px] top-[90px]'
                >
                    Article added!
                </p>
            </div>
        </>
    );
}