# Implementation Plan

- [x] 1. Create the `useFilterParams` custom hook



  - Create `hooks/use-filter-params.ts`
  - Define `FilterParams` interface and `FILTER_DEFAULTS` constant with all default values
  - Implement `parseNum` and `parseStr` internal helpers for safe URL param parsing
  - Implement `useFilterParams` using `useSearchParams` and `useRouter` from `next/navigation`
  - `setFilters(partial)` merges into existing `URLSearchParams` and calls `router.replace`; keys at their default value are deleted to keep URLs clean
  - `clearFilters()` removes all filter keys while preserving non-filter params (`city`, `checkIn`, `checkOut`, `guests`)





  - _Requirements: 1.1, 1.3, 1.4, 2.2, 4.1, 4.2, 4.3_

- [ ] 2. Refactor `FilterSidebar` to accept filter state as props
  - [x] 2.1 Update `FilterSidebar` props interface


    - Add `filters: FilterParams` and `onFiltersChange: (partial: Partial<FilterParams>) => void` props



    - Remove internal `useState` for `priceRange` and `minRating`; drive these from the new props instead
    - Wire property type checkboxes to `filters.propertyType` and call `onFiltersChange({ propertyType })` on change
    - Update "Clear All" button to call `onFiltersChange` with all filter defaults
    - _Requirements: 2.3, 2.4, 1.1_



  - [ ] 2.2 Write unit tests for `FilterSidebar` prop-driven rendering
    - Verify component renders with values from props
    - Verify `onFiltersChange` is called with correct partial on user interaction



    - _Requirements: 2.3, 2.4_

- [ ] 3. Wire `PropertiesPage` to `useFilterParams`
  - Call `useFilterParams()` at the top of `PropertiesPage`; remove local `useState` for `sortBy`, `priceFilter`, `ratingFilter`
  - Pass `filters` and `onFiltersChange` to `FilterSidebar`
  - Replace sort dropdown's `onChange` to call `setFilters({ sortBy })`
  - Wrap page content in `<Suspense>` as required by Next.js for `useSearchParams`
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [ ] 4. Wire `HomePage` to `useFilterParams` for category sync
  - Replace local `selectedCategory` state with `filters.category` from `useFilterParams()`
  - Replace `setSelectedCategory` calls in `CategoryFilter`'s `onCategoryChange` with `setFilters({ category })`
  - Replace `handleClearFilters` with `clearFilters()` from the hook
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 5. Write unit tests for `useFilterParams`
  - Create `hooks/__tests__/use-filter-params.test.ts`
  - Test that `parseNum` and `parseStr` return defaults for invalid/missing inputs
  - Test that `setFilters` removes a key from the URL when the new value equals the default
  - Test that `clearFilters` preserves non-filter params (`city`, `checkIn`)
  - _Requirements: 2.2, 1.3, 1.4, 4.3_
