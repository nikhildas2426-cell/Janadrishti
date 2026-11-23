import React from 'react';
import { Eye, FileSpreadsheet, Scale, Users } from 'lucide-react';
import { PageId } from '../types/jandrishti';
import { DemoDataBanner } from './CivicElements';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Mission Hero */}
      <section className="bg-[#102A43] text-white rounded-2xl p-8 sm:p-12">
        <p className="text-xs font-semibold text-[#E5A93D] tracking-wide mb-3">
          About JanDrishti · Your Area. Your Money. Your Right to Know.
        </p>
        <h1
          className="font-display text-3xl sm:text-4xl font-bold leading-tight max-w-3xl mb-5"
          style={{ textWrap: 'balance' }}
        >
          Bringing Public Infrastructure, Budgets, and Governance Within Every
          Citizen&apos;s Reach.
        </h1>
        <p className="text-base sm:text-lg text-slate-200 max-w-3xl leading-relaxed">
          JanDrishti aims to make government development activities, public
          expenditure, government schemes, and public representatives easier for
          citizens to understand and access.
        </p>
      </section>

      <DemoDataBanner context="JanDrishti is a civic-tech frontend prototype demonstrating public data design across 6 Karnataka cities (Mangaluru, Bengaluru, Mysuru, Udupi, Shivamogga, and Kalaburagi)." />

      {/* Three Key Objectives */}
      <section>
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-[#102A43]">
            Three Core Civic Objectives
          </h2>
          <p className="text-sm text-[#486581] mt-1">
            Designed to turn scattered departmental PDFs and portals into clear,
            location-based public insight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#087E8B]/12 text-[#087E8B] flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#102A43]">
              Government Transparency
            </h3>
            <p className="text-sm text-[#334E68] leading-relaxed">
              Present sanctioned funds, released tranches, recorded expenditure,
              project timelines, and source work orders in plain, verifiable figures
              organized by constituency and ward.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#E5A93D]/20 text-[#9A6B16] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#102A43]">
              Citizen Awareness
            </h3>
            <p className="text-sm text-[#334E68] leading-relaxed">
              Help residents discover Central, State, and District-level welfare
              schemes with transparent eligibility checks, required document checklists,
              and honest status clarity.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#27966D]/15 text-[#27966D] flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#102A43]">
              Public Accountability
            </h3>
            <p className="text-sm text-[#334E68] leading-relaxed">
              Map every public work to the responsible department, government officer,
              and elected representative—from Gram Panchayat PDOs to Members of
              Parliament.
            </p>
          </div>
        </div>
      </section>

      {/* Prototype Scope & Navigation */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#087E8B]">
            <Users className="w-4 h-4" />
            <span>Explore the Platform</span>
          </div>
          <h2 className="font-display text-xl font-bold text-[#102A43]">
            Inspect Works, Schemes, and Representatives in Your Sample Area
          </h2>
          <p className="text-sm text-[#334E68] leading-relaxed">
            Jump into the interactive constituency map or browse local development
            projects and representative profiles.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('map')}
            className="px-4 py-2.5 bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Open Area Map
          </button>
          <button
            type="button"
            onClick={() => onNavigate('works')}
            className="px-4 py-2.5 bg-[#102A43] hover:bg-[#1D3E5E] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Browse Development Works
          </button>
        </div>
      </section>
    </div>
  );
}
