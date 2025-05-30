import ClientHome from '@/components/ClientHome';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // ensure fresh data on every request

export default async function Home() {
  const bioRecord = await prisma.bio.findFirst();
  const initialBio = bioRecord?.content ?? '';

  return <ClientHome initialBio={initialBio} />;
}
