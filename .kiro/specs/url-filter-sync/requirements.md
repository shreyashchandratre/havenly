# Requirements Document

## Introduction

This feature syncs the Havenly filter system state — including price range, minimum rating, property type, category, and sort order — with the browser's URL search parameters using Next.js `useSearchParams` and `useRouter`. This enables filter state to persist across page refreshes and makes filtered views shareable via URL. The two primary surfaces are the `FilterSidebar` component used on `/properties` and the `CategoryFilter` / search params used on the home page (`/`).

## Glossary

- **Filter State**: The combined set of active filter values — price range, minimum rating, property type, category, and sort order.
- **URL Search Parameters**: Key-value pairs appended to the URL after `?`, e.g. `?minPrice=100&maxPrice=500&rating=4.5`.
- **FilterSidebar**: The sidebar component on `/properties` that exposes price range, rating, and property type filters.
- **CategoryFilter**: The horizontal scrollable category selector on the home page (`/`).
- **PropertiesPage**: The `/properties` route that renders `FilterSidebar` alongside the properties grid.
- **HomePage**: The `/` route that uses `CategoryFilter` and search-param-driven filters (city, checkIn, checkOut, guests).
- **useSearchParams**: Next.js hook from `next/navigation` that reads the current URL's query string in a client component.
- **useRouter**: Next.js hook from `next/navigation` used to push URL updates without full navigation.
- **Serialization**: Converting filter state values into URL-safe strings for storage in search params.
- **Deserialization**: Parsing URL search param strings back into typed filter state values on component mount.
- **Default Value**: The value a filter assumes when its corresponding URL param is absent.

## Requirements

### Requirement 1

**User Story:** As a guest, I want the active filters to be reflected in the URL, so that I can share a filtered view with others and the URL accurately represents what I see.

#### Acceptance Criteria

1. WHEN a user changes any filter value (price range, rating, property type, category, or sort order), THE FilterSystem SHALL update the browser URL search parameters to include the new filter value without triggering a full page navigation.
2. WHEN a user copies and opens the URL in a new browser tab, THE FilterSystem SHALL restore all filter values from the URL search parameters.
3. WHEN a filter is set to its default value, THE FilterSystem SHALL remove that filter's key from the URL search parameters to keep URLs clean.
4. WHEN the URL contains filter parameters, THE FilterSystem SHALL preserve all other existing URL parameters (such as `city`, `checkIn`, `checkOut`, `guests`) while updating filter-specific keys.

---

### Requirement 2

**User Story:** As a guest, I want my filters to survive a page refresh, so that I don't have to re-apply them after reloading.

#### Acceptance Criteria

1. WHEN the `/properties` page mounts with URL search parameters present, THE PropertiesPage SHALL initialize `FilterSidebar` filter state by deserializing values from those URL parameters.
2. WHEN a URL parameter value cannot be parsed into a valid filter value, THE FilterSystem SHALL fall back to the default value for that filter without throwing an error.
3. WHILE URL parameters are present for price range, THE FilterSidebar SHALL display the minimum and maximum price inputs reflecting those URL values.
4. WHILE URL parameters are present for rating, THE FilterSidebar SHALL display the selected rating option reflecting that URL value.

---

### Requirement 3

**User Story:** As a guest, I want the category filter on the home page to sync with the URL, so that refreshing the page or sharing the link preserves the selected category.

#### Acceptance Criteria

1. WHEN a user selects a category in `CategoryFilter`, THE HomePage SHALL update the `category` URL search parameter to the selected category id.
2. WHEN the HomePage mounts with a `category` URL parameter, THE CategoryFilter SHALL render with that category highlighted as selected.
3. WHEN a user clears all filters, THE FilterSystem SHALL remove all filter-related URL parameters, leaving only non-filter parameters intact.

---

### Requirement 4

**User Story:** As a developer, I want filter URL syncing to be implemented through a reusable custom hook, so that the logic is decoupled from UI components and is easy to maintain or extend.

#### Acceptance Criteria

1. THE FilterSystem SHALL expose a custom hook (`useFilterParams`) that encapsulates reading from and writing to URL search parameters for all filter keys.
2. WHEN `useFilterParams` is called, THE hook SHALL return the current parsed filter state and a setter function that merges new values into the existing URL params.
3. THE `useFilterParams` hook SHALL define typed defaults for each filter key so that components receive correctly-typed values with no additional parsing logic.
4. WHERE a new filter key is added to the system, THE `useFilterParams` hook SHALL require only a default value entry and a param key to support the new filter without modifying consumer components.
