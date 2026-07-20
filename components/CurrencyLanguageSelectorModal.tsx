'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import type { CurrencyCode, LanguageCode } from '@/lib/locale-currency';
import { getCurrencyLabel, getLanguageLabel } from '@/lib/locale-currency';
import { useLocale } from '@/lib/use-locale';

const LANGUAGES: LanguageCode[] = ['en-IN', 'en-US'];
const CURRENCIES: CurrencyCode[] = ['INR', 'USD', 'EUR'];

export function CurrencyLanguageSelectorModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { settings, setCurrency, setLanguage } = useLocale();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Select language & currency</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <div className="text-sm font-semibold text-foreground mb-3">Language</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LANGUAGES.map((lang) => {
                const active = settings.language === lang;
                return (
                  <Button
                    key={lang}
                    type="button"
                    variant={active ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setLanguage(lang)}
                  >
                    {getLanguageLabel(lang)}
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          <div>
            <div className="text-sm font-semibold text-foreground mb-3">Currency</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {CURRENCIES.map((currency) => {
                const active = settings.currency === currency;
                return (
                  <Button
                    key={currency}
                    type="button"
                    variant={active ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setCurrency(currency)}
                  >
                    {getCurrencyLabel(currency)}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

