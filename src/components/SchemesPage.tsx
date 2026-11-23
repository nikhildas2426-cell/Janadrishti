import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  Search,
  X,
  XCircle,
} from 'lucide-react';
import { CONSTITUENCIES, GOVERNMENT_SCHEMES } from '../data/karnatakaData';
import {
  ConstituencyId,
  GovernmentScheme,
  SchemeApplicationStatus,
  SchemeCategory,
  SchemeLevel,
} from '../types/jandrishti';
import { DemoDataBanner, SchemeStatusText } from './CivicElements';

const SCHEME_CATEGORIES: ('All' | SchemeCategory)[] = [
  'All',
  'Education and Scholarships',
  'Farmers and Agriculture',
  'Women Empowerment',
  'Employment and Skill Development',
  'Housing',
  'Healthcare',
  'Senior Citizens',
  'Financial Assistance',
  'Small Businesses',
  'Rural Development',
];

const SCHEME_LEVELS: ('All' | SchemeLevel)[] = [
  'All',
  'State Government',
  'Central Government',
  'District-Specific',
];

const SCHEME_STATUSES: ('All' | SchemeApplicationStatus)[] = [
  'All',
  'Open',
  'Closed',
  'Status Unknown',
];

interface SchemesPageProps {
  selectedConstituency: ConstituencyId;
  activeEligibilitySchemeId: string | null;
  onSetEligibilitySchemeId: (id: string | null) => void;
}

