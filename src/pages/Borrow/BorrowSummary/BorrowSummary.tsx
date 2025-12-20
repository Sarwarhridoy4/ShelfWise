import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBorrowSummaryQuery } from "@/redux/api/libraryApi";

/** One row in the aggregation response */
export type BorrowAgg = {
  title: string;
  isbn: string;
  totalBorrowed: number;
};

const BorrowSummary = () => {
  const { data, isLoading, isError } = useGetBorrowSummaryQuery();

  /* ── Loading ── */
  if (isLoading) {
    return (
      <main className='container mx-auto px-4 py-10'>
        <h2 className='text-2xl font-bold mb-8'>Borrow Summary</h2>
        <div className='grid gap-6 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]'>
          {Array.from({ length: 3 }).map((_v, i) => (
            <Skeleton key={i} className='h-64' />
          ))}
        </div>
      </main>
    );
  }

  /* ── Error ── */
  if (isError) {
    return (
      <main className='container mx-auto px-4 py-10 text-center'>
        <p className='text-destructive'>Couldn’t load the borrow summary.</p>
      </main>
    );
  }

  /* ── Empty ── */
  if (!data || data.length === 0) {
    return (
      <main className='container mx-auto px-4 py-10'>
        <h2 className='text-2xl font-bold mb-8'>Borrow Summary</h2>
        <p className='text-muted-foreground'>No borrow records found.</p>
      </main>
    );
  }

  /* ── Success ── */
  return (
    <main className='container mx-auto px-4 py-10'>
      <h2 className='text-2xl font-bold mb-8'>Borrow Summary</h2>

      <section className='grid gap-6 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]'>
        {data!.map(({ title, isbn, totalBorrowed }) => (
          <div key={isbn} className='relative group rounded-xl'>
            {/* Gradient border */}
            <div
              className='
                absolute inset-0 rounded-xl
                bg-linear-to-r from-pink-500 via-yellow-500 to-purple-500
                opacity-0 group-hover:opacity-100
                transition-opacity duration-500
                group-hover:scale-105
                blur-sm
              '
            />

            {/* Card content */}
            <Card className='relative z-10 flex flex-col rounded-xl transition-shadow group-hover:shadow-xl'>
              <CardHeader className='flex flex-row items-center justify-between pb-3'>
                <div className='flex items-center gap-2'>
                  <BookOpen className='h-5 w-5 text-primary' />
                  <CardTitle className='text-base'>{title}</CardTitle>
                </div>
                <Badge variant='secondary'>{totalBorrowed}</Badge>
              </CardHeader>

              <CardContent className='text-sm text-muted-foreground space-y-2'>
                <CardDescription>ISBN: {isbn}</CardDescription>
                <CardDescription>
                  Total borrowed copies:{" "}
                  <span className='font-medium'>{totalBorrowed}</span>
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        ))}
      </section>
    </main>
  );
};

export default BorrowSummary;
