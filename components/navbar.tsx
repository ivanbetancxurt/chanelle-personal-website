'use client'

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
  } from '@/components/ui/menubar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
    const path = usePathname();

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
            </MenubarMenu>
        </Menubar>
    );
}
