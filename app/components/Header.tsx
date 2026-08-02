"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import SearchBar from "./SearchBar";

const categories = [
  { label: "Rally legends", carType: "RALLY" },
  { label: "Track icons", carType: "TRACK" },
  { label: "Civil classics", carType: "CIVIL" },
  { label: "Touge beasts", carType: "TOUGE" },
] as const;

type HeaderProps = {
  authSection: ReactNode;
};

export default function Header({ authSection }: HeaderProps) {
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/92 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 md:gap-6">
          <a
            href="/"
            className="group inline-flex shrink-0 items-center gap-3"
            aria-label="NIGHTRUN home"
          >
            <span className="relative inline-flex items-center text-sm font-black uppercase tracking-[0.14em] text-zinc-50 transition duration-200 sm:text-base md:text-lg group-hover:text-white">
              <span className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-red-500/0 via-red-500/70 to-red-500/0 opacity-70 transition duration-200 group-hover:opacity-100" />
              NIGHT RUN
            </span>
          </a>

          <SearchBar />

          <nav aria-label="Categories" className="hidden shrink-0 items-center gap-2 xl:flex">
            {categories.map((category) => (
              <Link
                key={category.carType}
                href={`/cars?carType=${category.carType}`}
                className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-zinc-400 transition duration-200 hover:border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100"
              >
                {category.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            {authSection}
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-200 transition duration-200 hover:border-zinc-700 hover:bg-zinc-800 sm:hidden"
            aria-label="Toggle categories"
            aria-expanded={mobileCategoriesOpen}
            onClick={() => setMobileCategoriesOpen((current) => !current)}
          >
            <span className="flex flex-col gap-1.5">
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
        </div>

        <div
          className={`mt-4 sm:hidden ${mobileCategoriesOpen ? "block" : "hidden"}`}
        >
          <nav
            aria-label="Categories mobile"
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((category) => (
              <Link
                key={category.carType}
                href={`/cars?carType=${category.carType}`}
                className="shrink-0 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition duration-200 hover:border-red-500/40 hover:text-white"
              >
                {category.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}