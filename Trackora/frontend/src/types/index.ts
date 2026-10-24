// ============================================================
// Trackora — Core Type Definitions & API Contracts
// ============================================================

export type UserRole = 'salesperson' | 'manager' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  teamId: string;
  teamName: string;
  avatarText: string;
  avatarUrl?: string;
  targetMonthlyVisits: number;
  approvedVisitsThisMonth: number;
  revenueGeneratedINR: number;
  isActive: boolean;
  createdAt: string;
}

export interface Attendance {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // ISO-8601
  checkOutTime?: string;
  status: 'present' | 'late' | 'absent' | 'half_day';
  location: {
    lat: number;
    lng: number;
    accuracyMeters: number;
    addressText: string;
    isMocked: boolean;
  };
  deviceInfo: {
    platform: 'android' | 'ios' | 'web';
    deviceId: string;
    batteryLevel?: number;
  };
}

export type MeetingType = 'New' | 'Follow-up' | 'Cold Call' | 'In-Person';
export type VisitStatus = 'draft' | 'pending' | 'approved' | 'rejected';
export type LeadStage = 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';

export interface Client {
  id: string;
  name: string;
  phone: string;
  state: string; // Emirate or State: e.g., "Dubai", "Abu Dhabi", "Sharjah"
  city: string;
  area: string; // e.g., "Business Bay", "Deira", "Al Barsha"
  clientType: 'new' | 'existing';
  coordinates: {
    lat: number;
    lng: number;
  };
  createdById: string;
}

export interface ContactPerson {
  id: string;
  clientId: string;
  name: string;
  roleTitle: string;
  phone: string;
  email: string;
}

export interface Visit {
  id: string;
  idempotencyKey: string;
  userId: string;
  userName: string;
  userAvatar: string;
  clientId: string;
  clientName: string;
  contactPersonName: string;
  contactPersonRole: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO
  state: string; // Indian State/Region (e.g. Tamil Nadu, Karnataka, Maharashtra)
  area: string;  // e.g. T. Nagar, Guindy, Whitefield, BKC
  meetingType: MeetingType;
  status: VisitStatus;
  estimatedDealSizeINR: number;
  notes: string;
  hasAudioNote: boolean;
  audioDurationSeconds?: number;
  photoUrl?: string;
  location: {
    lat: number;
    lng: number;
    accuracyMeters: number;
    isMocked: boolean;
    distanceFromClientMeters: number;
  };
  approvalDetails?: {
    action: 'approved' | 'rejected';
    managerId: string;
    managerName: string;
    timestamp: string;
    rejectionReason?: string;
  };
}

export interface Lead {
  id: string;
  company: string;
  contact: string;
  stage: LeadStage;
  valueINR: number;
  probability: number;
  source: 'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Trade Show';
  ownerName: string;
  ownerId: string;
  nextActionDate: string;
}

export interface NotificationItem {
  id: string;
  type: 'lead' | 'reminder' | 'target' | 'assigned' | 'nudge';
  title: string;
  body: string;
  timestamp: string;
  timeAgo: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface TargetProgress {
  userId: string;
  userName: string;
  targetVisits: number;
  approvedVisits: number;
  pendingVisits: number;
  rank: number;
  revenueINR: number;
  rewardTier: string;
}

export interface DailySummaryStats {
  totalReps: number;
  checkedInToday: number;
  totalVisitsLogged: number;
  approvedVisits: number;
  pendingVisits: number;
  rejectedVisits: number;
  totalPipelineINR: number;
  hotLeadsCount: number;
}
