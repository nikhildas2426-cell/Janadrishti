export type PageId =
  | 'home'
  | 'representatives'
  | 'works'
  | 'schemes'
  | 'map'
  | 'services'
  | 'about'
  | 'login'
  | 'register'
  | 'dashboard';

export type ConstituencyId =
  | 'mangaluru'
  | 'bengaluru'
  | 'mysuru'
  | 'udupi'
  | 'shivamogga'
  | 'kalaburagi';

export interface ConstituencyInfo {
  id: ConstituencyId;
  name: string;
  constituencyName: string;
  district: string;
  state: string;
  pinCodes: string[];
  localities: string[];
  wardsCount: number;
  populationApprox: string;
  mapSubtitle: string;
  summary: string;
  zones: {
    id: string;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  facilities: PublicFacility[];
}

export interface PublicFacility {
  id: string;
  name: string;
  type: 'School' | 'Hospital' | 'Road Corridor' | 'Water Station';
  ward: string;
  x: number;
  y: number;
  statusNote: string;
}

export type RepresentativeGroup = 'Elected Representative' | 'Government Officer';

export type RepresentativeDesignation =
  | 'Member of Legislative Assembly (MLA)'
  | 'Member of Parliament (MP)'
  | 'Member of Legislative Council (MLC)'
  | 'Mayor / Municipal Corporation Representative'
  | 'Municipal Councillor'
  | 'Zilla Panchayat Member'
  | 'Taluk Panchayat Member'
  | 'Gram Panchayat Representative'
  | 'Deputy Commissioner (DC)'
  | 'Assistant Commissioner (AC)'
  | 'Tahsildar'
  | 'Chief Executive Officer (Zilla Panchayat)'
  | 'Municipal Commissioner'
  | 'Panchayat Development Officer (PDO)'
  | 'District-Level Department Officer'
  | 'Public Works Department (PWD) Officer';

export interface RepresentativeProfile {
  id: string;
  constituencyId: ConstituencyId;
  name: string;
  initials: string;
  group: RepresentativeGroup;
  designation: RepresentativeDesignation;
  department: string;
  areaOfResponsibility: string;
  officeAddress: string;
  contactPhone: string;
  contactEmail: string;
  officeHours: string;
  portalUrl: string;
  termOrBatch: string;
  bio: string;
}

export type ProjectCategory =
  | 'Roads and Highways'
  | 'Drinking Water'
  | 'Drainage and Sanitation'
  | 'Education'
  | 'Healthcare'
  | 'Electricity'
  | 'Housing'
  | 'Rural Development'
  | 'Public Infrastructure';

export type ProjectStatus =
  | 'Proposed'
  | 'Approved'
  | 'In Progress'
  | 'Completed'
  | 'Delayed';

export interface ProjectMilestone {
  date: string;
  title: string;
  status: 'done' | 'current' | 'upcoming';
  note: string;
}

export interface ProjectDocument {
  id: string;
  title: string;
  docType: string;
  date: string;
  refNumber: string;
  summary: string;
}

export interface DevelopmentProject {
  id: string;
  constituencyId: ConstituencyId;
  name: string;
  location: string;
  category: ProjectCategory;
  department: string;
  responsibleAuthority: string;
  sanctionedAmountCr: number;
  releasedAmountCr: number;
  expenditureCr: number;
  startDate: string;
  expectedCompletionDate: string;
  lastUpdated: string;
  status: ProjectStatus;
  imageUrl: string;
  description: string;
  contractor: string;
  workOrderId: string;
  fundingSplit: {
    label: string;
    percent: number;
  }[];
  coordinates: {
    x: number;
    y: number;
  };
  timeline: ProjectMilestone[];
  documents: ProjectDocument[];
}

export type SchemeCategory =
  | 'Education and Scholarships'
  | 'Farmers and Agriculture'
  | 'Women Empowerment'
  | 'Employment and Skill Development'
  | 'Housing'
  | 'Healthcare'
  | 'Senior Citizens'
  | 'Financial Assistance'
  | 'Small Businesses'
  | 'Rural Development';

export type SchemeLevel = 'State Government' | 'Central Government' | 'District-Specific';

export type SchemeApplicationStatus = 'Open' | 'Closed' | 'Status Unknown';

export interface GovernmentScheme {
  id: string;
  name: string;
  level: SchemeLevel;
  applicableConstituencies: ConstituencyId[] | 'all';
  category: SchemeCategory;
  department: string;
  briefDescription: string;
  eligibilityCriteria: string[];
  eligibilityRules: {
    maxIncomeLakhs?: number;
    minAge?: number;
    maxAge?: number;
    occupations?: string[];
    womenOnly?: boolean;
  };
  benefitsProvided: string;
  requiredDocuments: string[];
  applicationProcess: string[];
  deadline: string;
  applicationStatus: SchemeApplicationStatus;
  officialPortalUrl: string;
  portalLabel: string;
}

export type CitizenReportStatus = 'Submitted' | 'Under Review' | 'Forwarded' | 'Resolved';

export interface CitizenReport {
  id: string;
  referenceCode: string;
  constituencyId: ConstituencyId;
  title: string;
  category: ProjectCategory;
  location: string;
  description: string;
  submittedDate: string;
  submittedBy: string;
  status: CitizenReportStatus;
  photoDataUrl?: string;
  officialNote?: string;
}

export interface CitizenAnnouncement {
  id: string;
  constituencyId: ConstituencyId;
  title: string;
  department: string;
  date: string;
  summary: string;
}

export interface CitizenUser {
  fullName: string;
  voterId: string;
  mobile: string;
  email: string;
  constituencyId: ConstituencyId;
  wardOrLocality: string;
}
