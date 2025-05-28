import { Articles } from '@/lib/generated/prisma';
import { useState } from 'react';
import Image from 'next/image';
import { isNew } from '@/lib/utils';
import { FaTrashAlt } from "react-icons/fa";
import { useViewModeContext } from '@/contexts/ViewModeContext';

export default function Article({ article, isChan, onArticleDeleted }: { article: Articles, isChan: boolean, onArticleDeleted: (link: string) => void }) {
    const { publicMode } = useViewModeContext(); // get mode context for the delete buttons
    const [isDeleting, setIsDeleting] = useState<boolean>(); // state for deleting process

    async function handleDelete(e: React.MouseEvent) {
        e.preventDefault(); // prevent article link from opening
        e.stopPropagation(); // prevent event bubbling
    
        // get confirmation from chanelle
        if (!confirm('Bae! Are you sure you want to delete this article?')) {
            return;
        } 
        
        setIsDeleting(true);
        try {
            // delate the article
            const res = await fetch('/api/supabase/articles', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ link: article.link })
            });
    
            if (!res.ok) throw new Error(`There was an error deleting article: ${res.status}`);
            
            onArticleDeleted(article.link);
        } catch (err) {
            console.error('Error deleting article:', err);
			alert(`Ah shi, sorry bae this isn't your fault! Take a picture of this for me and I'll try to fix it ASAP! <3 ~~~ ${err}`);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <a href={article.link} target='_blank' rel='noopener noreferrer'>
            <div className='flex w-full gap-2 hover:bg-gray-200 p-3 rounded-2xl items-center'>
                <div className='relative h-[80px] w-[80px] rounded-xl overflow-hidden aspect-square'>
                    <Image 
                        src={article.thumbnail} 
                        alt={article.thumbnailDescription} 
                        fill
                        sizes='80px'
                        className='object-cover'
                    />
                </div>
            
                <div className='flex flex-col w-[600px]'>
                    <div className='flex gap-2 items-center'>
                        {isNew(article) ? (
                            <div className='bg-green-400 h-3 w-3 rounded-full'></div>
                        ) : null}
                        <p className='font-bold'>{article.title}</p>
                    </div>
                    <p>{article.organization}</p>
                    <p className='right-auto'>{article.date}</p>
                </div>

                {isChan && !publicMode && !isDeleting ? (
                    <FaTrashAlt 
                        size={20} 
                        onClick={handleDelete}
                        className={`ml-2 cursor-pointer ${isDeleting ? 'text-gray-400 cursor-not-allowed' : 'text-red-400 hover:text-red-600'}`}
                    />
                ) : <div className='animate-spin rounded-full h-10 w-10 border-7 border-gray-300 border-t-amber-200' />}
            </div>
        </a>
    );
}