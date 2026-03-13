import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Hadith {
  id: string;
  hadith: string;
  narrator: string;
  source: string;
  reference: string;
  createdAt: null | string;
  updatedAt: null | string;
}

const features = [
  {
    title: "Book Management",
    desc: [
      "View, create, edit or delete books in seconds.",
      "Availability updates automatically when copies change.",
    ],
    to: "/books",
  },
  {
    title: "Add New Book",
    desc: [
      "Create book entries quickly with real-time validation.",
      "All fields are required for clean and complete records.",
    ],
    to: "/create-book",
  },
  {
    title: "Borrow Summary",
    desc: [
      "Aggregate view of everything that’s currently on loan.",
      "See totals by book title and ISBN at a glance.",
    ],
    to: "/borrow-summary",
  },
];

const Home = () => {
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHadith = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://daily-hadith-one.vercel.app/api/random-hadith");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHadith(data);
    } catch (err) {
      console.error("Failed to fetch hadith:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHadith();
  }, []);

  return (
    <main className='container mx-auto px-4 py-20 flex flex-col gap-20'>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className='text-center space-y-6'>
        <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight'>
          ShelfWise
        </h1>
        <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto'>
          Organize, Manage, Borrow — Wisely.
        </p>

        <div className='flex justify-center gap-4'>
          <Button asChild size='lg'>
            <Link to='/books'>Browse Books</Link>
          </Button>

          <Button asChild variant='secondary' size='lg'>
            <Link to='/create-book'>Add New Book</Link>
          </Button>
        </div>
      </section>

      {/* ── Feature Cards ────────────────────────────────────── */}
      <section className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Link to={feature.to}>
              <div className='relative group rounded-2xl overflow-hidden'>
                {/* Gradient border effect */}
                <div className='absolute inset-0 rounded-2xl bg-linear-to-r from-pink-500 via-yellow-500 to-purple-500 blur-md opacity-0 group-hover:opacity-100 transition-all duration-700 animate-gradient-x' />

                {/* Actual Card */}
                <Card className='relative z-10 bg-background/80 backdrop-blur-md border border-border group-hover:shadow-2xl transition-all duration-300'>
                  <CardHeader>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2 text-sm text-muted-foreground'>
                    {feature.desc.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* ── Hadith of the Day ────────────────────────────────────── */}
      <section className='text-center space-y-6'>
        <div className='flex flex-col items-center'>
          <h2 className='text-3xl md:text-4xl font-extrabold tracking-tight'>
            Hadith of the Day
          </h2>
          {loading ? (
            <p className='text-lg text-muted-foreground'>Loading hadith...</p>
          ) : error ? (
            <p className='text-lg text-destructive'>Failed to load hadith. Please try again later.</p>
          ) : hadith ? (
            <>
              <div className='relative group rounded-2xl overflow-hidden w-full max-w-2xl'>
                {/* Gradient border effect */}
                <div className='absolute inset-0 rounded-2xl bg-linear-to-r from-pink-500 via-yellow-500 to-purple-500 blur-md opacity-0 group-hover:opacity-100 transition-all duration-700 animate-gradient-x' />

                {/* Actual Card */}
                <Card className='relative z-10 bg-background/80 backdrop-blur-md border border-border group-hover:shadow-2xl transition-all duration-300'>
                  <CardHeader>
                    <CardTitle>Hadith</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2 text-sm text-muted-foreground'>
                    <p className='italic'>"{hadith.hadith}"</p>
                    <p className='font-medium'>— {hadith.narrator}</p>
                    <p className='text-xs text-muted-foreground'>
                      {hadith.source}, {hadith.reference}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Refresh Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={fetchHadith}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh Hadith"}
              </Button>
            </>
          ) : (
            <p>No hadith available.</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
