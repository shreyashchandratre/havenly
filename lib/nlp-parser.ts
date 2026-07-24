export interface ParsedFilters {
  location?: string;
  maxPrice?: number;
  minRating?: number;
  types?: string[]; // 'Entire Place', 'Room', 'Shared Room'
  amenities?: string[];
  guests?: number;
  bedrooms?: number;
}

const CITIES = [
  'malibu',
  'aspen',
  'new york',
  'tuscany',
  'varanasi',
  'paris',
  'bali',
  'berlin',
  'tokyo',
  'kyoto',
  'reykjavik',
  'rome',
  'sydney'
];

const AMENITIES_MAP: Record<string, string[]> = {
  wifi: ['wifi', 'wi-fi', 'internet', 'web'],
  kitchen: ['kitchen', 'cook', 'cooking', 'kitchenette'],
  ac: ['ac', 'air conditioning', 'air-conditioning', 'cooler', 'cooling'],
  pool: ['pool', 'swimming pool', 'swim', 'jacuzzi'],
  parking: ['parking', 'garage', 'free parking', 'car park'],
  washer: ['washer', 'washing machine', 'laundry'],
  dryer: ['dryer', 'dry'],
  heating: ['heating', 'fireplace', 'warm', 'heater'],
  tv: ['tv', 'television', 'cable'],
  workspace: ['workspace', 'desk', 'office', 'working space'],
  pets: ['pet-friendly', 'pets allowed', 'pets', 'dog', 'cat', 'animal', 'pet friendly'],
  garden: ['garden', 'backyard', 'yard', 'patio']
};

const TYPES_MAP: Record<string, string[]> = {
  'Entire Place': ['apartment', 'villa', 'house', 'loft', 'cabin', 'cottage', 'entire place', 'entire home'],
  'Room': ['private room', 'single room', 'room', 'bedroom'],
  'Shared Room': ['shared room', 'shared', 'dorm', 'hostel']
};

export function parseSearchQuery(query: string): ParsedFilters {
  const filters: ParsedFilters = {};
  const cleanQuery = query.toLowerCase().trim();

  if (!cleanQuery) return filters;

  // 1. Extract Price (e.g. under $1200, below 300, max 500, up to 1000)
  const priceRegexes = [
    /(?:under|below|less\s+than|max|maximum|up\s+to|limit)\s*[\$]?\s*(\d+)/i,
    /[\$]\s*(\d+)/i
  ];
  for (const regex of priceRegexes) {
    const match = cleanQuery.match(regex);
    if (match && match[1]) {
      filters.maxPrice = parseInt(match[1], 10);
      break;
    }
  }

  // 2. Extract Rating (e.g. 4.5 stars, above 4 stars, 4+ rating, rating above 4.5)
  const ratingRegexes = [
    /(?:rating\s+(?:above|of|over|min|minimum)|above|min|minimum)\s*(\d+(?:\.\d+)?)/i,
    /(\d+(?:\.\d+)?)\s*(?:\+?\s*stars?|\+?\s*rating)/i
  ];
  for (const regex of ratingRegexes) {
    const match = cleanQuery.match(regex);
    if (match && match[1]) {
      filters.minRating = parseFloat(match[1]);
      break;
    }
  }

  // 3. Extract Location (known cities)
  for (const city of CITIES) {
    if (cleanQuery.includes(city)) {
      filters.location = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  // Fallback location detection for words following prepositions like "in", "near", "close to"
  if (!filters.location) {
    const locationRegex = /(?:in|near|close\s+to|around|at)\s+([a-zA-Z\s]+?)(?:\s+(?:under|with|for|below|above|rating|wifi|pool|parking|apartment|villa|room|loft)|\.|$)/i;
    const locMatch = query.match(locationRegex); // check original casing
    if (locMatch && locMatch[1]) {
      const candidate = locMatch[1].trim();
      // Capitalize first letter of candidate location words
      filters.location = candidate
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
  }

  // 4. Extract Guests
  const guestRegex = /(\d+)\s*(?:guest|people|person|sleeper|adult)/i;
  const guestMatch = cleanQuery.match(guestRegex);
  if (guestMatch && guestMatch[1]) {
    filters.guests = parseInt(guestMatch[1], 10);
  } else if (cleanQuery.includes('couple') || cleanQuery.includes('two people') || cleanQuery.includes('2 people')) {
    filters.guests = 2;
  } else if (cleanQuery.includes('solo') || cleanQuery.includes('single person')) {
    filters.guests = 1;
  }

  // 5. Extract Bedrooms/BHK
  const bedroomRegex = /(\d+)\s*(?:bedroom|bhk|bed\s+room)/i;
  const bedMatch = cleanQuery.match(bedroomRegex);
  if (bedMatch && bedMatch[1]) {
    filters.bedrooms = parseInt(bedMatch[1], 10);
  }

  // 6. Extract Amenities
  const amenitiesList: string[] = [];
  for (const [key, synonyms] of Object.entries(AMENITIES_MAP)) {
    for (const synonym of synonyms) {
      const isMatch = cleanQuery.includes(synonym);
      if (isMatch) {
        amenitiesList.push(key);
        break;
      }
    }
  }
  if (amenitiesList.length > 0) {
    filters.amenities = amenitiesList;
  }

  // 7. Extract Types
  const typesList: string[] = [];
  for (const [key, synonyms] of Object.entries(TYPES_MAP)) {
    for (const synonym of synonyms) {
      if (cleanQuery.includes(synonym)) {
        typesList.push(key);
        break;
      }
    }
  }
  if (typesList.length > 0) {
    filters.types = typesList;
  }

  return filters;
}
