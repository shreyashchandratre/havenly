'use client';

import { useMemo } from 'react';
import type { Property } from '@/lib/dummy-data';
import { useLocale } from '@/lib/use-locale';
import { convertPrice, formatCurrency, getLocaleForLanguage } from '@/lib/locale-currency';

export function PriceText({
  propertyPricePerNightInINR,
  label,
  forNights,
}: {
  propertyPricePerNightInINR: number;
  label?: string;
  forNights?: number;
}) {
  const { settings } = useLocale();

  const locale = useMemo(() => getLocaleForLanguage(settings.language), [settings.language]);

  const amount = useMemo(() => {
    const base = forNights ? propertyPricePerNightInINR * forNights : propertyPricePerNightInINR;
    return convertPrice(base, settings.currency);
  }, [forNights, propertyPricePerNightInINR, settings.currency]);

  return (
    <span>
      {formatCurrency(amount, settings.currency, locale)}
      {label ? ` ${label}` : ''}
    </span>
  );
}

export function PropertyPriceText({ property }: { property: Property }) {
  return <PriceText propertyPricePerNightInINR={property.pricePerNight} label="for 2 nights" forNights={2} />;
}

