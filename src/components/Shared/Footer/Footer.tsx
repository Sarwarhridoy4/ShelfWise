// src/components/Footer.tsx
import { Link } from "react-router";
import { Github, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const year = new Date().getFullYear();

  const links = [
    { to: "/", label: "Home" },
    { to: "/books", label: "Books" },
    { to: "/borrow-summary", label: "Summary" },
    { to: "/", label: "About" },
  ];

  return (
    <footer className='border-t bg-background/60 backdrop-blur supports-backdrop-blur:backdrop-blur'>
      <div className='mx-auto max-w-7xl px-4 py-12'>
        {/* Top section */}
        <div className='grid gap-8 md:grid-cols-3'>
          {/* Brand */}
          <div>
            <Link
              to='/'
              className='text-2xl font-semibold tracking-tight hover:opacity-90'
            >
              ShelfWise
            </Link>
            <p className='mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground'>
              Organize, manage, and borrow—wisely. A minimal open‑source library
              system.
            </p>
          </div>

          {/* Navigation */}
          <nav className='grid gap-2 md:justify-self-center'>
            <h3 className='mb-2 text-sm font-medium text-muted-foreground'>
              Navigation
            </h3>
            {links.map(({ to, label }) => (
              <Link
                key={to + label}
                to={to}
                className='text-sm transition-colors hover:text-primary'
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Contact & socials */}
          <div className='flex flex-col gap-4 md:justify-self-end'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Contact
            </h3>
            <div className='flex gap-2'>
              <Button asChild size='icon' variant='ghost' aria-label='GitHub'>
                <a
                  href='https://github.com/your‑org/shelfwise'
                  target='_blank'
                  rel='noreferrer'
                >
                  <Github className='h-5 w-5' />
                </a>
              </Button>
              <Button asChild size='icon' variant='ghost' aria-label='Twitter'>
                <a
                  href='https://twitter.com/yourhandle'
                  target='_blank'
                  rel='noreferrer'
                >
                  <Twitter className='h-5 w-5' />
                </a>
              </Button>
              <Button asChild size='icon' variant='ghost' aria-label='Email'>
                <a href='mailto:hello@shelfwise.dev'>
                  <Mail className='h-5 w-5' />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <Separator className='my-8' />

        {/* Bottom‑bar */}
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <p className='text-xs text-muted-foreground'>
            © {year} ShelfWise. All rights reserved.
          </p>
          <div className='flex gap-4 text-xs'>
            <Link to='/' className='hover:text-primary'>
              Privacy&nbsp;Policy
            </Link>
            <Link to='/' className='hover:text-primary'>
              Terms&nbsp;of&nbsp;Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
