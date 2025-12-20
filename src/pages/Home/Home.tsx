// src/pages/Home.tsx
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

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
    </main>
  );
};

export default Home;
