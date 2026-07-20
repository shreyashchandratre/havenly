import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFilterParams, FILTER_DEFAULTS } from '@/hooks/use-filter-params';

// --- Mocks for next/navigation ---

const mockReplace = vi.fn();

// We control what the fake search params return via this map
let fakeParams: Record<string, string> = {};

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => ({
    get: (key: string) => fakeParams[key] ?? null,
    toString: () => new URLSearchParams(fakeParams).toString(),
    forEach: (cb: (value: string, key: string) => void) => {
      Object.entries(fakeParams).forEach(([k, v]) => cb(v, k));
    },
  }),
}));

beforeEach(() => {
  fakeParams = {};
  mockReplace.mockClear();
});

// ─── Deserialization (reading from URL) ──────────────────────────────────────

describe('useFilterParams — deserialization', () => {
  it('returns all defaults when URL has no filter params', () => {
    const { result } = renderHook(() => useFilterParams());
    expect(result.current.filters).toEqual(FILTER_DEFAULTS);
  });

  it('parses valid minPrice and maxPrice from URL', () => {
    fakeParams = { minPrice: '100', maxPrice: '750' };
    const { result } = renderHook(() => useFilterParams());
    expect(result.current.filters.minPrice).toBe(100);
    expect(result.current.filters.maxPrice).toBe(750);
  });

  it('falls back to default minPrice when URL value is not a number', () => {
    fakeParams = { minPrice: 'abc' };
    const { result } = renderHook(() => useFilterParams());
    expect(result.current.filters.minPrice).toBe(FILTER_DEFAULTS.minPrice);
  });

  it('falls back to default maxPrice when URL value is empty string', () => {
    fakeParams = { maxPrice: '' };
    const { result } = renderHook(() => useFilterParams());
    expect(result.current.filters.maxPrice).toBe(FILTER_DEFAULTS.maxPrice);
  });

  it('parses a valid rating from URL', () => {
    fakeParams = { rating: '4.5' };
    const { result } = renderHook(() => useFilterParams());
    expect(result.current.filters.rating).toBe(4.5);
  });

  it('falls back to default rating when URL value is invalid', () => {
    fakeParams = { rating: 'excellent' };
    const { result } = renderHook(() => useFilterParams());
    expect(result.current.filters.rating).toBe(FILTER_DEFAULTS.rating);
  });

  it('parses a valid sort option from URL', () => {
    fakeParams = { sort: 'price-low' };
    const { result } = renderHook(() => useFilterParams());
    expect(result.current.filters.sortBy).toBe('price-low');
  });

  it('falls back to "featured" when sort param is an unknown value', () => {
    fakeParams = { sort: 'newest' };
    const { result } = renderHook(() => useFilterParams());
    expect(result.current.filters.sortBy).toBe('featured');
  });

  it('parses category and type from URL', () => {
    fakeParams = { category: 'beachfront', type: 'entire' };
    const { result } = renderHook(() => useFilterParams());
    expect(result.current.filters.category).toBe('beachfront');
    expect(result.current.filters.propertyType).toBe('entire');
  });
});

// ─── setFilters — writing to URL ─────────────────────────────────────────────

describe('useFilterParams — setFilters', () => {
  it('calls router.replace with the updated param when a non-default value is set', () => {
    const { result } = renderHook(() => useFilterParams());

    act(() => {
      result.current.setFilters({ minPrice: 200 });
    });

    expect(mockReplace).toHaveBeenCalledOnce();
    const url: string = mockReplace.mock.calls[0][0];
    expect(url).toContain('minPrice=200');
  });

  it('removes a param from the URL when the value is reset to its default', () => {
    fakeParams = { minPrice: '200' };
    const { result } = renderHook(() => useFilterParams());

    act(() => {
      result.current.setFilters({ minPrice: FILTER_DEFAULTS.minPrice });
    });

    const url: string = mockReplace.mock.calls[0][0];
    expect(url).not.toContain('minPrice');
  });

  it('removes the sort param when sortBy is reset to "featured"', () => {
    fakeParams = { sort: 'rating' };
    const { result } = renderHook(() => useFilterParams());

    act(() => {
      result.current.setFilters({ sortBy: 'featured' });
    });

    const url: string = mockReplace.mock.calls[0][0];
    expect(url).not.toContain('sort');
  });

  it('preserves existing non-filter params (city, checkIn) when updating a filter', () => {
    fakeParams = { city: 'Paris', checkIn: '2026-08-01', maxPrice: '500' };
    const { result } = renderHook(() => useFilterParams());

    act(() => {
      result.current.setFilters({ rating: 4.0 });
    });

    const url: string = mockReplace.mock.calls[0][0];
    expect(url).toContain('city=Paris');
    expect(url).toContain('checkIn=2026-08-01');
    expect(url).toContain('rating=4');
  });
});

// ─── clearFilters ─────────────────────────────────────────────────────────────

describe('useFilterParams — clearFilters', () => {
  it('removes all filter keys from the URL', () => {
    fakeParams = { minPrice: '100', maxPrice: '500', rating: '4.5', sort: 'rating', category: 'mountains', type: 'entire' };
    const { result } = renderHook(() => useFilterParams());

    act(() => {
      result.current.clearFilters();
    });

    const url: string = mockReplace.mock.calls[0][0];
    expect(url).not.toContain('minPrice');
    expect(url).not.toContain('maxPrice');
    expect(url).not.toContain('rating');
    expect(url).not.toContain('sort');
    expect(url).not.toContain('category');
    expect(url).not.toContain('type');
  });

  it('preserves non-filter params (city, checkIn, checkOut, guests) after clearing', () => {
    fakeParams = { city: 'Tokyo', checkIn: '2026-09-01', checkOut: '2026-09-07', guests: '2', rating: '4.5' };
    const { result } = renderHook(() => useFilterParams());

    act(() => {
      result.current.clearFilters();
    });

    const url: string = mockReplace.mock.calls[0][0];
    expect(url).toContain('city=Tokyo');
    expect(url).toContain('checkIn=2026-09-01');
    expect(url).toContain('checkOut=2026-09-07');
    expect(url).toContain('guests=2');
    expect(url).not.toContain('rating');
  });

  it('navigates to "/" when no non-filter params remain after clearing', () => {
    fakeParams = { rating: '4.0', sort: 'price-low' };
    const { result } = renderHook(() => useFilterParams());

    act(() => {
      result.current.clearFilters();
    });

    expect(mockReplace).toHaveBeenCalledWith('/', { scroll: false });
  });
});
