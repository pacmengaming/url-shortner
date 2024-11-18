import { redirectURL, visitCounter } from '@/lib/actions/urls';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';

export default async function RedirectURLPage({ params }: { params: { slug: string } }) {
    const slugValue = params.slug;

    const urlData = await redirectURL(slugValue);

    if (urlData?.originalUrl) {
        await visitCounter(urlData.urlId);
        redirect(urlData.originalUrl);
    } else {
        notFound();
    }
}
