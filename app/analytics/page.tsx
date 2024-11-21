"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { getAllLinksWithClicks } from '@/lib/actions/urls';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from '@/utils/supabase/client';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

type LinkData = {
    slug: string;
    originalUrl: string;
    visits: number;
};

export default function AnalyticsPage() {
    const [links, setLinks] = useState<LinkData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [progress, setProgress] = useState(0); 
    const router = useRouter();
    
    useEffect(() => {
        const progressTimer = setInterval(() => {
            setProgress(prev => (prev < 66 ? prev + 33 : 66));
        }, 200);

        const fetchLinks = async () => {
            const supabase = createClient();
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError || !sessionData || !sessionData.session) {
                console.error("User is not authenticated");
                router.push('/login');
                return;
            }
            
            const userId = sessionData.session.user.id;


            try {
                const data = await getAllLinksWithClicks(userId);
                setLinks(data);
            } catch (fetchError) {
                console.error("Error getting user's links:", fetchError);
            }

            setIsLoading(false);
            clearInterval(progressTimer); 
            setProgress(100);
        };

        fetchLinks();

        return () => clearInterval(progressTimer); 
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p>Loading...</p>
                <Progress value={progress} className="w-[60%]" />
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>
            <div className="absolute top-4 right-4">
                <Link href="/dashboard">
                    <Button variant="default">Dashboard</Button>
                </Link>
            </div>

            <div className="absolute top-4 left-4 flex items-center space-x-2">
                <Switch id="dark-mode-switch" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                <Label htmlFor="dark-mode-switch">Dark Mode</Label>
            </div>

            <h1 className="text-2xl font-bold mb-6">Analytics</h1>

            <Card className={`w-full max-w-2xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
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
                                    className={`flex items-center justify-between p-4 border rounded-lg shadow-lg ${isDarkMode ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-200 bg-white text-black'}`}>
                                    <div className="flex-1">
                                        <p className="font-medium">{link.originalUrl}</p>
                                        <p className="text-sm">Slug: {link.slug}</p>
                                    </div>
                                    <Badge
                                        variant="default"
                                        className={`w-12 h-12 flex items-center justify-center rounded-full font-semibold ${isDarkMode ? 'bg-white text-black' : 'bg-blue-600 text-white'}`}>
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
