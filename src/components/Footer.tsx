import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PageId } from '../types/jandrishti';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

type LegalModalType = 'contact' | 'privacy' | 'disclaimer' | null;

export default function Footer({ onNavigate }: FooterProps) {
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  return (
    <>
      <footer className="bg-[#102A43] text-slate-200 border-t border-[#1D3E5E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect width="32" height="32" rx="8" fill="#087E8B" />
                  <path
                    d="M6.5 16C9.2 11.4 12.6 9.5 16 9.5C19.4 9.5 22.8 11.4 25.5 16C22.8 20.6 19.4 22.5 16 22.5C12.6 22.5 9.2 20.6 6.5 16Z"
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                  />
                  <circle cx="16" cy="16" r="3.4" fill="#E5A93D" />
                </svg>
                <span className="font-display text-lg font-bold text-white">
                  JanDrishti
                </span>
              </div>
              <p className="text-sm font-medium text-[#E5A93D]">
                Your Area. Your Money. Your Right to Know.
              </p>
              <p className="text-sm text-slate-300 max-w-md leading-relaxed">
                A civic transparency prototype enabling citizens to explore local
                development works, public expenditure, welfare schemes, and
                constituency representatives across Karnataka.
              </p>
            </div>

            <div>
              <h3 className="font-display text-sm font-semibold text-white mb-3">
                Platform Sections
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('works')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Development Works
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('schemes')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Government Schemes
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('representatives')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Know Your Representatives
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('map')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Constituency Map
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('services')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Citizen Services
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-sm font-semibold text-white mb-3">
                Information & Governance
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('about')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setContactSubmitted(false);
                      setLegalModal('contact');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setLegalModal('privacy')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setLegalModal('disclaimer')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Disclaimer
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
            <p>
              © 2026 JanDrishti Civic Transparency Prototype. Demo Data – Not Official Government Information.
            </p>
            <p>Karnataka Sample Constituencies: Mangaluru · Bengaluru · Mysuru · Udupi · Shivamogga · Kalaburagi</p>
          </div>
        </div>
      </footer>

      {legalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl max-w-lg w-full p-6 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-[#102A43]">
                {legalModal === 'contact' && 'Contact JanDrishti Prototype Team'}
                {legalModal === 'privacy' && 'Privacy Policy (Prototype Notice)'}
                {legalModal === 'disclaimer' && 'Public Data & Prototype Disclaimer'}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                aria-label="Close dialog"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {legalModal === 'contact' && (
              <div className="space-y-4 text-sm text-[#334E68]">
                <p>
                  For feedback on this civic-transparency interface demonstration, submit a
                  sample inquiry below or reach our prototype desk at{' '}
                  <span className="font-medium text-[#102A43]">civicdesk.demo@example.org</span>.
                </p>
                {contactSubmitted ? (
                  <div className="p-4 rounded-lg bg-[#27966D]/10 border border-[#27966D]/20 text-[#102A43]">
                    <p className="font-semibold text-[#27966D]">Message Recorded (Prototype)</p>
                    <p className="text-xs mt-1">
                      Thank you for testing JanDrishti. No external email or backend ticket was created.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSubmitted(true);
                    }}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#087E8B]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#087E8B]"
                    />
                    <textarea
                      rows={3}
                      required
                      placeholder="Feedback or civic transparency suggestion..."
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#087E8B]"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setLegalModal(null)}
                        className="px-4 py-2 text-sm font-medium text-[#334E68] hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-semibold text-white bg-[#087E8B] hover:bg-[#06636E] rounded-lg cursor-pointer"
                      >
                        Send Feedback
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {legalModal === 'privacy' && (
              <div className="space-y-3 text-sm text-[#334E68] leading-relaxed">
                <p>
                  JanDrishti is a frontend-only civic technology prototype. It does not connect
                  to Election Commission databases, government portals, or external authentication
                  servers.
                </p>
                <p>
                  Do not enter real Voter ID numbers, Aadhaar numbers, passwords, or sensitive
                  personal information. Any form inputs or uploaded photos remain solely within
                  your browser session memory and are cleared when the page refreshes.
                </p>
              </div>
            )}

            {legalModal === 'disclaimer' && (
              <div className="space-y-3 text-sm text-[#334E68] leading-relaxed">
                <p>
                  <strong>Demo Data – Not Official Government Information:</strong> All project
                  budgets, completion timelines, representative profiles, officer phone numbers,
                  and scheme rules displayed on JanDrishti are fictional demonstration datasets
                  created to illustrate civic transparency workflows.
                </p>
                <p>
                  Submitting a civic issue report on this platform does not file an official
                  government grievance. Citizens should consult official Karnataka State or Union
                  Government portals for verified scheme deadlines and grievance redressal.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
