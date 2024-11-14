"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { shortenURL } from "@/lib/actions/urls";
import { signOutAction } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutAction();
    router.push("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 

    try {
      const generatedSlug = await shortenURL(url);
      setSlug(generatedSlug);
    } catch (error) {
      setError("Error creating shortened URL.");
      console.error("Error creating shortened URL:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="absolute top-4 right-4 flex space-x-2">
        <Link href="/analytics">
          <Button variant="secondary" className="hover:underline">
            Analytics
          </Button>
        </Link>
        <Button onClick={handleSignOut} variant="destructive">
          Sign Out
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">URL Shortner</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="url">Enter URL:</Label>
              <Input
                type="url"
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Shorten URL
            </Button>
          </form>
          {slug && (
            <p className="mt-4 text-center text-gray-700">
              Shortened URL Slug: <strong>{slug}</strong>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
