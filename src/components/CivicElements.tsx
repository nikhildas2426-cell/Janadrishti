import React, { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  FileCheck2,
  HelpCircle,
  Send,
  XCircle,
} from 'lucide-react';
import {
  CitizenReportStatus,
  ProjectStatus,
  SchemeApplicationStatus,
} from '../types/jandrishti';

export function ProjectStatusText({ status }: { status: ProjectStatus }) {
  const config: Record<
    ProjectStatus,
    { color: string; icon: React.ReactNode; label: string }
  > = {
    Completed: {
      color: 'text-[#27966D]',
      icon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />,
      label: 'Completed',
    },
    'In Progress': {
      color: 'text-[#087E8B]',
      icon: <Clock className="w-3.5 h-3.5 shrink-0" />,
      label: 'In Progress',
    },
    Approved: {
      color: 'text-[#102A43]',
      icon: <FileCheck2 className="w-3.5 h-3.5 shrink-0" />,
      label: 'Approved',
    },
    Proposed: {
      color: 'text-[#9A6B16]',
      icon: <HelpCircle className="w-3.5 h-3.5 shrink-0" />,
      label: 'Proposed',
    },
    Delayed: {
      color: 'text-[#B91C1C]',
      icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0" />,
      label: 'Delayed',
    },
  };

  const item = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${item.color}`}>
      {item.icon}
      <span>{item.label}</span>
    </span>
  );
}

export function SchemeStatusText({ status }: { status: SchemeApplicationStatus }) {
  if (status === 'Open') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#27966D]">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        <span>Applications Open</span>
      </span>
    );
  }
  if (status === 'Closed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B91C1C]">
        <XCircle className="w-3.5 h-3.5 shrink-0" />
        <span>Applications Closed</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A6B16]">
      <HelpCircle className="w-3.5 h-3.5 shrink-0" />
      <span>Status Unknown</span>
    </span>
  );
}

export function ReportStatusText({ status }: { status: CitizenReportStatus }) {
  const styles: Record<
    CitizenReportStatus,
    { color: string; icon: React.ReactNode }
  > = {
    Submitted: {
      color: 'text-[#102A43]',
      icon: <Send className="w-3.5 h-3.5 shrink-0" />,
    },
    'Under Review': {
      color: 'text-[#9A6B16]',
      icon: <Clock className="w-3.5 h-3.5 shrink-0" />,
    },
    Forwarded: {
      color: 'text-[#087E8B]',
      icon: <FileCheck2 className="w-3.5 h-3.5 shrink-0" />,
    },
    Resolved: {
      color: 'text-[#27966D]',
      icon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />,
    },
  };
  const current = styles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${current.color}`}>
      {current.icon}
      <span>{status}</span>
    </span>
  );
}

export function ResilientPhoto({
  src,
  alt,
  className = '',
  fallbackTitle,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#102A43]/8 via-[#087E8B]/10 to-[#F4F8FA] text-[#102A43]/70 p-4 text-center ${className}`}
      >
        <Building2 className="w-8 h-8 mb-2 text-[#087E8B]" />
        <span className="text-xs font-medium">{fallbackTitle || alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export function DemoDataBanner({ context }: { context?: string }) {
  return (
    <div className="flex items-start gap-2.5 px-4 py-2.5 rounded-lg bg-[#102A43]/[0.04] border border-[#102A43]/12 text-xs text-[#334E68]">
      <AlertTriangle className="w-4 h-4 text-[#E5A93D] shrink-0 mt-0.5" />
      <p>
        <strong className="font-semibold text-[#102A43]">Demo Data – Not Official Government Information:</strong>{' '}
        {context ||
          'All project figures, sample representative profiles, scheme records, and reference IDs shown here are fictional prototype demonstrations for Karnataka constituencies.'}
      </p>
    </div>
  );
}
