'use client'

import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/ui/menubar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ModeButton from '@/components/ModeButton';
import { useViewModeContext } from '@/contexts/ViewModeContext';
import { SlGlobe } from "react-icons/sl";
import { useAuthContext } from '@/contexts/AuthContext';

export default function NavBar() {
    const path = usePathname(); // get current route to determine navbar state
    const { publicMode, toggleMode } = useViewModeContext(); // get view mode flag and toggle function from view mode context
    const { isChan, logout } = useAuthContext(); // get chanelle's cookie state and logout function from auth context
    const [loading, setLoading] = useState<boolean>(); // loading state for delete cookie button
 
    return (
        <>
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger asChild className={path === '/' ? 'bg-amber-200' : ''}>
                        <Link href='/'>
                            Home
                        </Link>
                    </MenubarTrigger>
                    <MenubarTrigger asChild className={path === '/writing' ? 'bg-amber-200' : ''}>
                        <Link href='/writing'>
                            Writing
                        </Link>
                    </MenubarTrigger>
                    <MenubarTrigger asChild className={path === '/resume' ? 'bg-amber-200' : ''}>
                        <Link href='/resume'>
                            Resume
                        </Link>
                    </MenubarTrigger>
                </MenubarMenu>
            </Menubar>

            {isChan ? (
                publicMode ? (
                    <ModeButton label='Switch to Admin View' toggleMode={toggleMode} color='red' />
                ) : (
                    <ModeButton label='Switch to Public View' toggleMode={toggleMode} color='green' />
                )
            ) : null}

            {
            loading ? (
                <div className='animate-spin rounded-full h-10 w-10 border-7 border-gray-300 border-t-amber-200' /> 
            ) : (
                <button 
                    onClick={() => {
                        setLoading(true);
                        logout();
                        setLoading(false);
                    }}
                    hidden={!isChan}
                    className='absolute flex items-center left-15 bg-teal-300 hover:bg-teal-400 cursor-pointer h-9 p-2 rounded-lg'
                >
                    <SlGlobe size={25}  />
                </button>
            )}
        </>
    );
}
