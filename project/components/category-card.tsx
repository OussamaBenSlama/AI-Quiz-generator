import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryCardProps {
  name: string;
  description: string;
  href: string;
}

export function CategoryCard({ name, description, href }: CategoryCardProps) {
  return (
    <Link href={href}>
      <Card className="group hover:border-primary transition-colors">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Click to choose difficulty level
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}