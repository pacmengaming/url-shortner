"use server"

import { createClient } from '@/utils/supabase/server';



export async function shortenURL(url: string) {
    const supabase = createClient();
    const { data: authData, error: authError } = await (await supabase).auth.getUser();

    if (authError || !authData || !authData.user) {
        console.error("Error retrieving authenticated user:", authError?.message || "No user found");
        throw new Error("User must be authenticated to create a shortened URL.");
    }

    const userId = authData.user.id; 

    const generatedSlug = Math.random().toString(36).substring(2, 8);
    const { data: urlData, error: urlError } = await (await supabase)
        .from("urls")
        .insert([
            {
                original_url: url,
                slug: generatedSlug,
                user_id: userId, 
            },
        ])
        .select();

    if (urlError || !urlData || !urlData[0]) {
        console.error("Error inserting data into urls:", urlError?.message || "No URL data returned");
        throw new Error("Failed to create shortened URL");
    }

    const urlId = urlData[0].id; 

    const { error: clickError } = await (await supabase)
        .from("clicks")
        .insert([
            {
                url_id: urlId, 
                visits: 0,     
            },
        ]);

    if (clickError) {
        console.error("Error inserting initial data into clicks table:", clickError.message);
        throw new Error("Failed to initialize visit count for the new URL");
    }

    console.log("Shortened URL slug:", generatedSlug);
    return generatedSlug;
}



export async function redirectURL(slug: string){
    const supabase = await createClient();
    const {data, error} = await supabase
    .from("urls")
    .select("id, original_url")
    .eq("slug", slug)
    .single()



    if (data && data.original_url){
        return { originalUrl: data.original_url, urlId: data.id };
    }

}

export async function visitCounter(urlId: Int8Array){
    const supabase = await createClient();
    const {data, error} = await supabase
    .from("clicks")
    .select("visits")
    .eq("url_id", urlId)
    .single();

    if (error || !data) {
        console.error("Error fetching visits count:", error);
        return;
    }

    const currentVisits = data.visits || 0;

    const {error: updateError} = await supabase
    .from("clicks")
    .update({ visits: currentVisits+1})
    .eq("url_id", urlId)


    if (updateError) {
        console.error("Error updating visit count:", updateError);
    } else {
        console.log(`Visit count incremented for URL ID: ${urlId}`);
    }

}


export async function getAllLinksWithClicks(userId: string) {
    const supabase = createClient();

    const { data, error } = await (await supabase)
        .from('urls')
        .select(`
            slug,
            original_url,
            clicks(visits)
        `)
        .eq('user_id', userId);

    if (error) {
        console.error("Error fetching user's links with visits:", error.message);
        return [];
    }

    return data.map((link) => ({
        slug: link.slug,
        originalUrl: link.original_url,
        visits: link.clicks?.[0]?.visits || 0,
    }));
}

