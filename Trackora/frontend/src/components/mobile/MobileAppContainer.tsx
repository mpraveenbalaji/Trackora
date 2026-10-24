import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NewVisitModal } from './NewVisitModal';
import { AudioWavePlayer } from '../common/AudioWavePlayer';
import { INDIAN_STATES_LIST } from '../../lib/mock-data/initialData';
import {
  Home,
  Briefcase,
  PlusCircle,
  Users,
  User as UserIcon,
  Bell,
  MapPin,
  Calendar,
  Flame,
  Trophy,
  IndianRupee,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Mic,
  Moon,
  Globe,
} from 'lucide-react';

export const MobileAppContainer: React.FC<{ onOpenNotifs: () => void }> = ({ onOpenNotifs }) => {
  const {
    currentUser,
    userAttendance,
    visits,
    leads,
    leaderboard,
    activeDate,
    markAttendance,
    unreadNotifsCount,
    isOfflineMode,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'visits' | 'leads' | 'leaderboard' | 'profile'>('home');
  const [isNewVisitOpen, setIsNewVisitOpen] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);

  // Filter visits for current user (Data Isolation)
  const myVisits = visits.filter((v) => v.userId === currentUser?.id);
  const totalPipeline = myVisits.reduce((acc, v) => acc + v.estimatedDealSizeINR, 0);
  const todayVisitsCount = myVisits.length;
  const hotLeadsCount = leads.filter((l) => l.stage === 'Negotiation' || l.stage === 'Proposal').length;

  const selectedVisit = visits.find((v) => v.id === selectedVisitId);

  // Indian Rupee (INR) Formatter: Lakhs & Crores
  const formatINR = (amount: number) => {
    if (amount >= 10000000) return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹ ${(amount / 100000).toFixed(2)} Lakhs`;
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="w-full flex flex-col bg-slate-50 min-h-[700px] text-slate-800 relative">
      {/* Top Mobile Header */}
      <div className="bg-[#0b7a42] text-white pt-5 pb-5 px-5 rounded-b-3xl shadow-lg relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-white shadow-inner">
              {currentUser?.avatarText || 'PB'}
            </div>
            <div>
              <p className="text-[11px] text-emerald-100 flex items-center gap-1 font-medium">
                Namaste / Vanakkam 👋
              </p>
              <h2 className="font-heading text-xl font-extrabold tracking-tight">
                {currentUser?.name || 'Praveen Balaji'}
              </h2>
              <p className="text-[11px] text-white/80 font-medium">
                {currentUser?.teamName || 'Tamil Nadu & Pondicherry Team'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenNotifs}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center relative transition-all border border-white/10"
          >
            <Bell className="w-5 h-5 text-white" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                {unreadNotifsCount}
              </span>
            )}
          </button>
        </div>

        {/* Offline indicator badge if active */}
        {isOfflineMode && (
          <div className="mt-3 py-1.5 px-3 bg-amber-500/20 border border-amber-300/40 rounded-xl text-amber-200 text-xs font-semibold flex items-center justify-between">
            <span>Offline Mode Active • Visits cached in Indian SQLite</span>
            <span className="animate-pulse">● Ready to sync</span>
          </div>
        )}
      </div>

      {/* Main Tab Views */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4">
        {/* ===================== TAB 1: HOME ===================== */}
        {activeTab === 'home' && (
          <>
            {/* Daily Attendance Card */}
            <div className="trackora-card p-4 bg-white border border-slate-100 shadow-sm rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="font-heading font-bold text-sm text-slate-800">
                    Daily Geo-Attendance (India)
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-400">{activeDate}</span>
              </div>

              {userAttendance ? (
                <div className="flex items-center justify-between bg-emerald-50/80 border border-emerald-200 rounded-xl p-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Check-In Verified</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      {new Date(userAttendance.checkInTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      • {userAttendance.location.addressText}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Present
                  </span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">Attendance Not Marked Yet</p>
                    <p className="text-[11px] text-slate-500">Tap below to capture Indian GPS location</p>
                  </div>
                  <button
                    onClick={markAttendance}
                    className="w-full sm:w-auto px-4 py-2 bg-[#0b7a42] hover:bg-[#086134] text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Check In Now</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4 Stat Boxes (INR localized) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="trackora-card p-3.5 border-l-4 border-l-emerald-500 rounded-2xl bg-white shadow-sm">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                  <IndianRupee className="w-4 h-4 text-emerald-700" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  Pipeline
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-800 mt-0.5">
                  {formatINR(totalPipeline || 14200000)}
                </h3>
                <span className="text-[10px] font-semibold text-emerald-600">+18% MoM</span>
              </div>

              <div className="trackora-card p-3.5 border-l-4 border-l-blue-500 rounded-2xl bg-white shadow-sm">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <Calendar className="w-4 h-4 text-blue-700" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  Today
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-800 mt-0.5">
                  {todayVisitsCount}
                </h3>
                <span className="text-[10px] font-semibold text-blue-600">Visits logged</span>
              </div>

              <div className="trackora-card p-3.5 border-l-4 border-l-amber-500 rounded-2xl bg-white shadow-sm">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                  <Flame className="w-4 h-4 text-amber-700" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  Hot Leads
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-800 mt-0.5">
                  {hotLeadsCount || 4}
                </h3>
                <span className="text-[10px] font-semibold text-amber-600">Active</span>
              </div>

              <div className="trackora-card p-3.5 border-l-4 border-l-purple-500 rounded-2xl bg-white shadow-sm">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <Trophy className="w-4 h-4 text-purple-700" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  Target Rank
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-800 mt-0.5">
                  #1
                </h3>
                <span className="text-[10px] font-semibold text-purple-600">All India Podium</span>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="trackora-card p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <h4 className="font-heading font-bold text-sm text-slate-800 mb-3">Quick Actions</h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <button
                  onClick={() => setIsNewVisitOpen(true)}
                  className="flex flex-col items-center p-2 rounded-xl hover:bg-emerald-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-sm">
                    <PlusCircle className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">New Visit</span>
                </button>

                <button
                  onClick={() => setActiveTab('leads')}
                  className="flex flex-col items-center p-2 rounded-xl hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-sm">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">Leads</span>
                </button>

                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className="flex flex-col items-center p-2 rounded-xl hover:bg-amber-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-sm">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">Targets</span>
                </button>

                <button
                  onClick={() => setActiveTab('visits')}
                  className="flex flex-col items-center p-2 rounded-xl hover:bg-purple-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-sm">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">All Visits</span>
                </button>
              </div>
            </div>

            {/* Recent Visits in India */}
            <div className="trackora-card p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-heading font-bold text-sm text-slate-800">Recent Visits</h4>
                <button
                  onClick={() => setActiveTab('visits')}
                  className="text-xs font-semibold text-[#0b7a42] hover:underline"
                >
                  See all ({myVisits.length})
                </button>
              </div>

              <div className="space-y-2.5 divide-y divide-slate-100">
                {myVisits.slice(0, 3).map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVisitId(v.id)}
                    className="pt-2.5 first:pt-0 flex items-center justify-between hover:bg-slate-50 p-2 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100/80 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                        {v.clientName.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm text-slate-800">{v.clientName}</h5>
                        <p className="text-xs text-slate-500">
                          {v.contactPersonName} • {v.area}, {v.state}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-emerald-700">
                        {formatINR(v.estimatedDealSizeINR)}
                      </p>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          v.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {v.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visits by State Progress (India) */}
            <div className="trackora-card p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <h4 className="font-heading font-bold text-sm text-slate-800 mb-3">
                Visits by State (India)
              </h4>
              <div className="space-y-3">
                {INDIAN_STATES_LIST.slice(0, 5).map((st) => {
                  const count = myVisits.filter((v) => v.state === st).length;
                  const pct = Math.min((count / 5) * 100, 100);
                  return (
                    <div key={st}>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>{st}</span>
                        <span className="text-slate-500">{count} visits</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#0b7a42] h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct || 15}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ===================== TAB 2: ALL VISITS ===================== */}
        {activeTab === 'visits' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-slate-800">My Field Visits (India)</h3>
              <button
                onClick={() => setIsNewVisitOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#0b7a42] text-white text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Visit</span>
              </button>
            </div>

            {myVisits.length === 0 ? (
              <div className="trackora-card p-8 text-center text-slate-400 bg-white rounded-2xl">
                <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold">No visits logged for {activeDate}</p>
                <button
                  onClick={() => setIsNewVisitOpen(true)}
                  className="mt-3 px-4 py-2 bg-[#0b7a42] text-white rounded-xl text-xs font-bold"
                >
                  Log Your First Visit
                </button>
              </div>
            ) : (
              myVisits.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVisitId(v.id)}
                  className="trackora-card p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-[#0b7a42] transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-base text-slate-800">
                        {v.clientName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {v.contactPersonName} • {v.contactPersonPhone}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        v.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : v.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {v.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                      {v.meetingType}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {v.state}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                      {v.area}
                    </span>
                    {v.hasAudioNote && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-medium flex items-center gap-1">
                        <Mic className="w-3 h-3" /> Voice Note
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                    <span className="font-heading font-bold text-emerald-700 text-sm">
                      {formatINR(v.estimatedDealSizeINR)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(v.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ===================== TAB 3: LEADS PIPELINE ===================== */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg text-slate-800">Leads Pipeline (India)</h3>

            {/* Pipeline Funnel Bars */}
            <div className="trackora-card p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
              <h4 className="font-heading font-bold text-sm text-slate-700">Pipeline Overview</h4>
              {[
                { stage: 'New', count: 3, val: 3500000, color: 'bg-blue-500' },
                { stage: 'Qualified', count: 3, val: 5500000, color: 'bg-purple-500' },
                { stage: 'Proposal', count: 3, val: 9200000, color: 'bg-amber-500' },
                { stage: 'Negotiation', count: 3, val: 2200000, color: 'bg-orange-500' },
                { stage: 'Closed Won', count: 3, val: 6500000, color: 'bg-emerald-500' },
                { stage: 'Closed Lost', count: 3, val: 1500000, color: 'bg-rose-500' },
              ].map((s) => (
                <div key={s.stage}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">{s.stage}</span>
                    <span className="text-slate-500">
                      {s.count} • {formatINR(s.val)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`${s.color} h-full rounded-full w-2/3`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Leads List */}
            <div className="space-y-3">
              {leads.map((l) => (
                <div
                  key={l.id}
                  className="trackora-card p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-slate-800">{l.company}</h4>
                      <p className="text-xs text-slate-500">{l.contact}</p>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                      {l.stage}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs">
                    <span className="font-bold text-emerald-700">{formatINR(l.valueINR)}</span>
                    <span className="text-slate-400">
                      {l.probability}% • {l.ownerName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: LEADERBOARD & TARGETS ===================== */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg text-slate-800">Sales Targets & Standings (All India)</h3>

            {/* Monthly Target Quota Card */}
            <div className="trackora-card p-5 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                MONTHLY TARGET
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-[#0b7a42] mt-1">
                {formatINR(42500000)}
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-1">of {formatINR(50000000)}</p>

              <div className="w-full bg-slate-100 h-3 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#0b7a42] h-full rounded-full w-[88%]" />
              </div>
              <p className="text-xs font-bold text-emerald-700 mt-2">88% achieved • 6 visits to unlock ₹50,000 cash bonus prize</p>
            </div>

            {/* Team Performance Leaderboard */}
            <div className="trackora-card p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <h4 className="font-heading font-bold text-sm text-slate-800 mb-3">
                Team Performance
              </h4>

              <div className="space-y-3">
                {leaderboard.map((item, idx) => (
                  <div
                    key={item.user.id}
                    className={`p-3 rounded-xl border transition-all ${
                      item.user.id === currentUser?.id
                        ? 'bg-emerald-50/80 border-emerald-200 shadow-sm'
                        : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            idx === 0
                              ? 'bg-amber-400 text-white shadow-sm'
                              : idx === 1
                              ? 'bg-slate-300 text-slate-700'
                              : idx === 2
                              ? 'bg-amber-700/60 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.rank}
                        </span>
                        <span className="font-semibold text-sm text-slate-800">
                          {item.user.name} {item.user.id === currentUser?.id && '(You)'}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-600">
                        {((item.user.revenueGeneratedINR / 50000000) * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1">
                      <div
                        className={`h-full rounded-full ${idx === 0 ? 'bg-amber-400' : 'bg-[#0b7a42]'}`}
                        style={{ width: `${Math.min((item.approvedCount / 50) * 100, 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>{formatINR(item.user.revenueGeneratedINR)}</span>
                      <span>{item.approvedCount} approved visits</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 5: PROFILE & SETTINGS ===================== */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* User Profile Card */}
            <div className="trackora-card p-5 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
              <div className="w-20 h-20 rounded-full bg-[#0b7a42] text-white flex items-center justify-center font-heading font-bold text-2xl mx-auto shadow-md mb-3">
                {currentUser?.avatarText || 'PB'}
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-800">{currentUser?.name}</h3>
              <p className="text-xs text-slate-500">{currentUser?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                {currentUser?.role}
              </span>
            </div>

            {/* Preferences */}
            <div className="trackora-card p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
              <h4 className="font-heading font-bold text-sm text-slate-700">Preferences</h4>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-[#0b7a42]" />
                  <span className="text-sm font-medium text-slate-700">Push Notifications</span>
                </div>
                <input type="checkbox" defaultChecked className="toggle-switch accent-[#0b7a42] w-4 h-4" />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Moon className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Dark Mode</span>
                </div>
                <input type="checkbox" className="toggle-switch w-4 h-4" />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-[#0b7a42]" />
                  <span className="text-sm font-medium text-slate-700">Regional Language (Tamil / Hindi)</span>
                </div>
                <input type="checkbox" className="toggle-switch w-4 h-4" />
              </div>
            </div>

            {/* Account Links */}
            <div className="trackora-card p-4 rounded-2xl bg-white border border-slate-100 shadow-sm divide-y divide-slate-100 text-sm">
              <div className="py-2.5 flex items-center justify-between hover:text-[#0b7a42] cursor-pointer">
                <span>Edit Profile</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div className="py-2.5 flex items-center justify-between hover:text-[#0b7a42] cursor-pointer">
                <span>Change Password</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div className="py-2.5 flex items-center justify-between hover:text-[#0b7a42] cursor-pointer">
                <span>Indian Offline Sync Status</span>
                <span className="text-xs text-emerald-600 font-semibold">100% Synced</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Tab Bar */}
      <div className="fixed sm:sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 text-xs font-semibold transition-colors ${
            activeTab === 'home' ? 'text-[#0b7a42]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('visits')}
          className={`flex flex-col items-center gap-0.5 text-xs font-semibold transition-colors ${
            activeTab === 'visits' ? 'text-[#0b7a42]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span>Visits</span>
        </button>

        {/* Big Center [+] Button */}
        <button
          onClick={() => setIsNewVisitOpen(true)}
          className="w-12 h-12 -mt-5 rounded-full bg-[#0b7a42] hover:bg-[#086134] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        >
          <PlusCircle className="w-7 h-7" />
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`flex flex-col items-center gap-0.5 text-xs font-semibold transition-colors ${
            activeTab === 'leads' ? 'text-[#0b7a42]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Leads</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 text-xs font-semibold transition-colors ${
            activeTab === 'profile' ? 'text-[#0b7a42]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span>Me</span>
        </button>
      </div>

      {/* New Visit Modal */}
      <NewVisitModal isOpen={isNewVisitOpen} onClose={() => setIsNewVisitOpen(false)} />

      {/* Visit Detail Dialog */}
      {selectedVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="bg-[#0b7a42] text-white p-5 flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg">Visit Details</h3>
              <button
                onClick={() => setSelectedVisitId(null)}
                className="p-1 rounded-full hover:bg-white/10"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-sm">
              <div className="text-center pb-3 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-heading font-bold text-2xl mx-auto mb-2">
                  {selectedVisit.clientName.charAt(0)}
                </div>
                <h4 className="font-heading font-bold text-lg text-slate-800">
                  {selectedVisit.clientName}
                </h4>
                <p className="text-xs text-slate-500">{selectedVisit.area}, {selectedVisit.state}</p>
                <p className="font-heading font-extrabold text-2xl text-emerald-700 mt-2">
                  {formatINR(selectedVisit.estimatedDealSizeINR)}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    selectedVisit.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedVisit.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  Status: {selectedVisit.status.toUpperCase()}
                </span>
              </div>

              {/* Rejection Note if any */}
              {selectedVisit.approvalDetails?.rejectionReason && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                  <strong>Rejection Note:</strong> {selectedVisit.approvalDetails.rejectionReason}
                </div>
              )}

              {/* Information Grid */}
              <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Contact Person:</span>
                  <span className="font-semibold text-slate-700">{selectedVisit.contactPersonName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Phone:</span>
                  <span className="font-semibold text-slate-700">{selectedVisit.contactPersonPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Meeting Type:</span>
                  <span className="font-semibold text-slate-700">{selectedVisit.meetingType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">GPS Coordinates:</span>
                  <span className="font-mono text-slate-700">
                    {selectedVisit.location.lat.toFixed(4)}°N, {selectedVisit.location.lng.toFixed(4)}°E
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h5 className="font-semibold text-xs text-slate-600 mb-1">Meeting Notes</h5>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedVisit.notes}
                </p>
              </div>

              {/* Voice Note Waveform Player */}
              {selectedVisit.hasAudioNote && (
                <div>
                  <h5 className="font-semibold text-xs text-slate-600 mb-1.5 flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5 text-purple-600" />
                    <span>Voice Note Debrief</span>
                  </h5>
                  <AudioWavePlayer durationSeconds={selectedVisit.audioDurationSeconds || 38} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
