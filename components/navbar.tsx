'use client'

import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/ui/menubar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
    const path = usePathname(); // get current route to determine navbar state

    return (
        <Menubar className=''>
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
    );
}
