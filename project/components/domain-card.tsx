import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DomainCardProps {
  title: string;
  description: string;
  iconSvg: React.ReactNode;
  href: string;
  categories: string[];
}

export function DomainCard({ title, description, iconSvg, href, categories }: DomainCardProps) {
  return (
    <Link href={href}>
      <Card className="group hover:border-primary transition-colors">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 text-primary">
              {iconSvg}
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-medium",
                  "bg-secondary text-secondary-foreground"
                )}
              >
                {category}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}