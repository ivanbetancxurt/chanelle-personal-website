import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import { ContactBar } from '@/components/ContactBar';

export const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap'
})

export const metadata: Metadata = {
    title: 'Chanelle Jaeger',
    description: "Chanelle Jaeger's website.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' className={outfit.className}>
            <body className='flex flex-col h-screen'>
                <header className='flex justify-center pt-5 h-auto'>
                    <NavBar />
                </header>
                <main className='flex flex-1 h-full py-9 px-15'>
                    {children}
                </main>
                <footer className='flex justify-center w-full h-auto'>
                    <ContactBar />
                </footer>
            </body>
        </html>
    );
}