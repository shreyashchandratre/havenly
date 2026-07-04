'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterParams, FILTER_DEFAULTS } from '@/hooks/use-filter-params';

interface FilterSidebarProps {
  onClose?: () => void;
  isOpen?: boolean;
  /** Current filter state — driven by useFilterParams in the parent */
  filters: FilterParams;
  /** Called with a partial update whenever the user changes a filter */
  onFiltersChange: (partial: Partial<FilterParams>) => void;
}

const propertyTypes = [
  { id: 'entire', label: 'Entire Place' },
  { id: 'room', label: 'Room' },
  { id: 'shared', label: 'Shared Room' },
];

const ratings = [
  { value: 4.5, label: '4.5+ (Excellent)' },
  { value: 4.0, label: '4.0+ (Very Good)' },
  { value: 3.5, label: '3.5+ (Good)' },
];

export function FilterSidebar({
  onClose,
  isOpen = true,
  filters,
  onFiltersChange,
}: FilterSidebarProps) {
  // UI-only state — just controls accordion open/closed; not part of filter state
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    rating: true,
    type: true,
  });

  const toggleFilter = (filter: keyof typeof expandedFilters) => {
    setExpandedFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  const handleMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) onFiltersChange({ minPrice: Math.max(0, val) });
  };

  const handleMaxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) onFiltersChange({ maxPrice: Math.min(10000, val) });
  };

  const handlePropertyType = (typeId: string) => {
    // Toggle: selecting the same type again clears it
    onFiltersChange({ propertyType: filters.propertyType === typeId ? '' : typeId });
  };

  const handleClearAll = () => {
    onFiltersChange({
      minPrice: FILTER_DEFAULTS.minPrice,
      maxPrice: FILTER_DEFAULTS.maxPrice,
      rating: FILTER_DEFAULTS.rating,
      propertyType: FILTER_DEFAULTS.propertyType,
    });
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-80 border-r border-border bg-white px-6 py-4 transform transition-transform md:relative md:inset-auto md:w-64 md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between md:mb-6">
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          <button
            onClick={onClose}
            className="md:hidden p-1 hover:bg-muted rounded transition"
            aria-label="Close filters"
          >
            <X size={20} className="text-foreground" />
          </button>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6 border-b border-border pb-6">
          <button
            onClick={() => toggleFilter('price')}
            className="flex w-full items-center justify-between font-semibold text-foreground hover:text-primary transition"
          >
            <span>Price Range</span>
            <ChevronDown
              size={20}
              className={`transition-transform ${expandedFilters.price ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedFilters.price && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Minimum Price
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">$</span>
                  <Input
                    type="number"
                    value={filters.minPrice}
                    onChange={handleMinPrice}
                    min={0}
                    max={10000}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Maximum Price
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">$</span>
                  <Input
                    type="number"
                    value={filters.maxPrice}
                    onChange={handleMaxPrice}
                    min={0}
                    max={10000}
                    className="h-9"
                  />
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="1000"
                value={filters.maxPrice}
                onChange={(e) =>
                  onFiltersChange({ maxPrice: parseInt(e.target.value) })
                }
                className="w-full accent-primary"
                aria-label="Maximum price slider"
              />
            </div>
          )}
        </div>

        {/* Minimum Rating Filter */}
        <div className="mb-6 border-b border-border pb-6">
          <button
            onClick={() => toggleFilter('rating')}
            className="flex w-full items-center justify-between font-semibold text-foreground hover:text-primary transition"
          >
            <span>Rating</span>
            <ChevronDown
              size={20}
              className={`transition-transform ${expandedFilters.rating ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedFilters.rating && (
            <div className="mt-4 space-y-2">
              {ratings.map((r) => (
                <label key={r.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={r.value}
                    checked={filters.rating === r.value}
                    onChange={() => onFiltersChange({ rating: r.value })}
                    className="h-4 w-4 cursor-pointer accent-primary"
                  />
                  <span className="text-sm text-foreground">{r.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Property Type Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleFilter('type')}
            className="flex w-full items-center justify-between font-semibold text-foreground hover:text-primary transition"
          >
            <span>Property Type</span>
            <ChevronDown
              size={20}
              className={`transition-transform ${expandedFilters.type ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedFilters.type && (
            <div className="mt-4 space-y-2">
              {propertyTypes.map((type) => (
                <label key={type.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.propertyType === type.id}
                    onChange={() => handlePropertyType(type.id)}
                    className="h-4 w-4 cursor-pointer accent-primary rounded"
                  />
                  <span className="text-sm text-foreground">{type.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        <Button variant="outline" className="w-full" onClick={handleClearAll}>
          Clear All
        </Button>
      </aside>
    </>
  );
}
