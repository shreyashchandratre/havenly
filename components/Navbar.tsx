'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Search, Menu, X, LogOut, LayoutDashboard, Home, Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExpandedSearchBar } from './expanded-search-bar';
import { useLocale } from '@/lib/use-locale'; // 1. Imported the new hook

export function Navbar() {
  return (
    <Suspense fallback={
      <nav className="sticky top-0 z-40 border-b border-border bg-background pb-6 pt-5">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 text-primary">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 1.333c-8.095 0-14.667 6.572-14.667 14.667 0 8.096 6.572 14.667 14.667 14.667s14.667-6.571 14.667-14.667c0-8.095-6.572-14.667-14.667-14.667zm0 2.667c6.636 0 12 5.364 12 12s-5.364 12-12 12-12-5.364-12-12 5.364-12 12-12zM12 9v14h2.667v-6.667h2.666v6.667h2.667V9h-2.667v4.667h-2.666V9H12z"/>
              </svg>
              <span className="hidden text-xl font-bold tracking-tight sm:inline">
                havenly
              </span>
            </div>
            {/* Center Tabs placeholder */}
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            {/* Right menu placeholder */}
            <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
          </div>
        </div>
      </nav>
    }>
      <NavbarContent />
    </Suspense>
  );
}

function NavbarContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  
  // 2. Extracted settings and setCurrency from our context
  const { settings, setCurrency } = useLocale();

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        // At the top of the page — always show
        setShowSearch(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down — hide (slides up behind navbar)
        setShowSearch(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up — reveal (slides down from behind navbar)
        setShowSearch(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // This outer wrapper is what sticks to the top. It's the positioning
    // context for the absolutely-positioned ExpandedSearchBar below, so the
    // search bar can float without ever changing the navbar's height.
    <div className="sticky top-0 z-40 w-full">
      <nav className="relative border-b border-border bg-background py-5">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-primary">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 1.333c-8.095 0-14.667 6.572-14.667 14.667 0 8.096 6.572 14.667 14.667 14.667s14.667-6.571 14.667-14.667c0-8.095-6.572-14.667-14.667-14.667zm0 2.667c6.636 0 12 5.364 12 12s-5.364 12-12 12-12-5.364-12-12 5.364-12 12-12zM12 9v14h2.667v-6.667h2.666v6.667h2.667V9h-2.667v4.667h-2.666V9H12z" />
              </svg>
              <span className="hidden text-xl font-bold tracking-tight sm:inline">
                havenly
              </span>
            </Link>

            {/* Center Tabs - Hidden on mobile */}
            <div className="hidden md:flex flex-1 justify-center px-6 gap-8 text-[16px] items-center">
              <Link
                href="/"
                className={`relative flex flex-col items-center ${
                  pathname === '/'
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Homes
                {pathname === '/' && (
                  <span className="absolute -bottom-2 w-4 border-b-2 border-foreground rounded-full"></span>
                )}
              </Link>

              <Link
                href="/experiences"
                className={`relative flex flex-col items-center ${
                  pathname === '/experiences'
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Experiences
                {pathname === '/experiences' && (
                  <span className="absolute -bottom-2 w-4 border-b-2 border-foreground rounded-full"></span>
                )}
              </Link>

              <Link
                href="/services"
                className={`relative flex flex-col items-center ${
                  pathname === '/services'
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Services
                {pathname === '/services' && (
                  <span className="absolute -bottom-2 w-4 border-b-2 border-foreground rounded-full"></span>
                )}
              </Link>

              <Link
                href="/favorites"
                className={`relative flex flex-col items-center ${
                  pathname === '/favorites'
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Favorites
                {pathname === '/favorites' && (
                  <span className="absolute -bottom-2 w-4 border-b-2 border-foreground rounded-full"></span>
                )}
              </Link>
            </div>

            {/* Desktop Right Menu */}
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/host">
                <Button variant="ghost" className="text-sm font-medium text-foreground rounded-full">
                  Become a host
                </Button>
              </Link>

              <ThemeToggle />
              
              {/* 3. Replaced the empty Globe Icon with our dynamic Currency Dropdown */}
              <select
                value={settings.currency}
                onChange={(e) => setCurrency(e.target.value as 'USD' | 'INR')}
                className="bg-transparent text-sm font-medium text-foreground focus:outline-none cursor-pointer rounded-md px-2 py-1 hover:bg-muted"
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
              </select>

              <Button variant="ghost" size="icon" className="rounded-full text-foreground hover:bg-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>
              </Button>

              {/* User Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 rounded-full border border-border px-3 py-2 hover:shadow-md transition-shadow bg-background ml-2"
                >
                  <Menu size={18} className="text-foreground shrink-0" />
                  <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    <Image
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                      alt="User"
                      width={32}
                      height={32}
                    />
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-background shadow-lg">
                    <Link href="/dashboard" className="block">
                      <button className="w-full px-4 py-2 text-left text-sm font-medium text-foreground hover:bg-muted flex items-center gap-2">
                        <LayoutDashboard size={16} />
                        My Bookings
                      </button>
                    </Link>
                    <Link href="/host" className="block">
                      <button className="w-full px-4 py-2 text-left text-sm font-medium text-foreground hover:bg-muted flex items-center gap-2">
                        <Home size={16} />
                        Host Dashboard
                      </button>
                    </Link>
                    <hr className="my-2 border-border" />
                    <button className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-muted flex items-center gap-2">
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X size={24} className="text-foreground" />
              ) : (
                <Menu size={24} className="text-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Search Bar (unaffected — stays inline, always visible on mobile) */}
          <div className="md:hidden mt-4">
            <div className="flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2">
              <Search size={18} className="text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                className="border-0 bg-transparent placeholder:text-muted-foreground focus:outline-none focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="border-t border-border py-4 md:hidden">
              <div className="flex items-center justify-between px-4 py-2 mb-2">
                <span className="text-foreground font-medium">Theme</span>
                <ThemeToggle />
              </div>

              {/* 4. Added Currency selector to mobile view */}
              <div className="flex items-center justify-between px-4 py-2 mb-2">
                <span className="text-foreground font-medium">Currency</span>
                <select
                  value={settings.currency}
                  onChange={(e) => setCurrency(e.target.value as 'USD' | 'INR')}
                  className="bg-background border border-border text-sm font-medium text-foreground focus:outline-none rounded-md px-2 py-1"
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <Link href="/dashboard" className="block">
                <button className="w-full px-4 py-2 text-left font-medium text-foreground hover:bg-muted rounded-lg flex items-center gap-2 mb-2">
                  <LayoutDashboard size={18} />
                  My Bookings
                </button>
              </Link>
              <Link href="/host" className="block">
                <button className="w-full px-4 py-2 text-left font-medium text-foreground hover:bg-muted rounded-lg flex items-center gap-2 mb-2">
                  <Home size={18} />
                  Host Dashboard
                </button>
              </Link>
              <Link href="/favorites" className="block">
                <Button className="w-full px-0 py-2 text-left font-medium text-foreground hover:bg-muted bg-transparent rounded-lg flex items-center gap-2 mb-2">
                  <Heart size={12} /> Favorites
                </Button>
              </Link>

              <Link href="/host">
                <Button variant="ghost" size="sm" className="w-full text-foreground justify-start">
                  Become a host
                </Button>
              </Link>

              <hr className="my-2 border-border" />
              <button className="w-full px-4 py-2 text-left font-medium text-red-600 hover:bg-muted rounded-lg flex items-center gap-2">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Floating expanded search bar — absolutely positioned, doesn't affect nav height */}
      <ExpandedSearchBar visible={showSearch} />
    </div>
  );
}
