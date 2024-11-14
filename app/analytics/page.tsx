"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { getAllLinksWithClicks } from '@/lib/actions/urls';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from '@/utils/supabase/client';

type LinkData = {
    slug: string;
    originalUrl: string;
    visits: number;
};

export default function AnalyticsPage() {
    const [links, setLinks] = useState<LinkData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchLinks = async () => {
            const supabase = createClient();
            const { data: authData, error: authError } = await supabase.auth.getUser();

            if (authError || !authData || !authData.user) {
                console.error("User is not authenticated");
                router.push('/login');
                return;
            }

            const userId = authData.user.id;

            try {
                const data = await getAllLinksWithClicks(userId);
                setLinks(data);
            } catch (fetchError) {
                console.error("Error fetching user's links:", fetchError);
            }

            setIsLoading(false);
        };

        fetchLinks();
    }, [router]);

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="absolute top-4 right-4">
                <Link href="/dashboard">
                    <Button variant="secondary">Dashboard</Button>
                </Link>
            </div>

            <h1 className="text-2xl font-bold mb-6">Analytics</h1>

            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Link Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                    {links.length === 0 ? (
                        <p className="text-center text-gray-700">No links created yet</p>
                    ) : (
                        <ul className="space-y-4">
                            {links.map((link) => (
                                <li
                                    key={link.slug}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm">
                                    <div className="flex-1">
                                        <p className="text-gray-800 font-medium">{link.originalUrl}</p>
                                        <p className="text-gray-500 text-sm">Slug: {link.slug}</p>
                                    </div>
                                    <Badge
                                    variant="default"
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                                        {link.visits || 0}
                                        </Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
