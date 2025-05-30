import ClientWriting from '@/components/ClientWriting';
import { prisma } from '@/lib/prisma';
import { sortArticles } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function WritingPage() {
  const articles = await prisma.articles.findMany(); // get articles
  const initialArticles = sortArticles(articles); // sort articles

  console.log(`[server] app/writing/page.tsx → initialArticles length =`, initialArticles.length);
  // (And maybe log a preview:)
  console.log(`[server] First 3 articles:`, JSON.stringify(initialArticles.slice(0, 3)));

  return <ClientWriting initialArticles={initialArticles} />;
}