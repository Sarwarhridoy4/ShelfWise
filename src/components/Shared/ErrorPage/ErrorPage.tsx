// src/components/Shared/ErrorPage/ErrorPage.tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Home } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";

interface ErrorPageProps {
  /** HTTP status code to display. */
  status?: number;
  /** Short, human‑friendly title. */
  title?: string;
  /** Longer description shown under the title. */
  description?: string;
  /** Label for the tertiary action button. */
  actionLabel?: string;
  /** Custom handler for the tertiary action button. */
  onAction?: () => void;
}

/**
 * Renders a polished, responsive error screen with subtle animations and
 * glass‑morphism vibes. Plug‑and‑play with any React Router setup.
 */
export default function ErrorPage({
  status = 404,
  title = "Something went wrong",
  description = "The page you're looking for either doesn't exist or has been moved.",
  actionLabel = "Report issue",
  onAction,
}: ErrorPageProps) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) return onAction();
    // Default behaviour: open a pre‑filled support email
    window.open("mailto:support@example.com?subject=Bug Report");
  };

  return (
    <motion.main
      className='relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-24'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Decorative blurred gradient blob */}
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute -top-20 left-1/2 size-[720px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/30 via-pink-500/20 to-yellow-400/20 blur-3xl lg:size-[960px]' />
      </div>

      <Card className='w-full max-w-md border-0 bg-background/60 backdrop-blur-md'>
        <CardHeader className='flex flex-col items-center text-center'>
          {/* Animated alert icon */}
          <motion.span
            className='flex size-16 items-center justify-center rounded-full border bg-muted'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <AlertTriangle className='size-8 text-destructive' />
          </motion.span>

          <h1 className='mt-6 text-7xl font-extrabold tracking-wider'>
            {status}
          </h1>
          <h2 className='mt-2 text-2xl font-semibold'>{title}</h2>

          {description && (
            <p className='mt-3 max-w-prose text-muted-foreground'>
              {description}
            </p>
          )}
        </CardHeader>

        <CardContent>
          <Separator className='my-6' />
          <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
            <Button asChild size='lg' className='gap-1'>
              <Link to='/'>
                <Home className='size-4' /> Home
              </Link>
            </Button>

            <Button
              variant='secondary'
              size='lg'
              className='gap-1'
              onClick={() => navigate(-1)}
            >
              Go back
            </Button>

            <Button variant='outline' size='lg' onClick={handleAction}>
              {actionLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.main>
  );
}
