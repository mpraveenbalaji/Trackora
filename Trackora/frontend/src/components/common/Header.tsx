import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Calendar,
  Smartphone,
  Monitor,
  Bell,
  Sparkles,
  Wifi,
  WifiOff,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC<{ onOpenNotifs: () => void }> = ({ onOpenNotifs }) => {
  const {
    currentUser,
    allUsers,
    switchUser,
    activeDate,
    setActiveDate,
    availableDates,
    unreadNotifsCount,
    isOfflineMode,
    setIsOfflineMode,
    isSimulatedMobileView,
    setIsSimulatedMobileView,
    triggerNudge,
  } = useApp();

  return (
    <header className="glass-nav sticky top-0 z-40 px-4 lg:px-8 py-3 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-md flex items-center justify-center p-1 border border-white/20 shrink-0"
            style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
          >
            <img
              src="/logo.jpeg"
              alt="Trackora"
              className="w-full h-full object-contain"
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl font-bold tracking-tight text-white">Trackora</span>
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white/90">
                {currentUser?.role === 'manager' ? 'Admin Center (India)' : 'Field Sales (India)'}
              </span>
            </div>
            <p className="text-[11px] text-white/70 hidden sm:block">
              Every Visit. Every Goal. Every Win.
            </p>
          </div>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Historical Date Picker */}
          <div className="flex items-center bg-black/20 hover:bg-black/30 rounded-lg px-2.5 py-1.5 border border-white/10 text-xs">
            <Calendar className="w-3.5 h-3.5 text-white/70 mr-1.5" />
            <span className="text-white/60 mr-1 hidden md:inline">Date:</span>
            <select
              value={activeDate}
              onChange={(e) => setActiveDate(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              {availableDates.map((d) => (
                <option key={d} value={d} className="bg-slate-800 text-white">
                  {d === '2026-10-23' ? `Today (${d})` : d === '2026-10-22' ? `Yesterday (${d})` : d}
                </option>
              ))}
            </select>
          </div>

          {/* Active Role Switcher */}
          <div className="flex items-center bg-black/20 hover:bg-black/30 rounded-lg px-2.5 py-1.5 border border-white/10 text-xs">
            <Users className="w-3.5 h-3.5 text-white/70 mr-1.5" />
            <span className="text-white/60 mr-1 hidden md:inline">Acting as:</span>
            <select
              value={currentUser?.id}
              onChange={(e) => switchUser(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-800 text-white">
                  {u.name} ({u.role === 'manager' ? 'Manager' : 'Rep'})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-white/50 ml-1 pointer-events-none" />
          </div>

          {/* Simulated Mobile View Toggle */}
          <button
            onClick={() => setIsSimulatedMobileView(!isSimulatedMobileView)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isSimulatedMobileView
                ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-sm'
                : 'bg-black/20 hover:bg-black/30 text-white border-white/10'
            }`}
            title="Toggle between full responsive layout and phone viewport simulator"
          >
            {isSimulatedMobileView ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile Frame</span>
              </>
            )}
          </button>

          {/* Test 5:30 PM Nudge Button */}
          <button
            onClick={triggerNudge}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 transition-all"
            title="Simulate the 5:30 PM Live Sales Standings Nudge"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden sm:inline">Test Nudge</span>
          </button>

          {/* Offline Mode Simulator Toggle */}
          <button
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isOfflineMode
                ? 'bg-rose-500/30 text-rose-200 border-rose-400'
                : 'bg-black/20 text-white/80 border-white/10'
            }`}
            title="Toggle offline simulated state"
          >
            {isOfflineMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifs}
            className="relative p-2 rounded-lg bg-black/20 hover:bg-black/30 border border-white/10 text-white transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
