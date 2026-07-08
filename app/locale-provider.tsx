'use client';

import { LocaleProvider } from '@/lib/use-locale';

export function AppLocaleProvider({ children }: { children: React.ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}

