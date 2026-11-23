import React, { useMemo, useState } from 'react';
import {
  Calendar,
  FileText,
  IndianRupee,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import { CONSTITUENCIES, DEVELOPMENT_PROJECTS } from '../data/karnatakaData';
import {
  ConstituencyId,
  DevelopmentProject,
  ProjectCategory,
  ProjectStatus,
} from '../types/jandrishti';
import {
  DemoDataBanner,
  ProjectStatusText,
  ResilientPhoto,
} from './CivicElements';

const PROJECT_CATEGORIES: ('All' | ProjectCategory)[] = [
  'All',
  'Roads and Highways',
  'Drinking Water',
  'Drainage and Sanitation',
  'Education',
  'Healthcare',
  'Electricity',
  'Housing',
  'Rural Development',
  'Public Infrastructure',
];

const PROJECT_STATUSES: ('All' | ProjectStatus)[] = [
  'All',
  'Proposed',
  'Approved',
  'In Progress',
  'Completed',
  'Delayed',
];

interface ProjectsPageProps {
  selectedConstituency: ConstituencyId;
  onSelectConstituency: (id: ConstituencyId) => void;
  activeProjectId: string | null;
  onSelectProjectId: (id: string | null) => void;
}

export default function ProjectsPage({
  selectedConstituency,
  onSelectConstituency,
  activeProjectId,
  onSelectProjectId,
}: ProjectsPageProps) {
  const [areaFilter, setAreaFilter] = useState<'all' | ConstituencyId>('all');
  const [categoryFilter, setCategoryFilter] = useState<'All' | ProjectCategory>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDocId, setPreviewDocId] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return DEVELOPMENT_PROJECTS.filter((proj) => {
      if (areaFilter !== 'all' && proj.constituencyId !== areaFilter) return false;
      if (categoryFilter !== 'All' && proj.category !== categoryFilter) return false;
      if (statusFilter !== 'All' && proj.status !== statusFilter) return false;
      if (q) {
        const hay = `${proj.name} ${proj.location} ${proj.department} ${proj.responsibleAuthority}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [areaFilter, categoryFilter, statusFilter, searchQuery]);

  const activeProject: DevelopmentProject | null = useMemo(
    () => DEVELOPMENT_PROJECTS.find((p) => p.id === activeProjectId) || null,
    [activeProjectId]
  );

  const activeDoc = useMemo(() => {
    if (!activeProject || !previewDocId) return null;
    return activeProject.documents.find((d) => d.id === previewDocId) || null;
  }, [activeProject, previewDocId]);

  const summaryTotals = useMemo(() => {
    const sanctioned = filteredProjects.reduce((s, p) => s + p.sanctionedAmountCr, 0);
    const released = filteredProjects.reduce((s, p) => s + p.releasedAmountCr, 0);
    const spent = filteredProjects.reduce((s, p) => s + p.expenditureCr, 0);
    return {
      sanctioned: sanctioned.toFixed(2),
      released: released.toFixed(2),
      spent: spent.toFixed(2),
    };
  }, [filteredProjects]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#102A43]">
            Government Development Works
          </h1>
          <p className="text-sm text-[#486581] mt-1 max-w-2xl">
            Inspect sanctioned infrastructure budgets, released tranches, recorded
            expenditure, timelines, and source orders across Karnataka.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs">
          <div>
            <span className="text-slate-500 block">Filtered Sanctioned</span>
            <span className="font-mono font-semibold text-[#102A43] tabular-nums">
              ₹{summaryTotals.sanctioned} Cr
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-500 block">Released</span>
            <span className="font-mono font-semibold text-[#087E8B] tabular-nums">
              ₹{summaryTotals.released} Cr
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-500 block">Recorded Expenditure</span>
            <span className="font-mono font-semibold text-[#27966D] tabular-nums">
              ₹{summaryTotals.spent} Cr
            </span>
          </div>
        </div>
      </div>

      <DemoDataBanner context="Project figures, work order numbers, contractors, and timeline updates are fictional demonstration entries." />

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search project, ward, PIN, or dept..."
              aria-label="Search development works"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#087E8B]"
            />
          </div>

          <select
            value={areaFilter}
            onChange={(e) => {
              const val = e.target.value as 'all' | ConstituencyId;
              setAreaFilter(val);
              if (val !== 'all') onSelectConstituency(val);
            }}
            aria-label="Filter projects by constituency"
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-[#102A43] focus:outline-none focus:border-[#087E8B]"
          >
            <option value="all">All Constituencies (Current focus: {CONSTITUENCIES.find((c) => c.id === selectedConstituency)?.name})</option>
            {CONSTITUENCIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.district}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as 'All' | ProjectCategory)}
            aria-label="Filter projects by category"
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-[#102A43] focus:outline-none focus:border-[#087E8B]"
          >
            {PROJECT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All 9 Categories' : cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | ProjectStatus)}
            aria-label="Filter projects by status"
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-[#102A43] focus:outline-none focus:border-[#087E8B]"
          >
            {PROJECT_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st === 'All' ? 'All Statuses' : st}
              </option>
            ))}
          </select>
        </div>

        {/* Status Quick Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {PROJECT_STATUSES.map((st) => (
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
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <p className="font-display font-semibold text-[#102A43]">
            No projects match your current filters
          </p>
          <button
            type="button"
            onClick={() => {
              setAreaFilter('all');
              setCategoryFilter('All');
              setStatusFilter('All');
              setSearchQuery('');
            }}
            className="mt-3 px-4 py-2 bg-[#087E8B] text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Show All Sample Projects
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const utilizationPct =
              project.sanctionedAmountCr > 0
                ? Math.min(
                    100,
                    Math.round((project.expenditureCr / project.sanctionedAmountCr) * 100)
                  )
                : 0;
            const areaName =
              CONSTITUENCIES.find((c) => c.id === project.constituencyId)?.name || '';

            return (
              <article
                key={project.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-[#087E8B]/50 transition-colors"
              >
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-3">
                    <div className="sm:col-span-1 h-44 sm:h-full bg-slate-100">
                      <ResilientPhoto
                        src={project.imageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover"
                        fallbackTitle={project.category}
                      />
                    </div>
                    <div className="sm:col-span-2 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-medium text-slate-500">
                          {areaName} · {project.category}
                        </span>
                        <ProjectStatusText status={project.status} />
                      </div>

                      <h2 className="font-display text-lg font-bold text-[#102A43] leading-snug mb-2">
                        {project.name}
                      </h2>

                      <div className="space-y-1 text-xs text-[#334E68] mb-4">
                        <p className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>{project.location}</span>
                        </p>
                        <p>
                          <span className="text-slate-500">Department:</span>{' '}
                          {project.department}
                        </p>
                        <p>
                          <span className="text-slate-500">Authority:</span>{' '}
                          {project.responsibleAuthority}
                        </p>
                      </div>

                      {/* Financial Strip */}
                      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#F4F8FA] rounded-lg border border-slate-200/80 text-xs mb-3">
                        <div>
                          <span className="text-slate-500 block">Sanctioned</span>
                          <span className="font-mono font-semibold text-[#102A43] tabular-nums">
                            ₹{project.sanctionedAmountCr.toFixed(2)} Cr
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Released</span>
                          <span className="font-mono font-semibold text-[#087E8B] tabular-nums">
                            ₹{project.releasedAmountCr.toFixed(2)} Cr
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Spent</span>
                          <span className="font-mono font-semibold text-[#27966D] tabular-nums">
                            ₹{project.expenditureCr.toFixed(2)} Cr
                          </span>
                        </div>
                      </div>

                      {/* Utilization Bar */}
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span>Expenditure vs. Sanction</span>
                          <span className="font-mono font-medium text-[#102A43] tabular-nums">
                            {utilizationPct}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#087E8B] rounded-full"
                            style={{ width: `${utilizationPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 bg-[#F4F8FA]/60 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3 text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Start: {project.startDate}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Target: {project.expectedCompletionDate}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewDocId(null);
                      onSelectProjectId(project.id);
                    }}
                    className="px-3.5 py-1.5 bg-[#102A43] hover:bg-[#1D3E5E] text-white font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Full Project Details Modal */}
      {activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl max-w-3xl w-full border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>{activeProject.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeProject.workOrderId}</span>
                  <span aria-hidden="true">·</span>
                  <ProjectStatusText status={activeProject.status} />
                </div>
                <h2 className="font-display text-xl font-bold text-[#102A43]">
                  {activeProject.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPreviewDocId(null);
                  onSelectProjectId(null);
                }}
                aria-label="Close project details"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Photo & Overview */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                <div className="md:col-span-2 h-48 rounded-xl overflow-hidden border border-slate-200">
                  <ResilientPhoto
                    src={activeProject.imageUrl}
                    alt={activeProject.name}
                    className="w-full h-full object-cover"
                    fallbackTitle={activeProject.category}
                  />
                </div>
                <div className="md:col-span-3 space-y-3 text-sm text-[#334E68]">
                  <p className="leading-relaxed">{activeProject.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-500 block">Location</span>
                      <span className="font-medium text-[#102A43]">{activeProject.location}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Implementing Dept</span>
                      <span className="font-medium text-[#102A43]">{activeProject.department}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Responsible Authority</span>
                      <span className="font-medium text-[#102A43]">
                        {activeProject.responsibleAuthority}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Executing Contractor</span>
                      <span className="font-medium text-[#102A43]">{activeProject.contractor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Funding Breakdown */}
              <div className="bg-[#F4F8FA] rounded-xl border border-slate-200 p-5">
                <h3 className="font-display text-sm font-bold text-[#102A43] flex items-center gap-2 mb-4">
                  <IndianRupee className="w-4 h-4 text-[#087E8B]" />
                  <span>Funding Breakdown (Demo Data)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-500">Sanctioned Amount</span>
                    <p className="font-mono text-xl font-bold text-[#102A43] tabular-nums mt-0.5">
                      ₹{activeProject.sanctionedAmountCr.toFixed(2)} Cr
                    </p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-500">Released Amount</span>
                    <p className="font-mono text-xl font-bold text-[#087E8B] tabular-nums mt-0.5">
                      ₹{activeProject.releasedAmountCr.toFixed(2)} Cr
                    </p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-500">Recorded Expenditure</span>
                    <p className="font-mono text-xl font-bold text-[#27966D] tabular-nums mt-0.5">
                      ₹{activeProject.expenditureCr.toFixed(2)} Cr
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#334E68]">Funding Source Split</p>
                  {activeProject.fundingSplit.map((split) => (
                    <div key={split.label} className="space-y-1">
                      <div className="flex justify-between text-xs text-[#334E68]">
                        <span>{split.label}</span>
                        <span className="font-mono font-semibold tabular-nums">
                          {split.percent}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#102A43] rounded-full"
                          style={{ width: `${split.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Timeline */}
              <div>
                <h3 className="font-display text-sm font-bold text-[#102A43] mb-3">
                  Project Execution Timeline
                </h3>
                <div className="space-y-3 border-l border-slate-200 ml-2 pl-5">
                  {activeProject.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <span
                        aria-hidden="true"
                        className={`absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                          step.status === 'done'
                            ? 'bg-[#27966D]'
                            : step.status === 'current'
                              ? 'bg-[#087E8B]'
                              : 'bg-slate-300'
                        }`}
                      />
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-[#102A43]">{step.title}</p>
                        <span className="font-mono text-xs text-slate-500">{step.date}</span>
                      </div>
                      <p className="text-xs text-[#334E68] mt-0.5">{step.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Source Documents */}
              <div>
                <h3 className="font-display text-sm font-bold text-[#102A43] mb-3">
                  Source Orders & Public Records (Sample)
                </h3>
                <div className="space-y-2">
                  {activeProject.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <FileText className="w-4 h-4 text-[#087E8B] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-[#102A43]">{doc.title}</p>
                          <p className="text-xs text-slate-500">
                            {doc.docType} · Ref: <span className="font-mono">{doc.refNumber}</span> ·{' '}
                            {doc.date}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewDocId(previewDocId === doc.id ? null : doc.id)
                        }
                        className="px-3 py-1.5 text-xs font-semibold text-[#087E8B] border border-[#087E8B]/30 hover:bg-[#087E8B]/10 rounded-lg whitespace-nowrap cursor-pointer"
                      >
                        {previewDocId === doc.id ? 'Hide Abstract' : 'Inspect Abstract'}
                      </button>
                    </div>
                  ))}
                </div>

                {activeDoc && (
                  <div className="mt-3 p-4 rounded-lg bg-[#102A43] text-slate-100 text-xs space-y-1.5">
                    <p className="font-semibold text-[#E5A93D]">
                      Document Abstract — {activeDoc.refNumber}
                    </p>
                    <p className="leading-relaxed">{activeDoc.summary}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
