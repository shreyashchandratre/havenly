'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LocaleCurrencyButton } from '@/components/LocaleCurrencyButton';
type Destination = {
  name: string;
  sub: string;
};

const TAB_NAMES = [
  'Popular',
  'Arts & culture',
  'Beach',
  'Mountains',
  'Outdoors',
  'Things to do',
] as const;

type TabName = (typeof TAB_NAMES)[number];

const DESTINATIONS_BY_TAB: Record<TabName, Destination[]> = {
  Popular: [
    { name: 'Canmore', sub: 'Apartment rentals' },
    { name: 'Benalmádena', sub: 'Apartment rentals' },
    { name: 'Marbella', sub: 'Apartment rentals' },
    { name: 'Mijas', sub: 'House rentals' },
    { name: 'Prescott', sub: 'Pet-friendly rentals' },
    { name: 'Scottsdale', sub: 'Apartment rentals' },
    { name: 'Tucson', sub: 'Pet-friendly rentals' },
    { name: 'Jasper', sub: 'Cabin rentals' },
    { name: 'Mountain View', sub: 'Family-friendly rentals' },
    { name: 'Devonport', sub: 'Cottage rentals' },
    { name: 'Mallacoota', sub: 'Pet-friendly rentals' },
    { name: 'Ibiza', sub: 'Holiday rentals' },
  ],
  'Arts & culture': [
    { name: 'Florence', sub: 'Apartment rentals' },
    { name: 'Kyoto', sub: 'House rentals' },
    { name: 'Vienna', sub: 'Apartment rentals' },
    { name: 'Oaxaca', sub: 'Villa rentals' },
    { name: 'Marrakech', sub: 'Riad rentals' },
    { name: 'Edinburgh', sub: 'Cottage rentals' },
    { name: 'Prague', sub: 'Apartment rentals' },
    { name: 'Cairo', sub: 'Apartment rentals' },
    { name: 'Rome', sub: 'House rentals' },
    { name: 'Athens', sub: 'Apartment rentals' },
    { name: 'Cusco', sub: 'House rentals' },
    { name: 'Seville', sub: 'Apartment rentals' },
  ],
  Beach: [
    { name: 'Cancun', sub: 'Beachfront rentals' },
    { name: 'Bali', sub: 'Villa rentals' },
    { name: 'Gold Coast', sub: 'Apartment rentals' },
    { name: 'Phuket', sub: 'Beachfront rentals' },
    { name: 'Zanzibar', sub: 'Beach hut rentals' },
    { name: 'Malibu', sub: 'House rentals' },
    { name: 'Santorini', sub: 'Villa rentals' },
    { name: 'Goa', sub: 'Beachfront rentals' },
    { name: 'Nice', sub: 'Apartment rentals' },
    { name: 'Maui', sub: 'Beach house rentals' },
    { name: 'Byron Bay', sub: 'Beachfront rentals' },
    { name: 'Positano', sub: 'Villa rentals' },
  ],
  Mountains: [
    { name: 'Aspen', sub: 'Cabin rentals' },
    { name: 'Banff', sub: 'Chalet rentals' },
    { name: 'Chamonix', sub: 'Chalet rentals' },
    { name: 'Queenstown', sub: 'Cabin rentals' },
    { name: 'Zermatt', sub: 'Chalet rentals' },
    { name: 'Whistler', sub: 'Cabin rentals' },
    { name: 'Interlaken', sub: 'Chalet rentals' },
    { name: 'Boulder', sub: 'House rentals' },
    { name: 'Lake Tahoe', sub: 'Cabin rentals' },
    { name: 'Innsbruck', sub: 'Chalet rentals' },
    { name: 'Snowdonia', sub: 'Cottage rentals' },
    { name: 'Manali', sub: 'Cabin rentals' },
  ],
  Outdoors: [
    { name: 'Moab', sub: 'Cabin rentals' },
    { name: 'Yosemite Valley', sub: 'Cabin rentals' },
    { name: 'Queenstown', sub: 'House rentals' },
    { name: 'Torres del Paine', sub: 'Lodge rentals' },
    { name: 'Kruger', sub: 'Safari lodge rentals' },
    { name: 'Sedona', sub: 'House rentals' },
    { name: 'Fiordland', sub: 'Cabin rentals' },
    { name: 'Jackson Hole', sub: 'Cabin rentals' },
    { name: 'Blue Mountains', sub: 'Cottage rentals' },
    { name: 'Lake District', sub: 'Cottage rentals' },
    { name: 'Costa Rica', sub: 'Eco-lodge rentals' },
    { name: 'Patagonia', sub: 'Lodge rentals' },
  ],
  'Things to do': [
    { name: 'New York', sub: 'Apartment rentals' },
    { name: 'London', sub: 'Apartment rentals' },
    { name: 'Tokyo', sub: 'Apartment rentals' },
    { name: 'Paris', sub: 'Apartment rentals' },
    { name: 'Singapore', sub: 'Apartment rentals' },
    { name: 'Barcelona', sub: 'Apartment rentals' },
    { name: 'Berlin', sub: 'Apartment rentals' },
    { name: 'Sydney', sub: 'Apartment rentals' },
    { name: 'Dubai', sub: 'Apartment rentals' },
    { name: 'Amsterdam', sub: 'Apartment rentals' },
    { name: 'Bangkok', sub: 'Apartment rentals' },
    { name: 'Toronto', sub: 'Apartment rentals' },
  ],
};

