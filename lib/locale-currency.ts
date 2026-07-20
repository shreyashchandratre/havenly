export type LanguageCode = 'en-IN' | 'en-US';
export type CurrencyCode = 'INR' | 'USD' | 'EUR';

export type LocaleSettings = {
  language: LanguageCode;
  currency: CurrencyCode;
};

// Demo conversion rates relative to INR.
// 1 INR = INRate
// These are static because this is a UI demo (no live FX API).
const INTRARATES_TO_INR: Record<CurrencyCode, number> = {
  INR: 1,
  USD: 1 / 83, // ~₹83 per $1
  EUR: 1 / 90, // ~₹90 per €1
};

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
};

const LOCALE_BY_LANGUAGE: Record<LanguageCode, string> = {
  'en-IN': 'en-IN',
  'en-US': 'en-US',
};

export function convertPrice(amountInINR: number, to: CurrencyCode): number {
  const rateToINR = INTRARATES_TO_INR[to];
  // If amount is in INR, convert by dividing INR amount into target currency.
  // Example: amountInINR=830, to=USD, rateToINR=1/83 => 830 * (1/83)=10 USD
  return amountInINR * rateToINR;
}

export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  locale: string
): string {
  // Use native Intl when available for best formatting.
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Fallback formatter
    const symbol = CURRENCY_SYMBOLS[currency];
    const rounded = Math.round(amount);
    return `${symbol}${rounded.toLocaleString()}`;
  }
}

export function getLocaleForLanguage(language: LanguageCode): string {
  return LOCALE_BY_LANGUAGE[language];
}

export function getCurrencyLabel(currency: CurrencyCode): string {
  switch (currency) {
    case 'INR':
      return '₹ INR';
    case 'USD':
      return '$ USD';
    case 'EUR':
      return '€ EUR';
    default:
      return currency;
  }
}

export function getLanguageLabel(language: LanguageCode): string {
  switch (language) {
    case 'en-IN':
      return 'English (IN)';
    case 'en-US':
      return 'English (US)';
    default:
      return language;
  }
}

