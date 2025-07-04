import { Link, NavLink } from "react-router";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import clsx from "clsx";
import { ModeToggle } from "@/components/mode-toggle";

/* ----- helper classes --------------------------------------------- */
const desktopNavClasses = ({ isActive }: { isActive: boolean }) =>
  clsx(
    "relative px-4 py-2 text-sm font-medium transition-colors duration-200",
    "hover:text-primary",
    isActive ? "text-primary" : "text-muted-foreground",

    // simple underline
    "after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-primary",
    isActive ? "after:w-full" : "after:w-0 hover:after:w-full",
    "after:transition-[width] after:duration-300"
  );

const mobileNavClasses = ({ isActive }: { isActive: boolean }) =>
  clsx(
    "relative text-base font-medium rounded-md px-3 py-2 transition-colors",
    "hover:text-primary",

    // animated rainbow underline
    "after:absolute after:left-0 after:bottom-0 after:h-[3px] after:rounded-full",
    "after:bg-gradient-to-r after:from-pink-500 after:via-yellow-500 after:to-purple-500",
    "after:bg-[length:200%_100%] after:[animation:gradient-x_4s_ease-in-out_infinite]",
    isActive
      ? "text-primary after:w-full"
      : "text-muted-foreground after:w-0 hover:after:w-full",
    "after:transition-[width] after:duration-300"
  );

export default function Navbar() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/books", label: "Books" },
    { to: "/borrow-summary", label: "Summary" },
  ];

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4'>
        {/* Logo */}
        <Link
          to='/'
          className='text-2xl font-bold tracking-tight hover:opacity-90 transition-opacity'
        >
          ShelfWise
        </Link>

        {/* Desktop navigation */}
        <nav className='hidden md:block'>
          <NavigationMenu>
            <NavigationMenuList>
              {links.map(({ to, label }) => (
                <NavigationMenuItem key={to}>
                  <NavigationMenuLink asChild>
                    <NavLink to={to} className={desktopNavClasses}>
                      {label}
                    </NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right controls */}
        <div className='flex items-center gap-2'>
          <ModeToggle />

          {/* Mobile sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden'>
                <Menu className='h-5 w-5' />
              </Button>
            </SheetTrigger>

            <SheetContent side='right' className='w-64 p-4'>
              {/* Logo */}
              <Link
                to='/'
                className='text-2xl font-bold tracking-tight hover:opacity-90 transition-opacity mx-5 my-4'
              >
                ShelfWise
              </Link>
              <nav className='grid gap-4 py-4'>
                {links.map(({ to, label }) => (
                  <NavLink key={to} to={to} className={mobileNavClasses}>
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
