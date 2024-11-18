import { redirectURL, visitCounter } from '@/lib/actions/urls';
import { notFound, redirect } from 'next/navigation';

interface PageProps {
  params: {slug: string};
}

export default async function RedirectURLPage({ params }: PageProps) {
  const slugValue = params.slug;

  try {
    const urlData = await redirectURL(slugValue);

    if (urlData?.originalUrl) {
      await visitCounter(urlData.urlId);
      redirect(urlData.originalUrl);
    } else {
      notFound();
    }
  } catch (error) {
    console.error('Error fetching URL data:', error);
    notFound();
  }
}
