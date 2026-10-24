import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Visit, Attendance, Lead, NotificationItem, DailySummaryStats } from '../types';
import { mockApiService } from '../services/mockApiService';
import { TODAY_DATE, YESTERDAY_DATE } from '../lib/mock-data/initialData';

interface AppContextType {
  currentUser: User | null;
  allUsers: User[];
  activeDate: string;
  setActiveDate: (date: string) => void;
  availableDates: string[];
  userAttendance: Attendance | null;
  visits: Visit[];
  leads: Lead[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  stats: DailySummaryStats | null;
  leaderboard: { user: User; rank: number; approvedCount: number; pendingCount: number }[];
  isOfflineMode: boolean;
  setIsOfflineMode: (offline: boolean) => void;
  isSimulatedMobileView: boolean;
  setIsSimulatedMobileView: (mobile: boolean) => void;
  switchUser: (userId: string) => Promise<void>;
  markAttendance: () => Promise<void>;
  logNewVisit: (visit: Omit<Visit, 'id' | 'idempotencyKey' | 'timestamp' | 'status'>) => Promise<void>;
  approveVisit: (visitId: string) => Promise<void>;
  rejectVisit: (visitId: string, reason: string) => Promise<void>;
  batchApproveVisits: (visitIds: string[]) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  triggerNudge: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeDate, setActiveDate] = useState<string>(TODAY_DATE);
  const [availableDates] = useState<string[]>([TODAY_DATE, YESTERDAY_DATE, '2026-10-21']);
  const [userAttendance, setUserAttendance] = useState<Attendance | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [stats, setStats] = useState<DailySummaryStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<{ user: User; rank: number; approvedCount: number; pendingCount: number }[]>([]);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [isSimulatedMobileView, setIsSimulatedMobileView] = useState<boolean>(false);

  const refreshAllData = useCallback(async () => {
    try {
      const u = await mockApiService.getCurrentUser();
      const users = await mockApiService.getAllUsers();
      setCurrentUser(u);
      setAllUsers(users);

      const att = await mockApiService.getUserAttendance(u.id, activeDate);
      setUserAttendance(att);

      const v = await mockApiService.getVisits({ date: activeDate });
      setVisits(v);

      const l = await mockApiService.getLeads();
      setLeads(l);

      const n = await mockApiService.getNotifications();
      setNotifications(n);

      const s = await mockApiService.getDailySummaryStats(activeDate);
      setStats(s);

      const lb = await mockApiService.getLeaderboard();
      setLeaderboard(lb);
    } catch (err) {
      console.error('Error refreshing data', err);
    }
  }, [activeDate]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  const switchUser = async (userId: string) => {
    const newUser = await mockApiService.switchUser(userId);
    setCurrentUser(newUser);
    await refreshAllData();
  };

  const markAttendance = async () => {
    if (!currentUser) return;
    await mockApiService.markAttendance(currentUser.id, {
      lat: 25.2048,
      lng: 55.2708,
      addressText: 'Downtown Dubai, Sheikh Mohammed bin Rashid Blvd',
    });
    await refreshAllData();
  };

  const logNewVisit = async (payload: Omit<Visit, 'id' | 'idempotencyKey' | 'timestamp' | 'status'>) => {
    await mockApiService.createVisit(payload);
    await refreshAllData();
  };

  const approveVisit = async (visitId: string) => {
    if (!currentUser) return;
    await mockApiService.approveVisit(visitId, currentUser.id, currentUser.name);
    await refreshAllData();
  };

  const rejectVisit = async (visitId: string, reason: string) => {
    if (!currentUser) return;
    await mockApiService.rejectVisit(visitId, currentUser.id, currentUser.name, reason);
    await refreshAllData();
  };

  const batchApproveVisits = async (visitIds: string[]) => {
    if (!currentUser) return;
    await mockApiService.batchApproveVisits(visitIds, currentUser.id, currentUser.name);
    await refreshAllData();
  };

  const markNotificationRead = async (id: string) => {
    await mockApiService.markNotificationAsRead(id);
    const n = await mockApiService.getNotifications();
    setNotifications(n);
  };

  const triggerNudge = async () => {
    await mockApiService.sendSimulatedNudge();
    const n = await mockApiService.getNotifications();
    setNotifications(n);
  };

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        activeDate,
        setActiveDate,
        availableDates,
        userAttendance,
        visits,
        leads,
        notifications,
        unreadNotifsCount,
        stats,
        leaderboard,
        isOfflineMode,
        setIsOfflineMode,
        isSimulatedMobileView,
        setIsSimulatedMobileView,
        switchUser,
        markAttendance,
        logNewVisit,
        approveVisit,
        rejectVisit,
        batchApproveVisits,
        markNotificationRead,
        triggerNudge,
        refreshAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
