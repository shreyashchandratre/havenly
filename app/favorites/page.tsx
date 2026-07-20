'use client';

import { useEffect, useState } from 'react';
import { PropertyCard } from '@/components/PropertyCard';
import { getFavoriteIds } from '@/hooks/useFavorite';
import { Property } from '@/lib/dummy-data';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getStoredProperties } from '@/lib/properties';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Property[]>([]);

  const loadFavorites = () => {
    // Get the current favorite IDs from localStorage
    const ids = getFavoriteIds();
    if (ids.length === 0) {
      setFavorites([]);
      return;
    }

    // Look up live property data for each ID so that edits to listings
    // are reflected here rather than showing stale cached copies.
    const allProperties = getStoredProperties();
    const live = allProperties.filter((p) => ids.includes(p.id));
    setFavorites(live);
  };

  useEffect(() => {
    loadFavorites();

    // Re-sync whenever favorites change (e.g. user unfavorites from another tab)
    const handleUpdate = () => loadFavorites();
    window.addEventListener('favoritesUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('favoritesUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Your Favorites
        </h1>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-xl font-semibold mb-2">
              No favorites yet
            </h2>
            <p className="text-muted-foreground">
              Start exploring and save properties you love 
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
