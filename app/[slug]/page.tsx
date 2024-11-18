import { redirectURL, visitCounter } from '@/lib/actions/urls';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import { useParams } from 'next/navigation';

export default async function RedirectURLPage() {
  const { slug } = useParams();

  if (!slug || typeof slug !== 'string') {
    notFound();
  }
  const urlData = await redirectURL(slug);

  if (urlData?.originalUrl) {
    await visitCounter(urlData.urlId);
    redirect(urlData.originalUrl);
  }

  notFound();
}
