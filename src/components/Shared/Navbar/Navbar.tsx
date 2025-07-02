// src/components/Navbar.tsx
import { Link, NavLink } from "react-router";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/books", label: "Books" },
    { to: "/borrow-summary", label: "Summary" },
  ];

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4'>
        {/* Logo */}
        <Link
          to='/'
          className='text-2xl font-semibold tracking-tight hover:opacity-90'
        >
          ShelfWise
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden md:block'>
          <NavigationMenu>
            <NavigationMenuList>
              {links.map(({ to, label }) => (
                <NavigationMenuItem key={to}>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        clsx(
                          "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                          isActive &&
                            "text-primary underline underline-offset-4"
                        )
                      }
                    >
                      {label}
                    </NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right Controls */}
        <div className='flex items-center gap-2'>
          {/* Theme Toggle */}
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsDark((prev) => !prev)}
            aria-label='Toggle Theme'
          >
            {isDark ? (
              <Sun className='h-5 w-5' />
            ) : (
              <Moon className='h-5 w-5' />
            )}
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden'>
                <Menu className='h-5 w-5' />
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-64'>
              <nav className='grid gap-4 py-4'>
                {links.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      clsx(
                        "text-base font-medium rounded-lg px-3 py-2 hover:bg-muted/50",
                        isActive && "text-primary underline underline-offset-4"
                      )
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
