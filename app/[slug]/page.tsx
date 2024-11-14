"use server";
import { redirectURL, visitCounter } from '@/lib/actions/urls';
import { redirect } from 'next/navigation';

type Params = Promise<{ slug: string }>

export default async function RedirectURLPage(props: { params: Params }) {
    const params = await props.params;
    const { slug } = params;
    
    const urlData = await redirectURL(slug);

    if (urlData && urlData.originalUrl) {
        await visitCounter(urlData.urlId);
        redirect(urlData.originalUrl);
    } else {
        console.error("Error: Invalid URL or URL not found.");
    }
}