import type { Metadata } from 'next';
import { Geist, Geist_Mono } from "next/font/google"; //! here for future reference
import './globals.css';
import NavBar from "@/components/navbar";
import { ContactBar } from '@/components/contactbar';

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
        <html lang="en">
            <body className='flex flex-col'>
                <header className='flex justify-center pt-5'>
                    <NavBar />
                </header>
                <main className='p-5 flex justify-center '>
                    {children}
                </main>
                <footer className='flex justify-center'>
                    <ContactBar />
                </footer>
            </body>
        </html>
    );
}
