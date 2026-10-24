import type { User, Visit, Attendance, Lead, NotificationItem, DailySummaryStats } from '../types';

export interface ITrackoraApiService {
  // Authentication & Users
  getCurrentUser(): Promise<User>;
  switchUser(userId: string): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Attendance
  getAttendanceForDate(date: string): Promise<Attendance[]>;
  getUserAttendance(userId: string, date: string): Promise<Attendance | null>;
  markAttendance(userId: string, location: { lat: number; lng: number; addressText: string }): Promise<Attendance>;

  // Visits
  getVisits(filter?: { date?: string; userId?: string; status?: string }): Promise<Visit[]>;
  getVisitById(visitId: string): Promise<Visit | null>;
  createVisit(visit: Omit<Visit, 'id' | 'idempotencyKey' | 'timestamp' | 'status'>): Promise<Visit>;
  approveVisit(visitId: string, managerId: string, managerName: string): Promise<Visit>;
  rejectVisit(visitId: string, managerId: string, managerName: string, reason: string): Promise<Visit>;
  batchApproveVisits(visitIds: string[], managerId: string, managerName: string): Promise<Visit[]>;

  // Leads & Pipeline
  getLeads(): Promise<Lead[]>;
  updateLeadStage(leadId: string, stage: Lead['stage']): Promise<Lead>;

  // Gamification & Standings
  getLeaderboard(periodMonth?: string): Promise<{ user: User; rank: number; approvedCount: number; pendingCount: number }[]>;

  // Analytics & Summary
  getDailySummaryStats(date: string): Promise<DailySummaryStats>;

  // Notifications
  getNotifications(): Promise<NotificationItem[]>;
  markNotificationAsRead(id: string): Promise<void>;
  sendSimulatedNudge(): Promise<NotificationItem>;
}
