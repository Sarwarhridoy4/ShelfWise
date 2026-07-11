import { Link, NavLink, useLocation } from "react-router";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { motion } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/books", label: "Books" },
  { to: "/borrow-summary", label: "Summary" },
  { to: "/create-book", label: "Add a New Book" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4'>
        <Link
          to='/'
          className='text-2xl font-bold tracking-tight transition-opacity hover:opacity-90'
        >
          ShelfWise
        </Link>

        <nav className='hidden md:block relative'>
          <NavigationMenu>
            <NavigationMenuList className='flex space-x-6 relative'>
              {navLinks?.map(({ to, label }) => {
                const isActive = location?.pathname === to;
                return (
                  <NavigationMenuItem key={to}>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to={to}
                        className='relative px-1.5 py-2 text-sm font-medium transition-colors duration-200 hover:text-primary'
                      >
                        {label}
                        {isActive && (
                          <motion.span
                            layoutId='underline'
                            initial={{ opacity: 0, y: "-90%" }}
                            animate={{ opacity: 1, y: "0%" }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className='absolute left-0 right-0 -bottom-1 h-0.75 rounded-full
                                       bg-linear-to-r from-pink-500 via-yellow-500 to-purple-500
                                       bg-size-[200%_100%] animate-[gradient-x_4s_ease-in-out_infinite]'
                          />
                        )}
                      </NavLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className='flex items-center gap-2'>
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden'>
                <Menu className='h-5 w-5' />
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-64 p-4'>
              <Link
                to='/'
                className='mx-5 my-4 text-2xl font-bold tracking-tight transition-opacity hover:opacity-90'
              >
                ShelfWise
              </Link>
              <nav className='grid gap-4 py-4'>
                {navLinks.map(({ to, label }) => {
                  const isActive = location.pathname === to;
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      className='relative text-base font-medium rounded-md px-3 py-2 transition-colors hover:text-primary'
                    >
                      {label}
                      {isActive && (
                        <span
                          className='absolute left-0 right-0 -bottom-1 h-0.75 rounded-full
                          bg-linear-to-r from-pink-500 via-yellow-500 to-purple-500
                          bg-size-[200%_100%] animate-[gradient-x_4s_ease-in-out_infinite]'
                        />
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
