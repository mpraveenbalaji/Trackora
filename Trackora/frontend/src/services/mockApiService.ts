import type { ITrackoraApiService } from './apiContract';
import type { User, Visit, Attendance, Lead, NotificationItem, DailySummaryStats } from '../types';
import {
  MOCK_USERS,
  INITIAL_ATTENDANCE,
  INITIAL_VISITS,
  INITIAL_LEADS,
  INITIAL_NOTIFICATIONS,
  TODAY_DATE,
} from '../lib/mock-data/initialData';

const STORAGE_KEYS = {
  USERS: 'trackora_users_in_v2',
  CURRENT_USER_ID: 'trackora_current_user_id_in_v2',
  ATTENDANCE: 'trackora_attendance_in_v2',
  VISITS: 'trackora_visits_in_v2',
  LEADS: 'trackora_leads_in_v2',
  NOTIFICATIONS: 'trackora_notifications_in_v2',
};

class MockApiService implements ITrackoraApiService {
  private users: User[] = [];
  private currentUserId: string = 'u-1'; // Default Ahmed
  private attendance: Attendance[] = [];
  private visits: Visit[] = [];
  private leads: Lead[] = [];
  private notifications: NotificationItem[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      this.users = storedUsers ? JSON.parse(storedUsers) : [...MOCK_USERS];

      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      this.currentUserId = storedUser || 'u-1';

      const storedAtt = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      this.attendance = storedAtt ? JSON.parse(storedAtt) : [...INITIAL_ATTENDANCE];

      const storedVisits = localStorage.getItem(STORAGE_KEYS.VISITS);
      this.visits = storedVisits ? JSON.parse(storedVisits) : [...INITIAL_VISITS];

      const storedLeads = localStorage.getItem(STORAGE_KEYS.LEADS);
      this.leads = storedLeads ? JSON.parse(storedLeads) : [...INITIAL_LEADS];

      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      this.notifications = storedNotifs ? JSON.parse(storedNotifs) : [...INITIAL_NOTIFICATIONS];
    } catch {
      this.users = [...MOCK_USERS];
      this.attendance = [...INITIAL_ATTENDANCE];
      this.visits = [...INITIAL_VISITS];
      this.leads = [...INITIAL_LEADS];
      this.notifications = [...INITIAL_NOTIFICATIONS];
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, this.currentUserId);
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(this.attendance));
      localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(this.visits));
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(this.leads));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
    } catch (err) {
      console.warn('LocalStorage save failed', err);
    }
  }

  // --- Users & Auth ---
  async getCurrentUser(): Promise<User> {
    const user = this.users.find(u => u.id === this.currentUserId) || this.users[0];
    return { ...user };
  }

  async switchUser(userId: string): Promise<User> {
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    this.currentUserId = user.id;
    this.save();
    return { ...user };
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  // --- Attendance ---
  async getAttendanceForDate(date: string): Promise<Attendance[]> {
    return this.attendance.filter(a => a.date === date);
  }

  async getUserAttendance(userId: string, date: string): Promise<Attendance | null> {
    const found = this.attendance.find(a => a.userId === userId && a.date === date);
    return found ? { ...found } : null;
  }

  async markAttendance(userId: string, loc: { lat: number; lng: number; addressText: string }): Promise<Attendance> {
    const existingIndex = this.attendance.findIndex(a => a.userId === userId && a.date === TODAY_DATE);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      this.attendance[existingIndex] = {
        ...this.attendance[existingIndex],
        checkOutTime: now,
      };
      this.save();
      return this.attendance[existingIndex];
    }

    const newAttendance: Attendance = {
      id: 'att-' + Date.now(),
      userId,
      date: TODAY_DATE,
      checkInTime: now,
      status: 'present',
      location: {
        lat: loc.lat,
        lng: loc.lng,
        accuracyMeters: 6,
        addressText: loc.addressText,
        isMocked: false,
      },
      deviceInfo: {
        platform: 'web',
        deviceId: 'Browser-Client',
      },
    };

    this.attendance.unshift(newAttendance);
    this.save();
    return newAttendance;
  }

  // --- Visits ---
  async getVisits(filter?: { date?: string; userId?: string; status?: string }): Promise<Visit[]> {
    let result = [...this.visits];
    if (filter?.date) {
      result = result.filter(v => v.date === filter.date);
    }
    if (filter?.userId) {
      result = result.filter(v => v.userId === filter.userId);
    }
    if (filter?.status) {
      result = result.filter(v => v.status === filter.status);
    }
    return result;
  }

  async getVisitById(visitId: string): Promise<Visit | null> {
    const v = this.visits.find(item => item.id === visitId);
    return v ? { ...v } : null;
  }

  async createVisit(payload: Omit<Visit, 'id' | 'idempotencyKey' | 'timestamp' | 'status'>): Promise<Visit> {
    const newVisit: Visit = {
      ...payload,
      id: 'v-' + Date.now(),
      idempotencyKey: 'idem-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      status: 'pending', // Starts as pending until manager approves
    };

    this.visits.unshift(newVisit);

    // Add manager notification
    this.notifications.unshift({
      id: 'notif-' + Date.now(),
      type: 'lead',
      title: 'New Visit Submitted for Review',
      body: `${payload.userName} logged visit to ${payload.clientName} (${payload.state}).`,
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      isRead: false,
    });

    this.save();
    return newVisit;
  }

  async approveVisit(visitId: string, managerId: string, managerName: string): Promise<Visit> {
    const index = this.visits.findIndex(v => v.id === visitId);
    if (index === -1) throw new Error('Visit not found');

    const v = this.visits[index];
    v.status = 'approved';
    v.approvalDetails = {
      action: 'approved',
      managerId,
      managerName,
      timestamp: new Date().toISOString(),
    };

    // Increment user's approved visits count
    const userIndex = this.users.findIndex(u => u.id === v.userId);
    if (userIndex >= 0) {
      this.users[userIndex].approvedVisitsThisMonth += 1;
    }

    // Add notification for the rep
    this.notifications.unshift({
      id: 'notif-' + Date.now(),
      type: 'target',
      title: 'Visit Approved! (+1 to Quota)',
      body: `Your visit to ${v.clientName} was approved by ${managerName}.`,
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      isRead: false,
    });

    this.save();
    return { ...v };
  }

  async rejectVisit(visitId: string, managerId: string, managerName: string, reason: string): Promise<Visit> {
    const index = this.visits.findIndex(v => v.id === visitId);
    if (index === -1) throw new Error('Visit not found');

    const v = this.visits[index];
    v.status = 'rejected';
    v.approvalDetails = {
      action: 'rejected',
      managerId,
      managerName,
      timestamp: new Date().toISOString(),
      rejectionReason: reason,
    };

    // Add notification for the rep
    this.notifications.unshift({
      id: 'notif-' + Date.now(),
      type: 'reminder',
      title: 'Visit Requires Review / Correction',
      body: `Visit to ${v.clientName} was rejected: "${reason}". Tap to resubmit.`,
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      isRead: false,
    });

    this.save();
    return { ...v };
  }

  async batchApproveVisits(visitIds: string[], managerId: string, managerName: string): Promise<Visit[]> {
    const approved: Visit[] = [];
    for (const id of visitIds) {
      try {
        const v = await this.approveVisit(id, managerId, managerName);
        approved.push(v);
      } catch (err) {
        console.error('Failed to approve', id, err);
      }
    }
    return approved;
  }

  // --- Leads ---
  async getLeads(): Promise<Lead[]> {
    return [...this.leads];
  }

  async updateLeadStage(leadId: string, stage: Lead['stage']): Promise<Lead> {
    const l = this.leads.find(item => item.id === leadId);
    if (!l) throw new Error('Lead not found');
    l.stage = stage;
    this.save();
    return { ...l };
  }

  // --- Gamification & Leaderboard ---
  async getLeaderboard(): Promise<{ user: User; rank: number; approvedCount: number; pendingCount: number }[]> {
    const reps = this.users.filter(u => u.role === 'salesperson');

    const mapped = reps.map(rep => {
      const repVisits = this.visits.filter(v => v.userId === rep.id);
      const approvedCount = repVisits.filter(v => v.status === 'approved').length;
      const pendingCount = repVisits.filter(v => v.status === 'pending').length;
      return {
        user: rep,
        approvedCount,
        pendingCount,
        rank: 1,
      };
    });

    // Sort descending by approvedCount
    mapped.sort((a, b) => b.approvedCount - a.approvedCount || b.user.revenueGeneratedINR - a.user.revenueGeneratedINR);

    // Assign rank
    return mapped.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  }

  // --- Daily Summary Stats ---
  async getDailySummaryStats(date: string): Promise<DailySummaryStats> {
    const reps = this.users.filter(u => u.role === 'salesperson');
    const attForDate = this.attendance.filter(a => a.date === date);
    const visitsForDate = this.visits.filter(v => v.date === date);

    const approved = visitsForDate.filter(v => v.status === 'approved').length;
    const pending = visitsForDate.filter(v => v.status === 'pending').length;
    const rejected = visitsForDate.filter(v => v.status === 'rejected').length;
    const pipeline = visitsForDate.reduce((sum, v) => sum + v.estimatedDealSizeINR, 0);

    return {
      totalReps: reps.length,
      checkedInToday: attForDate.length,
      totalVisitsLogged: visitsForDate.length,
      approvedVisits: approved,
      pendingVisits: pending,
      rejectedVisits: rejected,
      totalPipelineINR: pipeline,
      hotLeadsCount: this.leads.filter(l => l.stage === 'Negotiation' || l.stage === 'Proposal').length,
    };
  }

  // --- Notifications ---
  async getNotifications(): Promise<NotificationItem[]> {
    return [...this.notifications];
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const n = this.notifications.find(item => item.id === id);
    if (n) {
      n.isRead = true;
      this.save();
    }
  }

  async sendSimulatedNudge(): Promise<NotificationItem> {
    const nudge: NotificationItem = {
      id: 'nudge-' + Date.now(),
      type: 'nudge',
      title: '🔥 Live 5:30 PM Sales Sprint Alert!',
      body: 'Only 30 minutes left before daily report generation! Log your final visit to climb into the Top 3 podium!',
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      isRead: false,
    };
    this.notifications.unshift(nudge);
    this.save();
    return nudge;
  }
}

export const mockApiService = new MockApiService();
