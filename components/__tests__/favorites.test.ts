import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock Next.js and Lucide React imports before importing PropertyCard
vi.mock('next/image', () => ({
  __esModule: true,
  default: () => null,
}));
vi.mock('next/link', () => ({
  __esModule: true,
  default: () => null,
}));
vi.mock('lucide-react', () => ({
  Heart: () => null,
  Star: () => null,
}));

import { PropertyCard } from '../PropertyCard';
import { getFavorites, getFavoriteIds } from '../../hooks/useFavorite';
import { Property } from '@/lib/dummy-data';

// Mock localStorage in global scope
class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

const mockLocalStorage = new MockLocalStorage();

const mockProperty: Property = {
  id: 'prop-1',
  title: 'Luxury Villa',
  description: 'Stunning villa.',
  image: '',
  images: [],
  location: { city: 'Paris', state: 'France', country: 'France', coordinates: { lat: 0, lng: 0 } },
  pricePerNight: 500,
  rating: 4.9,
  reviewCount: 30,
  category: 'luxury',
  type: 'Entire Place',
  capacity: { guests: 6, bedrooms: 3, beds: 3, bathrooms: 3 },
  amenities: [],
  hostId: 'host-1',
  createdAt: new Date()
};

describe('favorites helper functions', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.stubGlobal('window', {});
    vi.stubGlobal('localStorage', mockLocalStorage);
  });

  describe('getFavoriteIds', () => {
    it('should return empty list when no favorites are saved', () => {
      const ids = getFavoriteIds();
      expect(ids).toEqual([]);
    });

    it('should return saved favorite IDs', () => {
      mockLocalStorage.setItem('favorites', JSON.stringify(['prop-1', 'prop-2']));
      const ids = getFavoriteIds();
      expect(ids).toEqual(['prop-1', 'prop-2']);
    });

    it('should return empty list if favorites in localStorage is invalid JSON', () => {
      mockLocalStorage.setItem('favorites', 'invalid-json');
      const ids = getFavoriteIds();
      expect(ids).toEqual([]);
    });
  });

  describe('getFavorites', () => {
    it('should return empty list when no favorites are saved', () => {
      const favorites = getFavorites([mockProperty]);
      expect(favorites).toEqual([]);
    });

    it('should filter allProperties and return saved favorite properties', () => {
      mockLocalStorage.setItem('favorites', JSON.stringify(['prop-1']));
      const favorites = getFavorites([mockProperty]);
      expect(favorites.length).toBe(1);
      expect(favorites[0].id).toBe('prop-1');
      expect(favorites[0].title).toBe('Luxury Villa');
    });

    it('should ignore properties that are in favorites but do not exist in allProperties', () => {
      mockLocalStorage.setItem('favorites', JSON.stringify(['prop-1', 'non-existent']));
      const favorites = getFavorites([mockProperty]);
      expect(favorites.length).toBe(1);
      expect(favorites[0].id).toBe('prop-1');
    });
  });
});