export function Footer() {
  const [activeTab, setActiveTab] = useState<TabName>('Popular');
  const [isExpanded, setIsExpanded] = useState(false);

  const VISIBLE_COUNT = 6;
  const destinations = DESTINATIONS_BY_TAB[activeTab];
  const visibleDestinations = isExpanded ? destinations : destinations.slice(0, VISIBLE_COUNT);

  return (
    <footer className="bg-background border-t border-border pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Inspiration Section */}
        <div className="mb-12">
          <h2 className="text-[22px] font-semibold text-foreground mb-4">Inspiration for future getaways</h2>
          <div className="flex gap-6 border-b border-border overflow-x-auto hide-scrollbar mb-8">
            {TAB_NAMES.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setIsExpanded(false);
                }}
                className={`pb-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  tab === activeTab
                    ? 'border-b-2 border-foreground text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-4">
            {visibleDestinations.map((loc) => (
              <div key={loc.name} className="cursor-pointer group">
                <div className="text-sm font-medium text-foreground group-hover:text-muted-foreground">{loc.name}</div>
                <div className="text-sm text-muted-foreground">{loc.sub}</div>
              </div>
            ))}

            {destinations.length > VISIBLE_COUNT && (
              <button
                type="button"
                onClick={() => setIsExpanded((v) => !v)}
                aria-expanded={isExpanded ? 'true' : 'false'}
                className="flex items-center gap-1 text-sm font-semibold text-foreground cursor-pointer hover:underline"
              >
                {isExpanded ? 'Show less' : 'Show more'}{' '}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={isExpanded ? 'rotate-180 transition-transform' : ''}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            )}
          </div>
        </div>


        <hr className="border-border mb-12" />

        {/* Links Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3 mb-12">
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/help-centre" className="hover:underline">
                  Help Centre
                </Link>
              </li>
              <li>
                <Link href="/aircover" className="hover:underline">
                  Aircover
                </Link>
              </li>
              <li>
                <Link href="/anti-discrimination" className="hover:underline">
                  Anti-discrimination
                </Link>
              </li>
              <li>
                <Link href="/disability-support" className="hover:underline">
                  Disability Support
                </Link>
              </li>
              <li>
                <Link href="/cancellation-options" className="hover:underline">
                  Cancellation Options
                </Link>
              </li>
              <li>
                <Link href="/report-neighbourhood-concerns" className="hover:underline">
                  Report Neighbourhood Concerns
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-4">Hosting</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="/havenly-your-home" className="hover:underline">Havenly your home</a></li>
              <li>
                <Link href="/aircover-hosts" className="hover:underline">
                  AirCover for Hosts
                </Link>
              </li>

              <li>
                <Link href="/hosting-resources" className="hover:underline">
                  Hosting resources
                </Link>
              </li>

              <li>
                <Link href="/community-forum" className="hover:underline">
                  Community forum
                </Link>
              </li>

              <li>
                <Link href="/hosting-responsibility" className="hover:underline">
                  Hosting responsibly
                </Link>
              </li>

              <li>
                <Link href="/free-hosting-class" className="hover:underline">
                  Join a free hosting class
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-4">Havenly</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/newsroom" className="hover:underline">Newsroom</Link></li>
              <li><a href="/new-features" className="hover:underline">New features</a></li>
              <li>
                <Link href="/careers" className="hover:underline">
                  Careers
                </Link>
              </li>
              <li><a href="/investors" className="hover:underline">Investors</a></li>
              <li><Link href="/contributors" className="hover:underline">Contributors</Link></li>
              <li><a href="/emergency-stay" className="hover:underline">Havenly.org emergency stays</a></li>
            </ul>
          </div>
        </div>

        <hr className="border-border mb-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-foreground">
            <span>© 2026 Havenly, Inc.</span>
            <span>·</span>
            <a href="/privacy" className="hover:underline">Privacy</a>
            <span>·</span>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <span>·</span>
            <a href="/sitemap" className="hover:underline">Sitemap</a>
            <span>·</span>
            <Link href="/company-details" className="hover:underline">Company details</Link>
          </div>

          <div className="flex items-center gap-6">
            <LocaleCurrencyButton />
            <div className="flex items-center gap-3">
              {/* Social Icons Placeholder */}
              <a href="#" aria-label="Facebook" className="text-foreground hover:opacity-80 transition"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg></a>
              <a href="#" aria-label="Twitter" className="text-foreground hover:opacity-80 transition"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg></a>
              <a href="#" aria-label="Instagram" className="text-foreground hover:opacity-80 transition"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
