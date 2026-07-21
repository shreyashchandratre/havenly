import { describe, it, expect } from 'vitest';
import { parseSearchQuery } from '../nlp-parser';

describe('NLP Parser', () => {
  it('should parse pet-friendly apartment under $1200 near Malibu', () => {
    const query = 'Show me a pet-friendly apartment under $1200 near Malibu';
    const parsed = parseSearchQuery(query);

    expect(parsed.location).toBe('Malibu');
    expect(parsed.maxPrice).toBe(1200);
    expect(parsed.types).toContain('Entire Place');
    expect(parsed.amenities).toContain('pets');
  });

  it('should parse villa with a swimming pool and free parking', () => {
    const query = 'Find a villa with a swimming pool and free parking';
    const parsed = parseSearchQuery(query);

    expect(parsed.types).toContain('Entire Place');
    expect(parsed.amenities).toContain('pool');
    expect(parsed.amenities).toContain('parking');
  });

  it('should parse 2 BHK apartment with Wi-Fi close to Varanasi', () => {
    const query = '2 BHK apartment with Wi-Fi close to Varanasi';
    const parsed = parseSearchQuery(query);

    expect(parsed.location).toBe('Varanasi');
    expect(parsed.bedrooms).toBe(2);
    expect(parsed.types).toContain('Entire Place');
    expect(parsed.amenities).toContain('wifi');
  });

  it('should parse guest constraints and ratings', () => {
    const query = 'Private room in Paris for 3 guests with rating above 4.5';
    const parsed = parseSearchQuery(query);

    expect(parsed.location).toBe('Paris');
    expect(parsed.types).toContain('Room');
    expect(parsed.guests).toBe(3);
    expect(parsed.minRating).toBe(4.5);
  });
});
