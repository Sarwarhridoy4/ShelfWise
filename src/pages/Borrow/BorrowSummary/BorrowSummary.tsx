// src/pages/BorrowSummary.tsx
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

/** One row in the aggregation response */
type BorrowAgg = {
  title: string;
  isbn: string;
  totalBorrowed: number;
};

/* ─────── Dummy fallback until API is ready ─────── */
const dummyData: BorrowAgg[] = [
  { title: "Clean Code", isbn: "9780132350884", totalBorrowed: 12 },
  { title: "Atomic Habits", isbn: "9780735211292", totalBorrowed: 9 },
  { title: "1984", isbn: "9780451524935", totalBorrowed: 5 },
];

const BorrowSummary = () => {
  const [summary, setSummary] = useState<BorrowAgg[]>([]);

  /* Replace this with an RTK Query hook later */
  useEffect(() => {
    // simulate fetch
    setSummary(dummyData);
  }, []);

  return (
    <main className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-8">Borrow Summary</h2>

      {summary.length === 0 ? (
        <p className="text-muted-foreground">No borrow records found.</p>
      ) : (
        <section className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {summary.map(({ title, isbn, totalBorrowed }) => (
            <Card key={isbn} className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{title}</CardTitle>
                </div>
                <Badge variant="secondary">{totalBorrowed}</Badge>
              </CardHeader>

              <CardContent className="text-sm text-muted-foreground space-y-2">
                <CardDescription>ISBN: {isbn}</CardDescription>
                <CardDescription>
                  Total borrowed copies: <span className="font-medium">{totalBorrowed}</span>
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
};

export default BorrowSummary;
