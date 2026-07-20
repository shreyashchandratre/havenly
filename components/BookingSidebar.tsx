'use client';

import { useState } from 'react';
import { Calendar, Users, Star, Share2, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Property } from '@/lib/dummy-data';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/lib/use-locale';
import { convertPrice, formatCurrency, getLocaleForLanguage } from '@/lib/locale-currency';

interface BookingSidebarProps {
  property: Property;
}

export function BookingSidebar({ property }: BookingSidebarProps) {
  const [guests, setGuests] = useState(1);
  const { toast } = useToast();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 86_400_000).toISOString().split('T')[0]
    : today;

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const isInvalidRange = Boolean(checkIn && checkOut && nights <= 0);

  const { settings } = useLocale();
  const locale = getLocaleForLanguage(settings.language);

  // Base prices in this demo dataset are treated as INR.
  const totalPriceInINR = nights * property.pricePerNight;

  const pricePerNightConverted = convertPrice(property.pricePerNight, settings.currency);
  const totalPriceConverted = convertPrice(totalPriceInINR, settings.currency);
  const cleaningFeeInINR = 50 * 83; // $50 -> ₹ (approx) to keep consistent with USD-based demo
  const cleaningFeeConverted = convertPrice(cleaningFeeInINR, settings.currency);
  const grandTotalConverted = totalPriceConverted + cleaningFeeConverted;

  return (
    <Card className="p-6 border-border sticky top-24 space-y-6">
      {/* Price Header */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">
            {formatCurrency(pricePerNightConverted, settings.currency, locale)}
          </span>
          <span className="text-muted-foreground">per night</span>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <Star size={16} className="fill-foreground text-foreground" />
          <span className="font-semibold text-foreground">
            {property.rating.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">
            ({property.reviewCount} reviews)
          </span>
        </div>
      </div>

      {/* Booking Form */}
      <div className="space-y-4">
        {/* Check-in Date */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            Check-in
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <Calendar size={18} className="text-muted-foreground" />
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => {
                setCheckIn(e.target.value);
                if (checkOut && checkOut <= e.target.value) {
                  setCheckOut('');
                }
              }}
              className="flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            Check-out
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <Calendar size={18} className="text-muted-foreground" />
            <input
              type="date"
              value={checkOut}
              min={minCheckOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          {isInvalidRange && (
            <p className="mt-1 text-xs text-red-500">
              Check-out must be after check-in.
            </p>
          )}
        </div>

        {/* Guests */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            Guests
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <Users size={18} className="text-muted-foreground" />
            <input
              type="number"
              min="1"
              max={property.capacity.guests}
              value={guests}
              onChange={(e) =>
                setGuests(
                  Math.min(
                    property.capacity.guests,
                    Math.max(1, parseInt(e.target.value) || 1)
                  )
                )
              }
              className="flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Maximum {property.capacity.guests} guests
          </p>
        </div>
      </div>

      {/* Reserve Button */}
      <Button
        className="w-full bg-primary text-primary-foreground py-3 text-base font-semibold hover:opacity-90 transition"
        disabled={isInvalidRange}
      >
        Reserve
      </Button>

      {/* Price Breakdown */}
      {nights > 0 && !isInvalidRange && (
        <div className="space-y-2 border-t border-border pt-6 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground">
              {formatCurrency(pricePerNightConverted, settings.currency, locale)} × {nights} nights
            </span>
            <span className="font-semibold text-foreground">
              {formatCurrency(totalPriceConverted, settings.currency, locale)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground">Cleaning fee</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(cleaningFeeConverted, settings.currency, locale)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold text-foreground">
              {formatCurrency(grandTotalConverted, settings.currency, locale)}
            </span>
          </div>
        </div>
      )}

      {/* Share and Save */}
      <div className="flex gap-3 border-t border-border pt-6">
        <Button
          variant="outline"
          className="flex-1"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({ title: 'Link copied to clipboard!' });
          }}
        >
          <Share2 size={16} className="mr-2" />
          Share
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => setIsSaved(!isSaved)}
        >
          <Heart
            size={16}
            className={`mr-2 ${isSaved ? 'fill-red-500 text-red-500' : ''}`}
          />
          Save
        </Button>
      </div>
    </Card>
  );
}
