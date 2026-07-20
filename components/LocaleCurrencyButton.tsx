'use client';

import { useState } from 'react';
import { Globe, Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/use-locale';
import { getCurrencyLabel, getLanguageLabel } from '@/lib/locale-currency';
import { CurrencyLanguageSelectorModal } from '@/components/CurrencyLanguageSelectorModal';

export function LocaleCurrencyButton() {
  const [open, setOpen] = useState(false);
  const { settings } = useLocale();

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="h-auto p-0 text-sm font-semibold text-foreground cursor-pointer flex items-center gap-4"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-2 hover:underline">
          <Globe size={16} />
          {getLanguageLabel(settings.language)}
        </span>
        <span className="hover:underline flex items-center gap-2">
          <Wallet size={16} />
          {getCurrencyLabel(settings.currency)}
        </span>
      </Button>

      <CurrencyLanguageSelectorModal open={open} onOpenChange={setOpen} />
    </>
  );
}

