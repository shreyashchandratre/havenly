'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { PropertyCard } from '@/components/PropertyCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Property, bookings } from '@/lib/dummy-data';
import { getStoredProperties } from '@/lib/properties';
import { Footer } from "@/components/Footer";
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { useFilterParams } from '@/hooks/use-filter-params';
import Image from 'next/image';

interface PropertySectionProps {
  title: string;
  items: Property[];
  locationName: string;
}

function PropertySection({ title, items, locationName }: PropertySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 600;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 cursor-pointer group">
          <h2 className="text-[22px] font-semibold text-foreground tracking-tight">{title}</h2>
          <span className="text-foreground transition-transform group-hover:translate-x-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll('left')} aria-label="Scroll left"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm hover:shadow-md hover:scale-[1.04] transition animate-in fade-in"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button
            onClick={() => scroll('right')} aria-label="Scroll right"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm hover:shadow-md hover:scale-[1.04] transition animate-in fade-in"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 sm:pb-6 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {items.map((property, index) => (
          <div key={property.id} className="min-w-[85vw] sm:min-w-[45vw] md:min-w-[calc(33.333%-16px)] lg:min-w-[calc(25%-18px)] snap-start shrink-0">
            <PropertyCard
              property={{ ...property, location: { ...property.location, city: locationName } }}
              priority={index < 4}
            />
          </div>
        ))}

        {/* See All Card */}
        <div className="min-w-[85vw] sm:min-w-[45vw] md:min-w-[calc(33.333%-16px)] lg:min-w-[calc(25%-18px)] snap-start shrink-0 flex items-center justify-center pl-2">
          <div className="w-full aspect-[20/19] rounded-[14px] border border-black/5 shadow-[0_6px_16px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center cursor-pointer group hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-all bg-white relative overflow-hidden p-6 mx-2">
            <div className="relative w-40 h-32 mb-6">
              {/* Back Image (Left) */}
              <div className="absolute top-2 left-2 w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-lg -rotate-[15deg] z-10 transition-transform group-hover:-translate-x-1">
                <Image src={items[0]?.image || ''} alt="See all" fill className="object-cover" />
              </div>
              {/* Back Image (Right) */}
              <div className="absolute top-2 right-2 w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-lg rotate-[15deg] z-10 transition-transform group-hover:translate-x-1">
                <Image src={items[1]?.image || ''} alt="See all" fill className="object-cover" />
              </div>
              {/* Front Image (Center) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-xl overflow-hidden border-2 border-white shadow-xl rotate-0 z-20 transition-transform group-hover:scale-105">
                <Image src={items[2]?.image || ''} alt="See all" fill className="object-cover" />
              </div>
            </div>
            <span className="text-[17px] font-semibold text-foreground group-hover:underline">See all</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background">
        <nav className="sticky top-0 z-40 border-b border-border bg-background pb-6 pt-5">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between" />
        </nav>
        <div className="mx-auto max-w-7xl px-4 py-8 animate-pulse">
          <div className="h-10 bg-muted w-1/4 mb-6 rounded" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </main>
    }>
      <Home />
    </Suspense>
  );
}

function Home() {
  const searchParams = useSearchParams();
  const { filters, setFilters, clearFilters } = useFilterParams();
  const [propertyList, setPropertyList] = useState<Property[]>(getStoredProperties());

  useEffect(() => {
    setPropertyList(getStoredProperties());

    const handleUpdate = () => {
      setPropertyList(getStoredProperties());
    };

    window.addEventListener('propertiesUpdated', handleUpdate);
    return () => {
      window.removeEventListener('propertiesUpdated', handleUpdate);
    };
  }, []);

  const city = searchParams.get('city') || '';
  const checkInStr = searchParams.get('checkIn') || '';
  const checkOutStr = searchParams.get('checkOut') || '';
  const guests = parseInt(searchParams.get('guests') || '0') || 0;

  // Filter properties
  const filtered = propertyList.filter((property) => {
    // 1. Category Filter
    if (filters.category && property.category !== filters.category) {
      return false;
    }

    // 2. City Filter (Case-insensitive substring search)
    if (city && !property.location.city.toLowerCase().includes(city.toLowerCase())) {
      return false;
    }

    // 3. Guests Filter (Capacity guests >= required guests)
    if (guests > 0 && property.capacity.guests < guests) {
      return false;
    }

    // 4. Dates Filter (Check-in/Check-out availability check)
    if (checkInStr && checkOutStr) {
      const reqIn = new Date(checkInStr);
      const reqOut = new Date(checkOutStr);

      if (reqIn instanceof Date && !isNaN(reqIn.getTime()) && reqOut instanceof Date && !isNaN(reqOut.getTime())) {
        // Let's check overlap with existing bookings of this property
        const propertyBookings = bookings.filter(
          (b) => b.propertyId === property.id && b.status !== 'cancelled'
        );
        for (const booking of propertyBookings) {
          const bIn = new Date(booking.checkIn);
          const bOut = new Date(booking.checkOut);
          // Overlap condition: reqIn < bOut && reqOut > bIn
          if (reqIn < bOut && reqOut > bIn) {
            return false; // Not available
          }
        }
      }
    }

    return true;
  });

  const isFilterActive = Boolean(
    filters.category ||
    city ||
    checkInStr ||
    checkOutStr ||
    guests > 0
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Category Filter — synced to URL via useFilterParams */}
      <CategoryFilter
        selectedCategory={filters.category || undefined}
        onCategoryChange={(category) => setFilters({ category })}
      />

      {/* Properties Sections */}
      <section className="py-6 md:py-8 animate-in fade-in duration-300">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {isFilterActive ? (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    {city ? `Homes in ${city}` : 'Available Homes'}
                  </h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {filtered.length} property{filtered.length !== 1 ? 'ies' : ''} found matching your search
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="rounded-full text-sm font-semibold hover:bg-muted"
                >
                  Clear Filters
                </Button>
              </div>

              {filtered.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filtered.map((property, index) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      priority={index < 8}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-muted/20 rounded-2xl border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-1 animate-pulse">No matching homes</h3>
                  <p className="text-muted-foreground max-w-md mx-auto text-sm px-4">
                    We couldn't find any homes that match all your criteria. Try adjusting your destination, dates, or guests.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              <PropertySection
                title="Popular homes in Varanasi"
                items={propertyList.slice(0, 6)}
                locationName="Varanasi"
              />
              <PropertySection
                title="Available in Kolkata this weekend"
                items={propertyList.slice(2, 8)}
                locationName="Kolkata"
              />
              <PropertySection
                title="Stay in Gautam Buddha Nagar"
                items={propertyList.slice(4, 9)}
                locationName="Gautam Buddha Nagar"
              />
            </>
          )}
        </div>
      </section>

      <Footer/>
    </main>
  );
}