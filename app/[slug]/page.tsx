"use server"
import { redirectURL } from '@/lib/actions/urls';
import { redirect } from 'next/navigation'
import { visitCounter } from '@/lib/actions/urls';


export default async function RedirectURLPage({
    params,
}: {
    params: { slug: string};
}) {

    const {slug} = await params;
    const urlData = await redirectURL(slug);

    if (urlData && urlData.originalUrl){
        await visitCounter(urlData.urlId)
        redirect(urlData.originalUrl)

    }
    else {
        console.error("Error: Invalid URL or URL not found.");
    }



    
    
}





