import { bookings as defaultBookings, Booking } from './dummy-data';

const STORAGE_KEY = 'havenly-bookings';

export function getStoredBookings(): Booking[] {
  if (typeof window === 'undefined') {
    return defaultBookings;
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return defaultBookings;
  }
  try {
    const parsed = JSON.parse(stored) as any[];
    const localBookings = parsed.map((b) => ({
      ...b,
      checkIn: new Date(b.checkIn),
      checkOut: new Date(b.checkOut),
      createdAt: new Date(b.createdAt),
    }));
    
    // Merge by ID, preferring local
    const merged = [...defaultBookings];
    for (const localB of localBookings) {
      const idx = merged.findIndex(b => b.id === localB.id);
      if (idx >= 0) {
        merged[idx] = localB as Booking;
      } else {
        merged.push(localB as Booking);
      }
    }
    return merged;
  } catch (e) {
    console.error('Failed to parse stored bookings:', e);
    return defaultBookings;
  }
}

export function saveStoredBooking(booking: Booking): Booking[] {
  if (typeof window === 'undefined') return defaultBookings;
  
  const existing = localStorage.getItem(STORAGE_KEY);
  const parsed = existing ? JSON.parse(existing) : [];
  
  // Check if it already exists (e.g. for status updates)
  const index = parsed.findIndex((b: any) => b.id === booking.id);
  if (index >= 0) {
    parsed[index] = booking;
  } else {
    parsed.push(booking);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  
  return getStoredBookings();
}
