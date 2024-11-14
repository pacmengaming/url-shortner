import { redirectURL, visitCounter } from '@/lib/actions/urls';
import { redirect } from 'next/navigation';

type Params = Promise<{ slug: string[] }>;

export default async function RedirectURLPage({ params }: { params: Params }) {
    const { slug } = await params;

    const slugValue = slug[0];

    const urlData = await redirectURL(slugValue);

    if (urlData && urlData.originalUrl) {
        await visitCounter(urlData.urlId);
        redirect(urlData.originalUrl);

    }
}
