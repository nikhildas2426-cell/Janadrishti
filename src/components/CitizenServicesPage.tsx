import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  MapPin,
  Send,
} from 'lucide-react';
import { CONSTITUENCIES } from '../data/karnatakaData';
import {
  CitizenReport,
  CitizenReportStatus,
  ConstituencyId,
  ProjectCategory,
} from '../types/jandrishti';
import { DemoDataBanner, ReportStatusText } from './CivicElements';

const REPORT_CATEGORIES: ProjectCategory[] = [
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

interface CitizenServicesPageProps {
  selectedConstituency: ConstituencyId;
  reports: CitizenReport[];
  onSubmitReport: (
    newReport: Omit<CitizenReport, 'id' | 'referenceCode' | 'submittedDate' | 'status'>
  ) => CitizenReport;
  reporterName: string;
}

export default function CitizenServicesPage({
  selectedConstituency,
  reports,
  onSubmitReport,
  reporterName,
}: CitizenServicesPageProps) {
  const [constituencyId, setConstituencyId] =
    useState<ConstituencyId>(selectedConstituency);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Roads and Highways');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(undefined);
  const [photoName, setPhotoName] = useState('');
  const [lastSubmitted, setLastSubmitted] = useState<CitizenReport | null>(null);

  const [statusFilter, setStatusFilter] = useState<'All' | CitizenReportStatus>('All');
  const [areaFilter, setAreaFilter] = useState<'all' | ConstituencyId>('all');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !description.trim()) return;

    const created = onSubmitReport({
      constituencyId,
      title: title.trim(),
      category,
      location: location.trim(),
      description: description.trim(),
      submittedBy: reporterName,
      photoDataUrl: photoPreview,
    });

    setLastSubmitted(created);
    setTitle('');
    setLocation('');
    setDescription('');
    setPhotoPreview(undefined);
    setPhotoName('');
  };

  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      if (statusFilter !== 'All' && rep.status !== statusFilter) return false;
      if (areaFilter !== 'all' && rep.constituencyId !== areaFilter) return false;
      return true;
    });
  }, [reports, statusFilter, areaFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-[#102A43]">
          Citizen Services & Issue Participation
        </h1>
        <p className="text-sm text-[#486581] mt-1 max-w-2xl">
          Report incomplete development works or local infrastructure issues with location
          details and photographic evidence, and track community submission statuses.
        </p>
      </div>

      <DemoDataBanner context="Citizen issue submission is a frontend prototype simulation. Submitting a report here updates the local demo tracker only and does not create an official government grievance." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Submission Form */}
        <section className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-display text-xl font-bold text-[#102A43]">
            Report an Incomplete Work or Civic Issue
          </h2>

          {lastSubmitted && (
            <div className="p-4 rounded-xl bg-[#27966D]/10 border border-[#27966D]/30 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-display font-bold text-sm text-[#27966D]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Simulated Submission Recorded</span>
              </div>
              <p className="text-[#102A43]">
                Reference ID:{' '}
                <strong className="font-mono">{lastSubmitted.referenceCode}</strong> ·
                Status: <strong>{lastSubmitted.status}</strong>
              </p>
              <p className="text-[#334E68]">
                Reminder: This prototype submission is stored only in your browser session
                and does not file an official government complaint.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Constituency / Area
                </label>
                <select
                  value={constituencyId}
                  onChange={(e) => setConstituencyId(e.target.value as ConstituencyId)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:border-[#087E8B]"
                >
                  {CONSTITUENCIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.district})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Infrastructure Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:border-[#087E8B]"
                >
                  {REPORT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Issue Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Uncovered stormwater drain slab near Bus Stand"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#087E8B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Ward, Street & PIN Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Ward 32, Kadri Temple Road, Mangaluru - 575002"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#087E8B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Observation Description
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe incomplete work, material quality concern, or public safety issue..."
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#087E8B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#102A43] mb-1">
                Upload Issue Photograph (Optional, Local Browser Preview)
              </label>
              <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-slate-300 rounded-lg bg-[#F4F8FA] hover:border-[#087E8B] cursor-pointer text-xs font-medium text-[#334E68]">
                <Camera className="w-4 h-4 text-[#087E8B]" />
                <span>{photoName ? `Selected: ${photoName}` : 'Choose a photo (JPG/PNG)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              {photoPreview && (
                <div className="mt-2 relative rounded-lg overflow-hidden border border-slate-200 h-32">
                  <img
                    src={photoPreview}
                    alt="Uploaded civic issue preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(undefined);
                      setPhotoName('');
                    }}
                    className="absolute top-2 right-2 px-2 py-1 bg-[#102A43]/85 text-white text-[11px] rounded cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Mandatory Official Complaint Clarification */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-[#E5A93D]/12 border border-[#E5A93D]/30 text-xs text-[#102A43]">
              <AlertCircle className="w-4 h-4 text-[#9A6B16] shrink-0 mt-0.5" />
              <p>
                Submitting a report through JanDrishti{' '}
                <strong>does not automatically create an official government complaint</strong>.
                This form simulates public civic issue logging for demonstration purposes.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#087E8B] hover:bg-[#06636E] text-white text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Public Issue Report</span>
            </button>
          </form>
        </section>

        {/* Submitted Reports Tracker */}
        <section className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-[#102A43]">
                Submitted Citizen Reports Tracker
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Track sample and newly submitted local reports across statuses.
              </p>
            </div>

            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value as 'all' | ConstituencyId)}
              aria-label="Filter citizen reports by area"
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-[#102A43] focus:outline-none focus:border-[#087E8B]"
            >
              <option value="all">All Constituencies</option>
              {CONSTITUENCIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(['All', 'Submitted', 'Under Review', 'Forwarded', 'Resolved'] as const).map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#102A43] text-white'
                      : 'bg-[#F4F8FA] text-[#334E68] hover:text-[#102A43]'
                  }`}
                >
                  {st}
                </button>
              )
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {filteredReports.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500">
                No citizen reports match the selected status and constituency.
              </div>
            ) : (
              filteredReports.map((rep) => {
                const area = CONSTITUENCIES.find((c) => c.id === rep.constituencyId);
                return (
                  <article key={rep.id} className="py-4 first:pt-2 last:pb-0 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-slate-500">
                        {rep.referenceCode} · {area?.name} · {rep.category}
                      </span>
                      <ReportStatusText status={rep.status} />
                    </div>

                    <h3 className="font-display text-base font-bold text-[#102A43]">
                      {rep.title}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{rep.location}</span>
                    </p>

                    <p className="text-sm text-[#334E68] leading-relaxed">
                      {rep.description}
                    </p>

                    {rep.photoDataUrl && (
                      <div className="h-32 w-48 rounded-lg overflow-hidden border border-slate-200 mt-2">
                        <img
                          src={rep.photoDataUrl}
                          alt={rep.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {rep.officialNote && (
                      <p className="text-xs text-[#087E8B] bg-[#087E8B]/5 px-3 py-2 rounded-lg">
                        {rep.officialNote}
                      </p>
                    )}

                    <div className="text-[11px] text-slate-400">
                      Reported by {rep.submittedBy} · {rep.submittedDate}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
