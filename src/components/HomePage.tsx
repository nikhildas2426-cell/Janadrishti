import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Compass,
  IndianRupee,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  CONSTITUENCIES,
  DEVELOPMENT_PROJECTS,
  GOVERNMENT_SCHEMES,
  PROJECT_IMAGES,
} from '../data/karnatakaData';
import { ConstituencyId, PageId } from '../types/jandrishti';
import {
  DemoDataBanner,
  ResilientPhoto,
  SchemeStatusText,
} from './CivicElements';

interface HomePageProps {
  selectedConstituency: ConstituencyId;
  onSelectConstituency: (id: ConstituencyId) => void;
  onNavigate: (page: PageId) => void;
  onOpenSchemeEligibility: (schemeId: string) => void;
  onOpenProject: (projectId: string) => void;
}

export default function HomePage({
  selectedConstituency,
  onSelectConstituency,
  onNavigate,
  onOpenSchemeEligibility,
  onOpenProject,
}: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const stats = useMemo(() => {
    const totalProjects = DEVELOPMENT_PROJECTS.length;
    const totalSanctioned = DEVELOPMENT_PROJECTS.reduce(
      (sum, p) => sum + p.sanctionedAmountCr,
      0
    );
    const completed = DEVELOPMENT_PROJECTS.filter((p) => p.status === 'Completed').length;
    const ongoing = DEVELOPMENT_PROJECTS.filter(
      (p) => p.status === 'In Progress' || p.status === 'Delayed'
    ).length;
    return {
      totalProjects,
      totalSanctioned: totalSanctioned.toFixed(2),
      completed,
      ongoing,
    };
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { constituencies: [], projects: [] };

    const constituencies = CONSTITUENCIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.constituencyName.toLowerCase().includes(q) ||
        c.pinCodes.some((p) => p.includes(q)) ||
        c.localities.some((l) => l.toLowerCase().includes(q))
    );

    const projects = DEVELOPMENT_PROJECTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 4);

    return { constituencies, projects };
  }, [searchQuery]);

  const popularSchemes = useMemo(
    () => GOVERNMENT_SCHEMES.slice(0, 4),
    []
  );

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.constituencies.length > 0) {
      onSelectConstituency(searchResults.constituencies[0].id);
      onNavigate('map');
    } else if (searchResults.projects.length > 0) {
      onOpenProject(searchResults.projects[0].id);
    } else {
      onNavigate('works');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[#102A43] text-white overflow-hidden">
        <div className="absolute inset-0">
          <ResilientPhoto
            src={PROJECT_IMAGES.hero}
            alt="Modern Indian civic infrastructure, elevated transit corridor, and green median in Karnataka"
            className="w-full h-full object-cover object-center opacity-45"
            fallbackTitle="Indian Civic Infrastructure"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#102A43]/95 via-[#102A43]/85 to-[#102A43]/60"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#E5A93D] tracking-wide mb-3">
              JanDrishti · Your Area. Your Money. Your Right to Know.
            </p>
            <h1
              className="font-display font-bold tracking-tight text-white leading-[1.12] mb-5"
              style={{ fontSize: 'clamp(2.25rem, 4vw, 3.65rem)', textWrap: 'balance' }}
            >
              Know What&apos;s Happening in Your Constituency.
            </h1>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl mb-8">
              Track public development works, sanctioned budgets, eligible government
              schemes, and the elected representatives and civic officers accountable
              for your ward and taluk.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleQuickSearchSubmit}
              className="relative max-w-2xl mb-6"
            >
              <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-xl shadow-lg border border-slate-200">
                <div className="relative flex-1 flex items-center">
                  <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by PIN code, village, town, district, or constituency (e.g. 575001, Kadri, Mysuru)"
                    aria-label="Search by PIN code, village, town, district, or constituency"
                    className="w-full px-3 py-2.5 text-sm text-[#102A43] placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#087E8B] hover:bg-[#06636E] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Search Area
                </button>
              </div>

              {/* Live Dropdown Results */}
              {searchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white text-[#102A43] rounded-xl border border-slate-200 shadow-xl z-30 overflow-hidden">
                  {searchResults.constituencies.length === 0 &&
                  searchResults.projects.length === 0 ? (
                    <div className="px-4 py-4 text-sm text-slate-500">
                      No matching Karnataka sample area found. Try Mangaluru, Bengaluru,
                      Mysuru, Udupi, Shivamogga, Kalaburagi, or PIN 575001.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {searchResults.constituencies.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onMouseDown={() => {
                            onSelectConstituency(c.id);
                            onNavigate('map');
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-[#F4F8FA] flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#102A43]">
                              {c.name} — {c.constituencyName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {c.district} District · PINs: {c.pinCodes.slice(0, 3).join(', ')}
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-[#087E8B] whitespace-nowrap">
                            Open Area Map →
                          </span>
                        </button>
                      ))}
                      {searchResults.projects.map((proj) => (
                        <button
                          key={proj.id}
                          type="button"
                          onMouseDown={() => onOpenProject(proj.id)}
                          className="w-full px-4 py-3 text-left hover:bg-[#F4F8FA] flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <div>
                            <p className="text-sm font-medium text-[#102A43]">{proj.name}</p>
                            <p className="text-xs text-slate-500">
                              {proj.location} · ₹{proj.sanctionedAmountCr.toFixed(2)} Cr
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-[#102A43] whitespace-nowrap">
                            View Project →
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </form>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('map')}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#E5A93D] hover:bg-[#D4972C] text-[#102A43] text-sm font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Your Area</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('schemes')}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/25 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>View Government Schemes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Statistics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
              <span>Total Development Projects</span>
              <Building2 className="w-4 h-4 text-[#087E8B]" />
            </div>
            <p className="font-display text-3xl font-bold text-[#102A43] tabular-nums">
              {stats.totalProjects}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Across 6 Karnataka sample constituencies
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
              <span>Total Funds Sanctioned</span>
              <IndianRupee className="w-4 h-4 text-[#E5A93D]" />
            </div>
            <p className="font-display text-3xl font-bold text-[#102A43] tabular-nums">
              ₹{stats.totalSanctioned} Cr
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Demo capital works allocation
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
              <span>Completed Projects</span>
              <CheckCircle2 className="w-4 h-4 text-[#27966D]" />
            </div>
            <p className="font-display text-3xl font-bold text-[#27966D] tabular-nums">
              {stats.completed}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Handed over with sample audit records
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
              <span>Ongoing Projects</span>
              <MapPin className="w-4 h-4 text-[#087E8B]" />
            </div>
            <p className="font-display text-3xl font-bold text-[#087E8B] tabular-nums">
              {stats.ongoing}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Active execution & monitoring
            </p>
          </div>
        </div>
      </section>

      {/* Demo Data Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <DemoDataBanner />
      </div>

      {/* Quick Constituency Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#102A43]">
              Explore Karnataka Sample Constituencies
            </h2>
            <p className="text-sm text-[#486581] mt-1">
              Select a city or district to inspect local works, representatives, and area map.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('representatives')}
            className="text-sm font-semibold text-[#087E8B] hover:text-[#06636E] inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Know Your Representatives</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONSTITUENCIES.map((area) => {
            const areaProjects = DEVELOPMENT_PROJECTS.filter(
              (p) => p.constituencyId === area.id
            );
            const areaFunds = areaProjects
              .reduce((s, p) => s + p.sanctionedAmountCr, 0)
              .toFixed(1);
            const isSelected = selectedConstituency === area.id;

            return (
              <div
                key={area.id}
                className={`bg-white rounded-xl border p-5 transition-all duration-150 ${
                  isSelected
                    ? 'border-[#087E8B] ring-1 ring-[#087E8B]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#102A43]">
                      {area.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {area.district} District · {area.wardsCount} Wards
                    </p>
                  </div>
                  <span className="font-mono text-xs font-medium text-[#087E8B] tabular-nums">
                    PIN {area.pinCodes[0]}
                  </span>
                </div>
                <p className="text-sm text-[#334E68] leading-relaxed mb-4 line-clamp-2">
                  {area.summary}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-600 tabular-nums">
                    {areaProjects.length} Projects · ₹{areaFunds} Cr
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectConstituency(area.id);
                      onNavigate('map');
                    }}
                    className="font-semibold text-[#087E8B] hover:text-[#06636E] cursor-pointer"
                  >
                    Open Area →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Government Schemes Section */}
      <section className="bg-white border-y border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#102A43]">
                Popular Government Schemes
              </h2>
              <p className="text-sm text-[#486581] mt-1">
                Browse welfare, scholarship, farmer, and health programs with transparent eligibility checks (Demo Data).
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('schemes')}
              className="px-4 py-2 bg-[#102A43] hover:bg-[#1D3E5E] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Browse All 10 Schemes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {popularSchemes.map((scheme) => (
              <article
                key={scheme.id}
                className="bg-[#F4F8FA] rounded-xl border border-slate-200 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                    <span>
                      {scheme.level} · {scheme.category}
                    </span>
                    <SchemeStatusText status={scheme.applicationStatus} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#102A43] mb-2">
                    {scheme.name}
                  </h3>
                  <p className="text-sm text-[#334E68] leading-relaxed mb-4">
                    {scheme.briefDescription}
                  </p>
                  <p className="text-xs text-[#102A43] font-medium mb-4">
                    Benefit: <span className="font-normal text-[#334E68]">{scheme.benefitsProvided}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200/80">
                  <span className="text-xs text-slate-500">
                    Deadline: {scheme.deadline}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenSchemeEligibility(scheme.id)}
                      className="px-3.5 py-1.5 bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Check Eligibility
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How JanDrishti Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-2xl mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#102A43]">
            How JanDrishti Works
          </h2>
          <p className="text-sm text-[#486581] mt-2 leading-relaxed">
            Public expenditure and local governance records are structured into four
            simple citizen workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              num: '01.',
              title: 'Locate Your Constituency',
              desc: 'Search by PIN code, ward, town, or district to switch directly to your local area view.',
              action: 'Open Area Map',
              page: 'map' as PageId,
            },
            {
              num: '02.',
              title: 'Audit Works & Funds',
              desc: 'Compare sanctioned budgets, released funds, recorded expenditure, timelines, and source orders.',
              action: 'Explore Works',
              page: 'works' as PageId,
            },
            {
              num: '03.',
              title: 'Identify Accountability',
              desc: 'See both elected representatives and assigned government officers responsible for your ward.',
              action: 'View Directory',
              page: 'representatives' as PageId,
            },
            {
              num: '04.',
              title: 'Participate & Check Schemes',
              desc: 'Test welfare scheme eligibility and log incomplete civic infrastructure observations with photos.',
              action: 'Citizen Services',
              page: 'services' as PageId,
            },
          ].map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between"
            >
              <div>
                <p className="font-mono text-sm font-semibold text-[#087E8B] mb-2">
                  {step.num}
                </p>
                <h3 className="font-display text-lg font-bold text-[#102A43] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#334E68] leading-relaxed mb-5">
                  {step.desc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(step.page)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#102A43] hover:text-[#087E8B] transition-colors cursor-pointer"
              >
                <span>{step.action}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Citizen CTA Strip */}
        <div className="mt-10 bg-[#102A43] rounded-xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-[#087E8B]/30 text-[#E5A93D] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">
                Try the Personalized Citizen Dashboard
              </h3>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                Sign in with our fictional demo citizen account to view your constituency&apos;s
                MLA, MP, recent project updates, and submitted civic reports.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="px-5 py-2.5 bg-[#E5A93D] hover:bg-[#D4972C] text-[#102A43] text-sm font-bold rounded-lg whitespace-nowrap shrink-0 cursor-pointer transition-colors"
          >
            Open Citizen Login
          </button>
        </div>
      </section>
    </div>
  );
}
