'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating';

export interface FilterParams {
  minPrice: number;
  maxPrice: number;
  rating: number;
  propertyType: string;
  sortBy: SortOption;
  category: string;
}

// URL param key names — kept as a constant so they're easy to update in one place
const PARAM_KEYS = {
  minPrice: 'minPrice',
  maxPrice: 'maxPrice',
  rating: 'rating',
  propertyType: 'type',
  sortBy: 'sort',
  category: 'category',
} as const;

// Default values — a filter key is removed from the URL when its value equals this
export const FILTER_DEFAULTS: FilterParams = {
  minPrice: 0,
  maxPrice: 1000,
  rating: 0,
  propertyType: '',
  sortBy: 'featured',
  category: '',
};

// Non-filter params that must never be removed when clearing filters
const NON_FILTER_KEYS = new Set(['city', 'checkIn', 'checkOut', 'guests']);

// Safe number parser — returns fallback on null, empty string, or NaN
function parseNum(value: string | null, fallback: number): number {
  if (value === null || value === '') return fallback;
  const parsed = Number(value);
  return isNaN(parsed) ? fallback : parsed;
}

// Safe string parser — returns fallback on null
function parseStr(value: string | null, fallback: string): string {
  return value ?? fallback;
}

// Validate sort option — return default if unknown value comes in from URL
function parseSortOption(value: string | null): SortOption {
  const valid: SortOption[] = ['featured', 'price-low', 'price-high', 'rating'];
  const str = parseStr(value, FILTER_DEFAULTS.sortBy);
  return valid.includes(str as SortOption) ? (str as SortOption) : FILTER_DEFAULTS.sortBy;
}

export interface UseFilterParamsReturn {
  filters: FilterParams;
  setFilters: (partial: Partial<FilterParams>) => void;
  clearFilters: () => void;
}

/**
 * Reads filter state from URL search params and writes it back on change.
 * Uses router.replace so filter changes don't add to browser history.
 * Non-filter params (city, checkIn, checkOut, guests) are always preserved.
 */
export function useFilterParams(): UseFilterParamsReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Deserialize current URL into typed FilterParams
  const filters: FilterParams = {
    minPrice: parseNum(searchParams.get(PARAM_KEYS.minPrice), FILTER_DEFAULTS.minPrice),
    maxPrice: parseNum(searchParams.get(PARAM_KEYS.maxPrice), FILTER_DEFAULTS.maxPrice),
    rating: parseNum(searchParams.get(PARAM_KEYS.rating), FILTER_DEFAULTS.rating),
    propertyType: parseStr(searchParams.get(PARAM_KEYS.propertyType), FILTER_DEFAULTS.propertyType),
    sortBy: parseSortOption(searchParams.get(PARAM_KEYS.sortBy)),
    category: parseStr(searchParams.get(PARAM_KEYS.category), FILTER_DEFAULTS.category),
  };

  // Merge partial updates into the URL without touching non-filter params
  const setFilters = useCallback(
    (partial: Partial<FilterParams>) => {
      const next = new URLSearchParams(searchParams.toString());
      const updated: FilterParams = { ...filters, ...partial };

      // Map each FilterParams key → URL key, set or delete based on default
      (Object.keys(PARAM_KEYS) as Array<keyof typeof PARAM_KEYS>).forEach((field) => {
        const urlKey = PARAM_KEYS[field];
        const value = updated[field];
        const isDefault = value === FILTER_DEFAULTS[field];

        if (isDefault) {
          next.delete(urlKey);
        } else {
          next.set(urlKey, String(value));
        }
      });

      router.replace(`?${next.toString()}`, { scroll: false });
    },
    [router, searchParams, filters]
  );

  // Remove all filter keys; preserve non-filter params
  const clearFilters = useCallback(() => {
    const next = new URLSearchParams();

    // Keep only non-filter params
    searchParams.forEach((value: string, key: string) => {
      if (NON_FILTER_KEYS.has(key)) {
        next.set(key, value);
      }
    });

    const qs = next.toString();
    router.replace(qs ? `?${qs}` : '/', { scroll: false });
  }, [router, searchParams]);

  return { filters, setFilters, clearFilters };
}
