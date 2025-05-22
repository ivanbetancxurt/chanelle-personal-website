import React from 'react';
import { FaPlus } from 'react-icons/fa';

export default function AddArticleButton() {
    return (
        <button className='absolute flex right-0 top-8 text-2xl w-[260px] cursor-pointer bg-green-400 justify-center items-center gap-1 p-2 rounded-lg'>
            <FaPlus size={20} />
            Add Article
        </button>
    );
}
