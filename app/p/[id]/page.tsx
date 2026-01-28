import { notFound } from 'next/navigation';
import { fetchPaste } from '@/lib/paste';
import { getCurrentTime } from '@/lib/time';
import { headers } from 'next/headers';
import PasteView from './PasteView';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PastePage({ params }: PageProps) {
  const { id } = await params;
  
  // Get headers for TEST_MODE support
  const headersList = await headers();
  const currentTime = getCurrentTime(headersList);

  // Fetch the paste (this counts as a view!)
  const paste = await fetchPaste(id, currentTime);

  if (!paste) {
    notFound();
  }

  return <PasteView paste={paste} pasteId={id} />;
}
