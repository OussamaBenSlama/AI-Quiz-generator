"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ResultsClient() {
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get("score") || "0", 10);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8">Quiz Results</h1>
        
        <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
          <div className="text-6xl font-bold mb-4">{score}</div>
          <p className="text-lg text-muted-foreground mb-6">
            Questions answered correctly
          </p>
          
          <div className="grid gap-4">
            <Link href="/">
              <Button className="w-full">Return to Home</Button>
            </Link>
            <Link href={`/quiz`}>
              <Button variant="outline" className="w-full">Try Again</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}