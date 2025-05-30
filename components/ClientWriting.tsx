'use client';

import { useState, useEffect } from 'react';
import type { Articles } from '@/lib/generated/prisma';
import ArticleList from '@/components/ArticleList';
import ArticleFilterForm from '@/components/FilterForm';
import AddArticleForm from '@/components/AddArticleForm';
import { FaPlus } from 'react-icons/fa';
import { useViewModeContext } from '@/contexts/ViewModeContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { useArticles } from '@/hooks/useArticles';

interface ClientWritingPageProps {
  initialArticles: Articles[];
}

export default function ClientWriting({ initialArticles }: ClientWritingPageProps) {
    const [search, setSearch] = useState(''); // article search state
    const [organization, setOrganization] = useState('All'); // organization choice state
    const [addArticlePressed, setAddArticlePressed] = useState(false); // pressed state for add article button
    const [addedMessageHidden, setAddedMessageHidden] = useState(true); // flag for whether 'article added' message shows

    const { publicMode } = useViewModeContext(); // get mode context for the add article button
    const { isChan } = useAuthContext(); // get chanelle's cookie state from auth context
    const { articles, isLoading, addArticle, deleteArticle } = useArticles({ fallbackData: initialArticles }); // get articles, loading state, and update/delete functions from custom hook

    useEffect(() => {
        console.log(
          `[client] ClientWriting → fallback length=${initialArticles.length}, 
           SWR articles length=${articles.length}, isLoading=${isLoading}`
        );
      }, [initialArticles, articles, isLoading]);

    return (
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
                onClick={() => setAddArticlePressed(p => !p)}
                hidden={!isChan || publicMode}
                className='absolute hidden lg:flex right-0 top-8 text-2xl w-[260px] cursor-pointer bg-green-400 hover:bg-green-500 justify-center items-center gap-1 p-2 rounded-lg'
            >
                <FaPlus size={20} /> Add Article
            </button>

            {addArticlePressed && !publicMode && (
                <AddArticleForm
                    onArticleAdded={async article => {
                        try {
                        await addArticle(article);
                        setAddArticlePressed(false);
                        setAddedMessageHidden(false);
                        setTimeout(() => setAddedMessageHidden(true), 3000);
                        } catch (err) {
                        console.error(err);
                        alert(`Error adding article: ${err}`);
                        }
                    }}
                />
            )}

            <p hidden={addedMessageHidden} className='absolute text-green-400 text-sm right-[90px] top-[90px]'>
                Article added!
            </p>
        </div>
    );
}
