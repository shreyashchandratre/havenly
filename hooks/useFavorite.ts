import { useState, useEffect, useCallback } from 'react';
import type { Property } from '@/lib/dummy-data';

export const getFavoriteIds = (): string[] => {
  if (typeof window === 'undefined') return [];

  try {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  } catch {
    return [];
  }
};

export const getFavorites = (allProperties: Property[]): Property[] => {
  const ids = getFavoriteIds();
  return allProperties.filter((p) => ids.includes(p.id));
};

const saveFavoriteIds = (ids: string[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('favorites', JSON.stringify(ids));
};

export function useFavorite(propertyId: string) {
  const [isSaved, setIsSaved] = useState(false);

  const syncFavoriteStatus = useCallback(() => {
    const ids = getFavoriteIds();
    setIsSaved(ids.includes(propertyId));
  }, [propertyId]);

  useEffect(() => {
    syncFavoriteStatus();

    const handleUpdate = () => {
      syncFavoriteStatus();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('favoritesUpdated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('favoritesUpdated', handleUpdate);
    };
  }, [syncFavoriteStatus]);

  const toggleFavorite = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const ids = getFavoriteIds();

    if (isSaved) {
      saveFavoriteIds(ids.filter((id) => id !== propertyId));
      setIsSaved(false);
    } else {
      if (!ids.includes(propertyId)) {
        saveFavoriteIds([...ids, propertyId]);
      }
      setIsSaved(true);
    }

    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  return { isSaved, toggleFavorite };
}
