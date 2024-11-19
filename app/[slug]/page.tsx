import { redirectURL, visitCounter } from '@/lib/actions/urls';
import { notFound, permanentRedirect } from 'next/navigation';

type Params = Promise<{ slug: string }>;

export default async function RedirectURLPage({ params }: { params: Params }) {
  const resolvedParams = await params;
  const slugValue = resolvedParams.slug;

  console.log('Slug:', slugValue); //debug


    const urlData = await redirectURL(slugValue);

    console.log('URL Data:', urlData); //debug


    if (urlData?.originalUrl) {
    console.log('Redirecting to:', urlData.originalUrl); //debug
      await visitCounter(urlData.urlId);
      permanentRedirect(urlData.originalUrl);
    } 
    
    notFound();
   
}
