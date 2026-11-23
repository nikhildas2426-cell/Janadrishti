import React, { useMemo, useState } from 'react';
import {
  Building,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Search,
  UserCheck,
  X,
} from 'lucide-react';
import { CONSTITUENCIES, REPRESENTATIVES } from '../data/karnatakaData';
import {
  ConstituencyId,
  RepresentativeGroup,
  RepresentativeProfile,
} from '../types/jandrishti';
import { DemoDataBanner } from './CivicElements';

interface RepresentativesPageProps {
  selectedConstituency: ConstituencyId;
  onSelectConstituency: (id: ConstituencyId) => void;
}

export default function RepresentativesPage({
  selectedConstituency,
  onSelectConstituency,
}: RepresentativesPageProps) {
  const [groupFilter, setGroupFilter] = useState<'All' | RepresentativeGroup>('All');
  const [areaFilter, setAreaFilter] = useState<'all' | ConstituencyId>(selectedConstituency);
  const [designationFilter, setDesignationFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProfile, setActiveProfile] = useState<RepresentativeProfile | null>(null);

  const designations = useMemo(() => {
    const set = new Set(REPRESENTATIVES.map((r) => r.designation));
    return ['All', ...Array.from(set)];
  }, []);

  const departments = useMemo(() => {
    const set = new Set(REPRESENTATIVES.map((r) => r.department));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredProfiles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return REPRESENTATIVES.filter((rep) => {
      if (groupFilter !== 'All' && rep.group !== groupFilter) return false;
      if (areaFilter !== 'all' && rep.constituencyId !== areaFilter) return false;
      if (designationFilter !== 'All' && rep.designation !== designationFilter) return false;
      if (departmentFilter !== 'All' && rep.department !== departmentFilter) return false;
      if (q) {
        const hay = `${rep.name} ${rep.designation} ${rep.department} ${rep.areaOfResponsibility}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [groupFilter, areaFilter, designationFilter, departmentFilter, searchQuery]);

  const handleAreaChange = (val: 'all' | ConstituencyId) => {
    setAreaFilter(val);
    if (val !== 'all') {
      onSelectConstituency(val);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#102A43]">
            Know Your Representatives & Public Officers
          </h1>
          <p className="text-sm text-[#486581] mt-1 max-w-2xl">
            Directory of elected representatives (MLA, MP, MLC, Mayor, Councillors,
            Panchayat members) and government officers (DC, AC, Tahsildar, CEO, PDO, PWD).
          </p>
        </div>

        {/* Group Segmented Filter */}
        <div className="inline-flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg self-start">
          {(['All', 'Elected Representative', 'Government Officer'] as const).map(
            (grp) => (
              <button
                key={grp}
                type="button"
                onClick={() => setGroupFilter(grp)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  groupFilter === grp
                    ? 'bg-[#102A43] text-white'
                    : 'text-[#334E68] hover:text-[#102A43]'
                }`}
              >
                {grp === 'All' ? 'All Profiles' : `${grp}s`}
              </button>
            )
          )}
        </div>
      </div>

      <DemoDataBanner context="All representative and officer names, portraits/monograms, phone numbers, and emails below are clearly labelled fictional sample profiles created for prototype demonstration." />

      {/* Filters Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, role, or ward..."
            aria-label="Search representatives"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#087E8B]"
          />
        </div>

        <select
          value={areaFilter}
          onChange={(e) => handleAreaChange(e.target.value as 'all' | ConstituencyId)}
          aria-label="Filter by constituency"
          className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-[#102A43] focus:outline-none focus:border-[#087E8B]"
        >
          <option value="all">All Karnataka Sample Areas</option>
          {CONSTITUENCIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.district})
            </option>
          ))}
        </select>

        <select
          value={designationFilter}
          onChange={(e) => setDesignationFilter(e.target.value)}
          aria-label="Filter by designation"
          className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-[#102A43] focus:outline-none focus:border-[#087E8B]"
        >
          {designations.map((d) => (
            <option key={d} value={d}>
              {d === 'All' ? 'All Designations' : d}
            </option>
          ))}
        </select>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          aria-label="Filter by department"
          className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-[#102A43] focus:outline-none focus:border-[#087E8B]"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept === 'All' ? 'All Departments' : dept}
            </option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-[#102A43] tabular-nums">{filteredProfiles.length}</strong> sample profiles
        </span>
        {(groupFilter !== 'All' ||
          areaFilter !== 'all' ||
          designationFilter !== 'All' ||
          departmentFilter !== 'All' ||
          searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setGroupFilter('All');
              setAreaFilter('all');
              setDesignationFilter('All');
              setDepartmentFilter('All');
              setSearchQuery('');
            }}
            className="text-[#087E8B] font-semibold hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Profile Grid */}
      {filteredProfiles.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <UserCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="font-display font-semibold text-[#102A43]">
            No matching representative profiles
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Try switching constituency to &quot;All Karnataka Sample Areas&quot; or clearing filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProfiles.map((rep) => {
            const area = CONSTITUENCIES.find((c) => c.id === rep.constituencyId);
            return (
              <article
                key={rep.id}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-[#087E8B]/50 transition-colors"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      aria-hidden="true"
                      className={`w-14 h-14 rounded-xl flex items-center justify-center font-display font-bold text-lg shrink-0 ${
                        rep.group === 'Elected Representative'
                          ? 'bg-[#102A43] text-[#E5A93D]'
                          : 'bg-[#087E8B]/12 text-[#087E8B]'
                      }`}
                    >
                      {rep.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#087E8B]">
                        {rep.group} · {area?.name}
                      </p>
                      <h2 className="font-display text-lg font-bold text-[#102A43] leading-snug mt-0.5">
                        {rep.name}
                      </h2>
                      <p className="text-xs font-semibold text-[#334E68] mt-0.5">
                        {rep.designation}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-[#334E68] border-t border-slate-100 pt-3">
                    <div className="flex items-start gap-2">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{rep.department}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{rep.areaOfResponsibility}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="font-mono">{rep.contactPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{rep.termOrBatch}</span>
                  <button
                    type="button"
                    onClick={() => setActiveProfile(rep)}
                    className="px-3.5 py-1.5 bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Profile Detail Modal */}
      {activeProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl max-w-xl w-full p-6 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center font-display font-bold text-xl shrink-0 ${
                    activeProfile.group === 'Elected Representative'
                      ? 'bg-[#102A43] text-[#E5A93D]'
                      : 'bg-[#087E8B]/12 text-[#087E8B]'
                  }`}
                >
                  {activeProfile.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#087E8B]">
                    {activeProfile.group} · Fictional Demo Profile
                  </p>
                  <h2 className="font-display text-xl font-bold text-[#102A43]">
                    {activeProfile.name}
                  </h2>
                  <p className="text-sm font-medium text-[#334E68]">
                    {activeProfile.designation}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveProfile(null)}
                aria-label="Close profile details"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-sm text-[#334E68]">
              <p className="leading-relaxed">{activeProfile.bio}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F4F8FA] p-4 rounded-xl border border-slate-200">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Department</p>
                  <p className="font-medium text-[#102A43] mt-0.5">
                    {activeProfile.department}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Area of Responsibility
                  </p>
                  <p className="font-medium text-[#102A43] mt-0.5">
                    {activeProfile.areaOfResponsibility}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Office Hours</p>
                  <p className="font-medium text-[#102A43] mt-0.5">
                    {activeProfile.officeHours}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Term / Role Type</p>
                  <p className="font-medium text-[#102A43] mt-0.5">
                    {activeProfile.termOrBatch}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <h3 className="font-display text-sm font-bold text-[#102A43]">
                  Office & Sample Contact Details
                </h3>
                <div className="flex items-start gap-2.5 text-sm">
                  <MapPin className="w-4 h-4 text-[#087E8B] shrink-0 mt-0.5" />
                  <span>{activeProfile.officeAddress}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone className="w-4 h-4 text-[#087E8B] shrink-0" />
                  <span className="font-mono">{activeProfile.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="w-4 h-4 text-[#087E8B] shrink-0" />
                  <span className="font-mono">{activeProfile.contactEmail}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <a
                href={activeProfile.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087E8B] hover:underline"
              >
                <span>Official Government Department Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setActiveProfile(null)}
                className="px-4 py-2 bg-[#102A43] text-white text-xs font-semibold rounded-lg hover:bg-[#1D3E5E] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
