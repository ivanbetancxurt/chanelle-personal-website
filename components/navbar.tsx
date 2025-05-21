'use client'

import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/ui/menubar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import ModeButton from '@/components/ModeButton';
import { useViewModeContext } from '@/contexts/ViewModeContext';

export default function NavBar() {
    const path = usePathname(); // get current route to determine navbar state
    const { publicMode, toggleMode } = useViewModeContext(); // get view mode flag and toggle function from view mode context

    const [isChan, setIsChan] = useState<boolean|null>(null); // flag for whether this is chanelle
 
    // set isChan flag by getting the state of the cookie via api
    useEffect(() => { 
        fetch('/api/amChan')
            .then(res => res.json())
            .then(({ isChan }) => setIsChan(isChan));
    }, []);

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
        </>
    );
}