export default function SchemesPage({
  selectedConstituency,
  activeEligibilitySchemeId,
  onSetEligibilitySchemeId,
}: SchemesPageProps) {
  const [levelFilter, setLevelFilter] = useState<'All' | SchemeLevel>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | SchemeCategory>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | SchemeApplicationStatus>('All');
  const [areaFilter, setAreaFilter] = useState<'all' | ConstituencyId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailScheme, setDetailScheme] = useState<GovernmentScheme | null>(null);

  // Eligibility checker questionnaire state
  const [ageInput, setAgeInput] = useState('24');
  const [incomeInput, setIncomeInput] = useState('2.0');
  const [occupationInput, setOccupationInput] = useState('Student');
  const [genderInput, setGenderInput] = useState('Female');
  const [residentDistrict, setResidentDistrict] = useState<ConstituencyId>(
    selectedConstituency
  );
  const [checkedResult, setCheckedResult] = useState<{
    eligible: boolean;
    reasons: string[];
  } | null>(null);

  const eligibilityScheme = useMemo(
    () =>
      GOVERNMENT_SCHEMES.find((s) => s.id === activeEligibilitySchemeId) || null,
    [activeEligibilitySchemeId]
  );

  const filteredSchemes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return GOVERNMENT_SCHEMES.filter((scheme) => {
      if (levelFilter !== 'All' && scheme.level !== levelFilter) return false;
      if (categoryFilter !== 'All' && scheme.category !== categoryFilter) return false;
      if (statusFilter !== 'All' && scheme.applicationStatus !== statusFilter)
        return false;
      if (
        areaFilter !== 'all' &&
        scheme.applicableConstituencies !== 'all' &&
        !scheme.applicableConstituencies.includes(areaFilter)
      ) {
        return false;
      }
      if (q) {
        const hay = `${scheme.name} ${scheme.department} ${scheme.category} ${scheme.briefDescription}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [levelFilter, categoryFilter, statusFilter, areaFilter, searchQuery]);

  const handleOpenEligibility = (schemeId: string) => {
    setCheckedResult(null);
    setResidentDistrict(selectedConstituency);
    onSetEligibilitySchemeId(schemeId);
  };

  const evaluateEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eligibilityScheme) return;
    const age = Number(ageInput);
    const income = Number(incomeInput);
    const rules = eligibilityScheme.eligibilityRules;
    const reasons: string[] = [];
    let eligible = true;

    if (
      eligibilityScheme.applicableConstituencies !== 'all' &&
      !eligibilityScheme.applicableConstituencies.includes(residentDistrict)
    ) {
      eligible = false;
      const allowedNames = eligibilityScheme.applicableConstituencies
        .map((id) => CONSTITUENCIES.find((c) => c.id === id)?.name)
        .join(', ');
      reasons.push(
        `District requirement not met: Demo scheme applies to ${allowedNames}.`
      );
    } else {
      reasons.push('Residency / District check passed (Demo).');
    }

    if (rules.minAge !== undefined && age < rules.minAge) {
      eligible = false;
      reasons.push(`Minimum demo age is ${rules.minAge} years (entered ${age}).`);
    } else if (rules.maxAge !== undefined && age > rules.maxAge) {
      eligible = false;
      reasons.push(`Maximum demo age is ${rules.maxAge} years (entered ${age}).`);
    } else if (rules.minAge !== undefined || rules.maxAge !== undefined) {
      reasons.push('Age bracket matches sample criteria.');
    }

    if (rules.maxIncomeLakhs !== undefined && income > rules.maxIncomeLakhs) {
      eligible = false;
      reasons.push(
        `Annual family income exceeds demo limit of ₹${rules.maxIncomeLakhs} Lakh.`
      );
    } else if (rules.maxIncomeLakhs !== undefined) {
      reasons.push(
        `Annual income ₹${income.toFixed(1)}L is within ₹${rules.maxIncomeLakhs}L demo ceiling.`
      );
    }

    if (rules.womenOnly && genderInput !== 'Female') {
      eligible = false;
      reasons.push('This sample program is designated for women applicants.');
    }

    if (
      rules.occupations &&
      rules.occupations.length > 0 &&
      !rules.occupations.includes(occupationInput)
    ) {
      eligible = false;
      reasons.push(
        `Demo target occupation group: ${rules.occupations.join(' or ')}.`
      );
    }

    setCheckedResult({ eligible, reasons });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#102A43]">
            Government Schemes & Citizen Welfare
          </h1>
          <p className="text-sm text-[#486581] mt-1 max-w-2xl">
            Discover state, central, and district-specific welfare programs across 10
            categories with clear application status labels and simulated eligibility checks.
          </p>
        </div>
      </div>

      <DemoDataBanner context="All scheme entries, eligibility thresholds, and deadlines are fictional sample data marked as Demo Data. Application status explicitly distinguishes Open, Closed, and Status Unknown." />

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheme name or dept..."
              aria-label="Search government schemes"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#087E8B]"
            />
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as 'All' | SchemeLevel)}
            aria-label="Filter by government level"
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-[#102A43] focus:outline-none focus:border-[#087E8B]"
          >
            {SCHEME_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl === 'All' ? 'All Levels (State, Central, District)' : `${lvl} Schemes`}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as 'All' | SchemeCategory)}
            aria-label="Filter by scheme category"
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-[#102A43] focus:outline-none focus:border-[#087E8B]"
          >
            {SCHEME_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All 10 Scheme Categories' : cat}
              </option>
            ))}
          </select>

          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value as 'all' | ConstituencyId)}
            aria-label="Filter by district applicability"
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-[#102A43] focus:outline-none focus:border-[#087E8B]"
          >
            <option value="all">All Districts</option>
            {CONSTITUENCIES.map((c) => (
              <option key={c.id} value={c.id}>
                Applicable in {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {SCHEME_STATUSES.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#102A43] text-white'
                    : 'bg-[#F4F8FA] text-[#334E68] hover:text-[#102A43]'
                }`}
              >
                {st === 'All' ? 'All Statuses' : st}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 tabular-nums">
            Showing {filteredSchemes.length} of {GOVERNMENT_SCHEMES.length} sample schemes
          </span>
        </div>
      </div>

      {/* Scheme Cards */}
      {filteredSchemes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <p className="font-display font-semibold text-[#102A43]">
            No schemes match the selected filters
          </p>
          <button
            type="button"
            onClick={() => {
              setLevelFilter('All');
              setCategoryFilter('All');
              setStatusFilter('All');
              setAreaFilter('all');
              setSearchQuery('');
            }}
            className="mt-3 px-4 py-2 bg-[#087E8B] text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Reset Scheme Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSchemes.map((scheme) => (
            <article
              key={scheme.id}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-[#087E8B]/50 transition-colors"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                  <span>
                    {scheme.level} · {scheme.category}
                  </span>
                  <SchemeStatusText status={scheme.applicationStatus} />
                </div>

                <h2 className="font-display text-xl font-bold text-[#102A43] mb-1">
                  {scheme.name}
                </h2>
                <p className="text-xs text-slate-500 mb-3">{scheme.department}</p>

                <p className="text-sm text-[#334E68] leading-relaxed mb-4">
                  {scheme.briefDescription}
                </p>

                <div className="bg-[#F4F8FA] rounded-lg border border-slate-200/80 p-3.5 space-y-2 text-xs mb-4">
                  <div>
                    <span className="font-semibold text-[#102A43]">Benefits: </span>
                    <span className="text-[#334E68]">{scheme.benefitsProvided}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#102A43]">Deadline: </span>
                    <span className="text-[#334E68]">{scheme.deadline}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#102A43]">
                      Sample Eligibility:{' '}
                    </span>
                    <span className="text-[#334E68]">
                      {scheme.eligibilityCriteria.slice(0, 2).join('; ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setDetailScheme(scheme)}
                  className="text-xs font-semibold text-[#102A43] hover:text-[#087E8B] underline-offset-4 hover:underline cursor-pointer"
                >
                  Documents & Steps
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEligibility(scheme.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    <span>Check Eligibility</span>
                  </button>

                  {scheme.applicationStatus === 'Closed' ? (
                    <span className="px-3.5 py-2 bg-slate-100 text-slate-400 text-xs font-semibold rounded-lg whitespace-nowrap cursor-not-allowed">
                      Window Closed
                    </span>
                  ) : (
                    <a
                      href={scheme.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#102A43] hover:bg-[#1D3E5E] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Scheme Full Details Modal */}
      {detailScheme && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>{detailScheme.level}</span>
                  <span aria-hidden="true">·</span>
                  <SchemeStatusText status={detailScheme.applicationStatus} />
                </div>
                <h2 className="font-display text-xl font-bold text-[#102A43]">
                  {detailScheme.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{detailScheme.department}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailScheme(null)}
                aria-label="Close scheme details"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-[#334E68]">
              <div>
                <h3 className="font-display text-sm font-bold text-[#102A43] mb-1.5">
                  Sample Eligibility Criteria (Demo)
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {detailScheme.eligibilityCriteria.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-display text-sm font-bold text-[#102A43] mb-1.5">
                  Required Documents
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {detailScheme.requiredDocuments.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-display text-sm font-bold text-[#102A43] mb-1.5">
                  Application Process
                </h3>
                <ol className="list-decimal pl-5 space-y-1">
                  {detailScheme.applicationProcess.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="p-3.5 rounded-lg bg-[#F4F8FA] border border-slate-200 text-xs">
                <span className="font-semibold text-[#102A43]">Deadline Note: </span>
                <span>{detailScheme.deadline}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const id = detailScheme.id;
                  setDetailScheme(null);
                  handleOpenEligibility(id);
                }}
                className="px-4 py-2 bg-[#087E8B] text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Check Eligibility
              </button>
              <a
                href={detailScheme.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#102A43] hover:text-[#087E8B]"
              >
                <span>{detailScheme.portalLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Demo Eligibility Questionnaire Modal */}
      {eligibilityScheme && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200">
              <div>
                <p className="text-xs font-semibold text-[#087E8B]">
                  Simulated Demo Eligibility Questionnaire
                </p>
                <h2 className="font-display text-lg font-bold text-[#102A43] mt-0.5">
                  {eligibilityScheme.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onSetEligibilitySchemeId(null)}
                aria-label="Close eligibility checker"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={evaluateEligibility} className="mt-4 space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Applicant Age (Years)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={110}
                    required
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm tabular-nums focus:outline-none focus:border-[#087E8B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Annual Household Income (₹ Lakhs)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    required
                    value={incomeInput}
                    onChange={(e) => setIncomeInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm tabular-nums focus:outline-none focus:border-[#087E8B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Occupation / Category
                  </label>
                  <select
                    value={occupationInput}
                    onChange={(e) => setOccupationInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:border-[#087E8B]"
                  >
                    <option value="Student">Student</option>
                    <option value="Farmer">Farmer</option>
                    <option value="Job Seeker">Job Seeker</option>
                    <option value="Small Business / Vendor">Small Business / Vendor</option>
                    <option value="Fisherfolk / Artisan">Fisherfolk / Artisan</option>
                    <option value="Senior Citizen">Senior Citizen</option>
                    <option value="Self-Employed">Self-Employed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Gender
                  </label>
                  <select
                    value={genderInput}
                    onChange={(e) => setGenderInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:border-[#087E8B]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Karnataka District / Constituency
                </label>
                <select
                  value={residentDistrict}
                  onChange={(e) =>
                    setResidentDistrict(e.target.value as ConstituencyId)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:border-[#087E8B]"
                >
                  {CONSTITUENCIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.district})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => onSetEligibilitySchemeId(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#334E68] hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Evaluate Demo Eligibility
                </button>
              </div>
            </form>

            {checkedResult && (
              <div
                className={`mt-5 p-4 rounded-xl border ${
                  checkedResult.eligible
                    ? 'bg-[#27966D]/10 border-[#27966D]/30'
                    : 'bg-[#B91C1C]/5 border-[#B91C1C]/25'
                }`}
              >
                <div className="flex items-center gap-2 font-display font-bold text-sm mb-2">
                  {checkedResult.eligible ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[#27966D]" />
                      <span className="text-[#27966D]">
                        Likely Eligible (Simulated Demo Result)
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-[#B91C1C]" />
                      <span className="text-[#B91C1C]">
                        Criteria Not Met (Simulated Demo Result)
                      </span>
                    </>
                  )}
                </div>
                <ul className="space-y-1 text-xs text-[#334E68] list-disc pl-5">
                  {checkedResult.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-slate-500 mt-3">
                  Note: This is a frontend simulation using sample rules. Always verify
                  official government criteria before applying.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
