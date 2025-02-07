import { DOMAINS, Domain } from "@/lib/types";
import { ResultsClient } from "./results-client";

interface ResultsPageProps {
  params: {
    domain: string;
    category: string;
    difficulty: string;
  };
}

export function generateStaticParams() {
  const difficulties = ["easy", "medium", "hard"];
  
  return Object.entries(DOMAINS).flatMap(([domain, info]) =>
    Object.keys(info.categories).flatMap((category) =>
      difficulties.map((difficulty) => ({
        domain,
        category,
        difficulty,
      }))
    )
  );
}

export default function ResultsPage({ params }: ResultsPageProps) {
  return <ResultsClient params={params} />;
}