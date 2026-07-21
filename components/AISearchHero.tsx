'use client';

import { useState, useEffect } from 'react';
import { Search, Sparkles, X, Edit2, Check, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseSearchQuery, ParsedFilters } from '@/lib/nlp-parser';

interface AISearchHeroProps {
  onFiltersChange: (filters: ParsedFilters) => void;
  onClear: () => void;
}

const SUGGESTIONS = [
  'Show me a pet-friendly apartment under $1200 near Malibu',
  'Find a villa with a swimming pool and free parking',
  '2 BHK apartment with Wi-Fi close to Varanasi',
  'Private room in Paris for 3 guests with rating above 4.5'
];

export function AISearchHero({ onFiltersChange, onClear }: AISearchHeroProps) {
  const [query, setQuery] = useState('');
  const [parsedFilters, setParsedFilters] = useState<ParsedFilters | null>(null);
  const [editingKey, setEditingKey] = useState<keyof ParsedFilters | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const parsed = parseSearchQuery(query);
    setParsedFilters(parsed);
    onFiltersChange(parsed);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    const parsed = parseSearchQuery(suggestion);
    setParsedFilters(parsed);
    onFiltersChange(parsed);
  };

  const handleRemoveFilter = (key: keyof ParsedFilters) => {
    if (!parsedFilters) return;
    const updated = { ...parsedFilters };
    delete updated[key];
    
    const hasRemaining = Object.keys(updated).length > 0;
    const finalFilters = hasRemaining ? updated : null;
    
    setParsedFilters(finalFilters);
    if (finalFilters) {
      onFiltersChange(finalFilters);
    } else {
      onClear();
    }
  };

  const handleStartEdit = (key: keyof ParsedFilters) => {
    if (!parsedFilters) return;
    setEditingKey(key);
    
    const value = parsedFilters[key];
    if (Array.isArray(value)) {
      setEditValue(value.join(', '));
    } else if (value !== undefined) {
      setEditValue(String(value));
    } else {
      setEditValue('');
    }
  };

  const handleSaveEdit = () => {
    if (!parsedFilters || !editingKey) return;
    const updated = { ...parsedFilters };

    if (editingKey === 'amenities' || editingKey === 'types') {
      updated[editingKey] = editValue.split(',').map(s => s.trim()).filter(Boolean);
    } else if (editingKey === 'maxPrice' || editingKey === 'guests' || editingKey === 'bedrooms') {
      const val = parseInt(editValue, 10);
      if (!isNaN(val)) {
        updated[editingKey] = val;
      } else {
        delete updated[editingKey];
      }
    } else if (editingKey === 'minRating') {
      const val = parseFloat(editValue);
      if (!isNaN(val)) {
        updated[editingKey] = val;
      } else {
        delete updated[editingKey];
      }
    } else if (editingKey === 'location') {
      if (editValue.trim()) {
        updated[editingKey] = editValue.trim();
      } else {
        delete updated[editingKey];
      }
    }

    setParsedFilters(updated);
    onFiltersChange(updated);
    setEditingKey(null);
    setEditValue('');
  };

  const handleReset = () => {
    setQuery('');
    setParsedFilters(null);
    setEditingKey(null);
    onClear();
  };

  const renderBadgeValue = (key: keyof ParsedFilters, val: any) => {
    if (Array.isArray(val)) {
      return val.join(', ');
    }
    if (key === 'maxPrice') return `$${val}`;
    if (key === 'minRating') return `${val} ★`;
    return String(val);
  };

  const formatKeyName = (key: string) => {
    if (key === 'maxPrice') return 'Max Price';
    if (key === 'minRating') return 'Min Rating';
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-zinc-950 px-6 py-12 md:py-16 text-white shadow-2xl mb-8 border border-white/10">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-300 via-neutral-300 to-zinc-300 pointer-events-none"></div>
      
      <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center">
        {/* Floating AI badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-primary tracking-wider uppercase mb-6 animate-pulse">
          <Sparkles size={13} className="text-primary" />
          AI Powered Search
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-rose-100 to-rose-300 mb-4">
          Where is your next escape?
        </h1>
        <p className="text-slate-300 text-sm md:text-base max-w-lg mb-8">
          Type your requirements naturally. Tell us about your budget, preferred city, amenities, or room count.
        </p>

        {/* Input Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full flex items-center bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20 shadow-lg focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
          <Sparkles className="text-primary ml-3 shrink-0" size={20} />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. A pet-friendly villa with a pool in Malibu under $600"
            className="flex-1 bg-transparent border-0 text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-base py-6 px-3"
          />
          {query && (
            <button 
              type="button" 
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition mr-1"
            >
              <X size={18} />
            </button>
          )}
          <Button 
            type="submit"
            className="rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 px-6 shadow-md transition-transform active:scale-[0.98]"
          >
            <Search size={18} className="mr-2" />
            Search
          </Button>
        </form>

        {/* Suggested Queries */}
        {!parsedFilters && (
          <div className="w-full mt-6 text-left">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 text-center md:text-left">
              Try asking:
            </span>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1.5 transition-all text-slate-300 hover:text-white"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Parsed / Extracted Filters Display */}
        {parsedFilters && (
          <div className="w-full mt-8 bg-white/5 border border-white/10 rounded-2xl p-5 text-left animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <span className="text-sm font-semibold text-slate-200">Extracted Search Filters</span>
              </div>
              <button 
                type="button" 
                onClick={handleReset} 
                className="text-xs text-primary hover:text-rose-300 hover:underline"
              >
                Reset Search
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {Object.entries(parsedFilters).map(([key, val]) => {
                const isEditing = editingKey === key;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-rose-100 rounded-lg px-3 py-1.5 text-xs hover:border-primary/45 transition-colors group"
                  >
                    <span className="font-semibold text-primary">{formatKeyName(key)}:</span>
                    
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="bg-slate-900 border border-primary/40 rounded px-1.5 py-0.5 text-xs text-white max-w-[120px] focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') setEditingKey(null);
                          }}
                        />
                        <button onClick={handleSaveEdit} className="p-0.5 bg-primary rounded text-white hover:bg-primary/90">
                          <Check size={12} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="max-w-[150px] truncate">{renderBadgeValue(key as keyof ParsedFilters, val)}</span>
                        <button 
                          onClick={() => handleStartEdit(key as keyof ParsedFilters)}
                          className="text-primary hover:text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                          title="Edit filter value"
                        >
                          <Edit2 size={11} />
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => handleRemoveFilter(key as keyof ParsedFilters)}
                      className="text-primary hover:text-red-400 hover:bg-red-500/10 rounded p-0.5 ml-1 transition"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
            
            <p className="text-[11px] text-slate-400 mt-4 flex items-center gap-1">
              <HelpCircle size={12} />
              Hover over a badge to edit its value directly. Click X to remove it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
