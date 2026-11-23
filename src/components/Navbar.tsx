import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { CitizenUser, PageId } from '../types/jandrishti';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  loggedInUser: CitizenUser | null;
}

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'representatives', label: 'Representatives' },
  { id: 'works', label: 'Development Works' },
  { id: 'schemes', label: 'Government Schemes' },
  { id: 'map', label: 'Area Map' },
  { id: 'services', label: 'Citizen Services' },
  { id: 'about', label: 'About' },
];

export default function Navbar({
  currentPage,
  onNavigate,
  loggedInUser,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (id: PageId) => {
    onNavigate(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single line, clean civic emblem) */}
        <button
          type="button"
          onClick={() => handleSelect('home')}
          className="inline-flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087E8B] rounded-md cursor-pointer"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect width="32" height="32" rx="8" fill="#102A43" />
            <path
              d="M6.5 16C9.2 11.4 12.6 9.5 16 9.5C19.4 9.5 22.8 11.4 25.5 16C22.8 20.6 19.4 22.5 16 22.5C12.6 22.5 9.2 20.6 6.5 16Z"
              stroke="#FFFFFF"
              strokeWidth="1.8"
            />
            <circle cx="16" cy="16" r="3.4" fill="#E5A93D" />
            <circle cx="16" cy="16" r="1.4" fill="#102A43" />
          </svg>
          <span className="font-display text-lg font-bold tracking-tight text-[#102A43]">
            JanDrishti
          </span>
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-5 xl:gap-6"
        >
          {NAV_ITEMS.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087E8B] ${
                  active
                    ? 'text-[#087E8B] font-semibold'
                    : 'text-[#334E68] hover:text-[#102A43]'
                }`}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[17px] h-0.5 bg-[#087E8B]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {loggedInUser ? (
            <button
              type="button"
              onClick={() => handleSelect('dashboard')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087E8B] ${
                currentPage === 'dashboard'
                  ? 'bg-[#087E8B] text-white'
                  : 'bg-[#102A43] text-white hover:bg-[#1D3E5E]'
              }`}
            >
              Citizen Dashboard
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSelect('login')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#087E8B] hover:bg-[#06636E] rounded-lg whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#102A43]"
            >
              Login
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden p-2 rounded-lg text-[#102A43] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#087E8B]/10 text-[#087E8B] font-semibold'
                    : 'text-[#334E68] hover:bg-slate-50 hover:text-[#102A43]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
