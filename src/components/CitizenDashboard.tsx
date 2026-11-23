import React, { useMemo } from 'react';
import {
  ArrowRight,
  Bell,
  Building2,
  ClipboardList,
  LogOut,
  MapPin,
  ShieldCheck,
  User,
} from 'lucide-react';
import {
  CITIZEN_ANNOUNCEMENTS,
  CONSTITUENCIES,
  DEVELOPMENT_PROJECTS,
  GOVERNMENT_SCHEMES,
  REPRESENTATIVES,
} from '../data/karnatakaData';
import {
  CitizenReport,
  CitizenUser,
  ConstituencyId,
  PageId,
} from '../types/jandrishti';
import {
  DemoDataBanner,
  ProjectStatusText,
  ReportStatusText,
  SchemeStatusText,
} from './CivicElements';

interface CitizenDashboardProps {
  user: CitizenUser;
  onChangeConstituency: (id: ConstituencyId) => void;
  onLogout: () => void;
  onNavigate: (page: PageId) => void;
  onOpenProject: (projectId: string) => void;
  onOpenSchemeEligibility: (schemeId: string) => void;
  reports: CitizenReport[];
}

export default function CitizenDashboard({
  user,
  onChangeConstituency,
  onLogout,
  onNavigate,
  onOpenProject,
  onOpenSchemeEligibility,
  reports,
}: CitizenDashboardProps) {
  const area = useMemo(
    () =>
      CONSTITUENCIES.find((c) => c.id === user.constituencyId) ||
      CONSTITUENCIES[0],
    [user.constituencyId]
  );

  const mla = useMemo(
    () =>
      REPRESENTATIVES.find(
        (r) =>
          r.constituencyId === area.id &&
          r.designation === 'Member of Legislative Assembly (MLA)'
      ),
    [area.id]
  );

  const mp = useMemo(
    () =>
      REPRESENTATIVES.find(
        (r) =>
          r.constituencyId === area.id &&
          r.designation === 'Member of Parliament (MP)'
      ),
    [area.id]
  );

  const localProjects = useMemo(
    () => DEVELOPMENT_PROJECTS.filter((p) => p.constituencyId === area.id),
    [area.id]
  );

  const areaSchemes = useMemo(
    () =>
      GOVERNMENT_SCHEMES.filter(
        (s) =>
          s.applicableConstituencies === 'all' ||
          s.applicableConstituencies.includes(area.id)
      ),
    [area.id]
  );

  const areaReports = useMemo(
    () => reports.filter((r) => r.constituencyId === area.id),
    [reports, area.id]
  );

  const announcements = useMemo(
    () => CITIZEN_ANNOUNCEMENTS.filter((a) => a.constituencyId === area.id),
    [area.id]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Citizen Profile & Constituency Switcher Bar */}
      <div className="bg-[#102A43] text-white rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#087E8B] flex items-center justify-center font-display font-bold text-xl shrink-0">
            {user.fullName
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold text-[#E5A93D]">
              Citizen Portal (Prototype Session) · Voter ID: {user.voterId}
            </p>
            <h1 className="font-display text-2xl font-bold mt-0.5">
              Welcome, {user.fullName}
            </h1>
            <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E5A93D]" />
                {area.constituencyName}
              </span>
              <span>·</span>
              <span>
                District: {area.district}, {area.state}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label
              htmlFor="dashboard-constituency"
              className="block text-[11px] text-slate-300 mb-1"
            >
              Switch Active Constituency
            </label>
            <select
              id="dashboard-constituency"
              value={area.id}
              onChange={(e) => onChangeConstituency(e.target.value as ConstituencyId)}
              className="px-3 py-2 rounded-lg bg-white text-[#102A43] text-xs font-semibold focus:outline-none"
            >
              {CONSTITUENCIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.district})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <DemoDataBanner context={`Dashboard personalized for ${area.name} (${area.district}, ${area.state}). Changing your constituency updates MLA/MP cards, works, schemes, complaints, and announcements dynamically.`} />

      {/* Top Row: MLA & MP + Profile Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* MLA Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-[#087E8B]">
              Constituency MLA (Sample)
            </p>
            <h2 className="font-display text-lg font-bold text-[#102A43] mt-1">
              {mla?.name || 'Sample MLA Profile'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{mla?.department}</p>
            <p className="text-xs text-[#334E68] mt-3">{mla?.officeAddress}</p>
            <p className="font-mono text-xs text-[#102A43] mt-1.5">
              {mla?.contactPhone}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('representatives')}
            className="mt-4 text-xs font-semibold text-[#087E8B] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>All Officers & Representatives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* MP Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-[#087E8B]">
              Parliamentary MP (Sample)
            </p>
            <h2 className="font-display text-lg font-bold text-[#102A43] mt-1">
              {mp?.name || 'Sample MP Profile'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{mp?.department}</p>
            <p className="text-xs text-[#334E68] mt-3">{mp?.officeAddress}</p>
            <p className="font-mono text-xs text-[#102A43] mt-1.5">
              {mp?.contactPhone}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('representatives')}
            className="mt-4 text-xs font-semibold text-[#087E8B] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Citizen Profile Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#102A43] mb-2">
              <User className="w-4 h-4 text-[#087E8B]" />
              <span>Citizen Demo Profile</span>
            </div>
            <div className="space-y-1.5 text-xs text-[#334E68]">
              <p>
                <strong className="text-[#102A43]">Name:</strong> {user.fullName}
              </p>
              <p>
                <strong className="text-[#102A43]">Demo ID:</strong>{' '}
                <span className="font-mono">{user.voterId}</span>
              </p>
              <p>
                <strong className="text-[#102A43]">Email:</strong> {user.email}
              </p>
              <p>
                <strong className="text-[#102A43]">Mobile:</strong> {user.mobile}
              </p>
              <p>
                <strong className="text-[#102A43]">Area:</strong> {area.name},{' '}
                {area.district}, {area.state}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('map')}
            className="mt-4 px-3.5 py-2 bg-[#F4F8FA] hover:bg-slate-200/70 text-[#102A43] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Open {area.name} Interactive Map
          </button>
        </div>
      </div>

      {/* Local Development Projects & Recently Updated */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-[#102A43] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#087E8B]" />
                <span>Local Development Projects in {area.name}</span>
              </h2>
              <p className="text-xs text-slate-500">
                Sorted by most recent progress update
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('works')}
              className="text-xs font-semibold text-[#087E8B] hover:underline cursor-pointer"
            >
              View All Works
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {localProjects.map((proj) => (
              <div
                key={proj.id}
                className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-0.5">
                    <span>{proj.category}</span>
                    <span>·</span>
                    <span>Updated {proj.lastUpdated}</span>
                    <span>·</span>
                    <ProjectStatusText status={proj.status} />
                  </div>
                  <h3 className="font-display text-sm font-bold text-[#102A43]">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-[#334E68] mt-0.5 tabular-nums">
                    Sanctioned ₹{proj.sanctionedAmountCr.toFixed(2)} Cr · Spent ₹
                    {proj.expenditureCr.toFixed(2)} Cr
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenProject(proj.id)}
                  className="px-3 py-1.5 bg-[#102A43] hover:bg-[#1D3E5E] text-white text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Inspect
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Notifications & Announcements */}
        <section className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#102A43] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#E5A93D]" />
              <span>Area Announcements ({area.name})</span>
            </h2>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-xl bg-[#F4F8FA] border border-slate-200 space-y-1"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{ann.department}</span>
                  <span className="font-mono">{ann.date}</span>
                </div>
                <h3 className="font-display text-sm font-bold text-[#102A43]">
                  {ann.title}
                </h3>
                <p className="text-xs text-[#334E68] leading-relaxed">
                  {ann.summary}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Available Schemes & Citizen Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Government Schemes Available in Area */}
        <section className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#102A43] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#27966D]" />
              <span>Schemes Available in {area.name}</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('schemes')}
              className="text-xs font-semibold text-[#087E8B] hover:underline cursor-pointer"
            >
              All Schemes
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {areaSchemes.slice(0, 4).map((sch) => (
              <div
                key={sch.id}
                className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>{sch.level}</span>
                    <span>·</span>
                    <SchemeStatusText status={sch.applicationStatus} />
                  </div>
                  <p className="font-display text-sm font-semibold text-[#102A43] truncate">
                    {sch.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenSchemeEligibility(sch.id)}
                  className="px-3 py-1.5 bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Check
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Citizen Complaints & Submitted Reports */}
        <section className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#102A43] flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#087E8B]" />
              <span>Submitted Reports ({area.name})</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('services')}
              className="px-3 py-1.5 bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              + File New Report
            </button>
          </div>

          {areaReports.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">
              No citizen reports logged for {area.name} yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {areaReports.map((rep) => (
                <div key={rep.id} className="py-3 first:pt-1 last:pb-1 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500">
                      {rep.referenceCode} · {rep.submittedDate}
                    </span>
                    <ReportStatusText status={rep.status} />
                  </div>
                  <p className="font-display text-sm font-semibold text-[#102A43]">
                    {rep.title}
                  </p>
                  <p className="text-xs text-slate-500">{rep.location}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
