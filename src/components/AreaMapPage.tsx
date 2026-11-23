import React, { useMemo, useState } from 'react';
import {
  Building2,
  Hospital,
  MapPin,
  Navigation,
  School,
  Droplets,
  ArrowRight,
} from 'lucide-react';
import { CONSTITUENCIES, DEVELOPMENT_PROJECTS } from '../data/karnatakaData';
import {
  ConstituencyId,
  DevelopmentProject,
  PublicFacility,
} from '../types/jandrishti';
import { DemoDataBanner, ProjectStatusText } from './CivicElements';

interface AreaMapPageProps {
  selectedConstituency: ConstituencyId;
  onSelectConstituency: (id: ConstituencyId) => void;
  onOpenProject: (projectId: string) => void;
}

type SelectedMapItem =
  | { kind: 'project'; item: DevelopmentProject }
  | { kind: 'facility'; item: PublicFacility }
  | null;

export default function AreaMapPage({
  selectedConstituency,
  onSelectConstituency,
  onOpenProject,
}: AreaMapPageProps) {
  const [showProjects, setShowProjects] = useState(true);
  const [showFacilities, setShowFacilities] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<SelectedMapItem>(null);

  const area = useMemo(
    () =>
      CONSTITUENCIES.find((c) => c.id === selectedConstituency) ||
      CONSTITUENCIES[0],
    [selectedConstituency]
  );

  const areaProjects = useMemo(
    () =>
      DEVELOPMENT_PROJECTS.filter((p) => p.constituencyId === area.id),
    [area.id]
  );

  const metrics = useMemo(() => {
    const sanctioned = areaProjects.reduce((s, p) => s + p.sanctionedAmountCr, 0);
    const released = areaProjects.reduce((s, p) => s + p.releasedAmountCr, 0);
    const spent = areaProjects.reduce((s, p) => s + p.expenditureCr, 0);
    const completed = areaProjects.filter((p) => p.status === 'Completed').length;
    const ongoing = areaProjects.filter(
      (p) => p.status === 'In Progress' || p.status === 'Delayed'
    ).length;
    return {
      total: areaProjects.length,
      sanctioned: sanctioned.toFixed(2),
      released: released.toFixed(2),
      spent: spent.toFixed(2),
      completed,
      ongoing,
    };
  }, [areaProjects]);

  const activeSelection = useMemo(() => {
    if (selectedMarker) return selectedMarker;
    if (areaProjects.length > 0) {
      return { kind: 'project' as const, item: areaProjects[0] };
    }
    return null;
  }, [selectedMarker, areaProjects]);

  const getMarkerColor = (status: DevelopmentProject['status']) => {
    switch (status) {
      case 'Completed':
        return '#27966D';
      case 'In Progress':
        return '#087E8B';
      case 'Delayed':
        return '#B91C1C';
      case 'Approved':
        return '#102A43';
      case 'Proposed':
        return '#E5A93D';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header & Constituency Selector */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#102A43]">
            Area Dashboard & Interactive Constituency Map
          </h1>
          <p className="text-sm text-[#486581] mt-1">
            Inspect spatial distribution of completed works, active infrastructure, and
            public facilities across wards.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200">
          {CONSTITUENCIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                onSelectConstituency(c.id);
                setSelectedMarker(null);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                c.id === area.id
                  ? 'bg-[#102A43] text-white'
                  : 'text-[#334E68] hover:bg-slate-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <DemoDataBanner context={`Displaying interactive sample map schematic for ${area.name} (${area.district} District). Marker coordinates and facility notes are illustrative demo entries.`} />

      {/* Area Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-xs text-slate-500 block">Constituency Projects</span>
          <p className="font-display text-2xl font-bold text-[#102A43] tabular-nums mt-1">
            {metrics.total}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-xs text-slate-500 block">Sanctioned Funds</span>
          <p className="font-display text-2xl font-bold text-[#102A43] tabular-nums mt-1">
            ₹{metrics.sanctioned} Cr
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-xs text-slate-500 block">Released Amount</span>
          <p className="font-display text-2xl font-bold text-[#087E8B] tabular-nums mt-1">
            ₹{metrics.released} Cr
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-xs text-slate-500 block">Recorded Expenditure</span>
          <p className="font-display text-2xl font-bold text-[#27966D] tabular-nums mt-1">
            ₹{metrics.spent} Cr
          </p>
        </div>
        <div className="col-span-2 lg:col-span-1 bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-xs text-slate-500 block">Completed / Active</span>
          <p className="font-display text-2xl font-bold text-[#102A43] tabular-nums mt-1">
            {metrics.completed} / {metrics.ongoing}
          </p>
        </div>
      </div>

      {/* Main Map + Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive Constituency SVG Map */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-[#102A43]">
                {area.constituencyName}
              </h2>
              <p className="text-xs text-slate-500">
                {area.mapSubtitle} · PINs: {area.pinCodes.join(', ')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowProjects((v) => !v)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  showProjects
                    ? 'bg-[#087E8B] text-white border-[#087E8B]'
                    : 'bg-white text-[#334E68] border-slate-300'
                }`}
              >
                Development Works ({areaProjects.length})
              </button>
              <button
                type="button"
                onClick={() => setShowFacilities((v) => !v)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  showFacilities
                    ? 'bg-[#102A43] text-white border-[#102A43]'
                    : 'bg-white text-[#334E68] border-slate-300'
                }`}
              >
                Public Facilities ({area.facilities.length})
              </button>
            </div>
          </div>

          {/* Interactive Geo-Schematic Map Canvas */}
          <div className="relative w-full aspect-[16/10] bg-[#EEF4F7] rounded-xl border border-slate-200 overflow-hidden">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full"
              aria-label={`Interactive constituency map of ${area.name}`}
            >
              {/* Subtle Coordinate Grid */}
              <defs>
                <pattern
                  id="civicGrid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="0.25"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#civicGrid)" />

              {/* Arterial Road Corridors */}
              <path
                d="M 8 50 Q 50 44 92 52"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="1.2"
                strokeDasharray="2 1.2"
              />
              <path
                d="M 48 8 Q 52 50 46 92"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="1.2"
                strokeDasharray="2 1.2"
              />

              {/* Ward Zones */}
              {area.zones.map((z) => (
                <g key={z.id}>
                  <rect
                    x={z.x}
                    y={z.y}
                    width={z.width}
                    height={z.height}
                    rx="2.5"
                    fill="#FFFFFF"
                    fillOpacity="0.72"
                    stroke="#94A3B8"
                    strokeWidth="0.45"
                  />
                  <text
                    x={z.x + 2}
                    y={z.y + 5}
                    fontSize="2.7"
                    fontWeight="600"
                    fill="#486581"
                  >
                    {z.label}
                  </text>
                </g>
              ))}
            </svg>

            {/* Facility Markers */}
            {showFacilities &&
              area.facilities.map((fac) => {
                const isActive =
                  activeSelection?.kind === 'facility' &&
                  activeSelection.item.id === fac.id;
                return (
                  <button
                    key={fac.id}
                    type="button"
                    onClick={() => setSelectedMarker({ kind: 'facility', item: fac })}
                    style={{ left: `${fac.x}%`, top: `${fac.y}%` }}
                    title={fac.name}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold shadow-md border transition-transform cursor-pointer ${
                      isActive
                        ? 'bg-[#102A43] text-white border-white scale-110 z-20'
                        : 'bg-white text-[#102A43] border-slate-300 hover:scale-105 z-10'
                    }`}
                  >
                    {fac.type === 'School' && <School className="w-3.5 h-3.5 text-[#E5A93D]" />}
                    {fac.type === 'Hospital' && <Hospital className="w-3.5 h-3.5 text-[#27966D]" />}
                    {fac.type === 'Road Corridor' && <Navigation className="w-3.5 h-3.5 text-[#087E8B]" />}
                    {fac.type === 'Water Station' && <Droplets className="w-3.5 h-3.5 text-[#087E8B]" />}
                    <span className="hidden sm:inline max-w-[110px] truncate">{fac.type}</span>
                  </button>
                );
              })}

            {/* Project Markers */}
            {showProjects &&
              areaProjects.map((proj, index) => {
                const isActive =
                  activeSelection?.kind === 'project' &&
                  activeSelection.item.id === proj.id;
                const color = getMarkerColor(proj.status);
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => setSelectedMarker({ kind: 'project', item: proj })}
                    style={{
                      left: `${proj.coordinates.x}%`,
                      top: `${proj.coordinates.y}%`,
                    }}
                    title={proj.name}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-white shadow-md border-2 transition-transform cursor-pointer ${
                      isActive
                        ? 'border-[#102A43] scale-110 z-30 ring-2 ring-white'
                        : 'border-white hover:scale-105 z-20'
                    }`}
                    aria-label={`Select project marker: ${proj.name}`}
                  >
                    <span
                      style={{ backgroundColor: color }}
                      className="absolute inset-0 rounded-md -z-10"
                    />
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-mono tabular-nums">P{index + 1}</span>
                  </button>
                );
              })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#334E68]">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#27966D]" />
                Completed
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#087E8B]" />
                In Progress
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#B91C1C]" />
                Delayed
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#102A43]" />
                Approved
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#E5A93D]" />
                Proposed
              </span>
            </div>
            <span className="text-slate-500">Click any marker on the map to inspect details</span>
          </div>
        </div>

        {/* Side Inspector Panel */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          {activeSelection?.kind === 'project' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#087E8B]">
                  Selected Development Work
                </span>
                <ProjectStatusText status={activeSelection.item.status} />
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-[#102A43] leading-snug">
                  {activeSelection.item.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {activeSelection.item.location}
                </p>
              </div>

              <p className="text-sm text-[#334E68] leading-relaxed">
                {activeSelection.item.description}
              </p>

              <div className="bg-[#F4F8FA] rounded-lg border border-slate-200 p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Department</span>
                  <span className="font-medium text-[#102A43] text-right max-w-[60%]">
                    {activeSelection.item.department}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sanctioned Budget</span>
                  <span className="font-mono font-semibold text-[#102A43] tabular-nums">
                    ₹{activeSelection.item.sanctionedAmountCr.toFixed(2)} Cr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Released Funds</span>
                  <span className="font-mono font-semibold text-[#087E8B] tabular-nums">
                    ₹{activeSelection.item.releasedAmountCr.toFixed(2)} Cr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expenditure</span>
                  <span className="font-mono font-semibold text-[#27966D] tabular-nums">
                    ₹{activeSelection.item.expenditureCr.toFixed(2)} Cr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Completion</span>
                  <span className="font-mono text-[#102A43]">
                    {activeSelection.item.expectedCompletionDate}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenProject(activeSelection.item.id)}
                className="w-full py-2.5 px-4 bg-[#102A43] hover:bg-[#1D3E5E] text-white text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Open Full Project Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : activeSelection?.kind === 'facility' ? (
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#102A43]">
                Public Civic Facility ({activeSelection.item.type})
              </span>
              <h3 className="font-display text-lg font-bold text-[#102A43]">
                {activeSelection.item.name}
              </h3>
              <div className="bg-[#F4F8FA] rounded-lg border border-slate-200 p-4 space-y-2 text-xs text-[#334E68]">
                <p>
                  <strong className="text-[#102A43]">Ward / Zone:</strong>{' '}
                  {activeSelection.item.ward}
                </p>
                <p>
                  <strong className="text-[#102A43]">Status Note:</strong>{' '}
                  {activeSelection.item.statusNote}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-slate-500">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              Select a map marker to inspect local infrastructure details.
            </div>
          )}

          {/* Area Quick Summary Footer */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-[#334E68] space-y-1">
            <p className="font-semibold text-[#102A43]">
              {area.name} Localities Covered (Sample)
            </p>
            <p>{area.localities.join(' · ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
