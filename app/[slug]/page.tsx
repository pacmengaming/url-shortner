import { redirectURL, visitCounter } from '@/lib/actions/urls';
import { notFound, redirect } from 'next/navigation';

type Params = Promise<{ slug: string }>;

export default async function RedirectURLPage({ params }: { params: Params }) {
  const resolvedParams = await params;
  const slugValue = resolvedParams.slug;

  try {
    const urlData = await redirectURL(slugValue);

    if (urlData?.originalUrl) {
      await visitCounter(urlData.urlId);
      redirect(urlData.originalUrl);
    } 
    
    else {
      notFound();
    }
  } 
  
  catch (error) {
    console.error('Error fetching URL data:', error);
    notFound();
  }
}
