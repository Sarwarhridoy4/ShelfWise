// src/pages/Home.tsx
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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
    title: "Borrow Books",
    desc: [
      "Borrow multiple copies at once with smart quantity checks.",
      "Due‑date picker keeps readers—and you—on schedule.",
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
    <main className="container mx-auto px-4 py-20 flex flex-col gap-20">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          ShelfWise
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Organize, Manage, Borrow — Wisely.
        </p>

        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/books">Browse Books</Link>
          </Button>

          <Button asChild variant="secondary" size="lg">
            <Link to="/create-book">Add New Book</Link>
          </Button>
        </div>
      </section>

      {/* ── Feature Cards ────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Link to={feature.to}>
              <Card className="cursor-pointer transition-shadow hover:shadow-xl">
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {feature.desc.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </section>
    </main>
  );
};

export default Home;
