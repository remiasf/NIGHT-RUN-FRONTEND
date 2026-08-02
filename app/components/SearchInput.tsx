'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';

type SearchResult = {
  id: string;
  brand: string;
  model: string;
  year: number;
};

type SearchInputProps = {
  variant?: 'default' | 'hero';
  className?: string;
};

const DEBOUNCE_MS = 600;

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={className ?? 'h-4 w-4 shrink-0 text-zinc-500'}
    >
      <path
        d="M17 17l-3.5-3.5m1.5-4A5.5 5.5 0 1110 4a5.5 5.5 0 015.5 5.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SearchInput({ variant = 'default', className = '' }: SearchInputProps) {
  const isHero = variant === 'hero';
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const { data } = await axiosInstance.get<SearchResult[]>('/car/search/live', {
          params: { q: trimmed },
          signal: controller.signal,
        });
        setSuggestions(data);
        setIsOpen(true);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Search suggest error:', error);
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showDropdown = isOpen && query.trim().length > 0;

  return (
    <div
      ref={containerRef}
      className={`relative flex min-w-0 items-center ${
        isHero
          ? 'mx-auto w-full max-w-2xl rounded-2xl shadow-xl shadow-black/50 focus-within:ring-2 focus-within:ring-red-600/50'
          : 'flex-1'
      } ${className}`}
    >
      <div
        className={`pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 ${
          isHero ? 'left-5' : 'left-4'
        }`}
      >
        <SearchIcon className={isHero ? 'h-5 w-5 shrink-0 text-zinc-500' : undefined} />
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          if (event.target.value.trim()) {
            setIsOpen(true);
          } else {
            setIsOpen(false);
          }
        }}
        onFocus={() => {
          if (query.trim() && suggestions.length > 0) {
            setIsOpen(true);
          }
        }}
        placeholder={isHero ? 'Search legendary JDM builds, chassis codes, eras...' : 'Search builds, chassis, eras...'}
        autoComplete="off"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls="search-suggestions"
        aria-autocomplete="list"
        className={
          isHero
            ? 'h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-900/95 pl-14 pr-5 text-base text-zinc-100 outline-none transition duration-200 placeholder:text-zinc-500 hover:border-zinc-700 focus:border-red-600/50'
            : 'h-12 w-full rounded-2xl border border-zinc-800 bg-zinc-900/90 pl-11 pr-4 text-sm text-zinc-100 outline-none transition duration-200 placeholder:text-zinc-500 hover:border-zinc-700 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20'
        }
      />

      {showDropdown && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/95 shadow-xl shadow-black/50 backdrop-blur-xl"
        >
          {isLoading && suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-zinc-500">Searching...</p>
          ) : suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-zinc-500">No matches found</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {suggestions.map((car) => (
                <li key={car.id} role="option">
                  <Link
                    href={`/cars/${car.id}`}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                      setSuggestions([]);
                    }}
                    className="flex items-baseline gap-2 px-4 py-2.5 text-sm transition duration-150 hover:bg-red-950/40 hover:text-red-300"
                  >
                    <span className="font-medium text-zinc-100">
                      {car.brand} {car.model}
                    </span>
                    <span className="text-zinc-500">{car.year}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
