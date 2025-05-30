import ClientWriting from '@/components/ClientWriting';
import { prisma } from '@/lib/prisma';
import { sortArticles } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function WritingPage() {
  const articles = await prisma.articles.findMany(); // get articles
  const initialArticles = sortArticles(articles); // sort articles

  return <ClientWriting initialArticles={initialArticles} />;
}