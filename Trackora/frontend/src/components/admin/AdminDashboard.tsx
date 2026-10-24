import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { User } from '../../types';
import { AudioWavePlayer } from '../common/AudioWavePlayer';
import { INDIAN_STATES_LIST } from '../../lib/mock-data/initialData';
import {
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  XCircle,
  Search,
  MapPin,
  Mic,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    allUsers,
    visits,
    stats,
    activeDate,
    approveVisit,
    rejectVisit,
    batchApproveVisits,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRep, setSelectedRep] = useState<User | null>(null);
  const [rejectingVisitId, setRejectingVisitId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isBatchApproving, setIsBatchApproving] = useState(false);

  const reps = allUsers.filter((u) => u.role === 'salesperson');
  const filteredReps = reps.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingVisits = visits.filter((v) => v.status === 'pending');

  const formatINR = (amount: number) => {
    if (amount >= 10000000) return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹ ${(amount / 100000).toFixed(2)} Lakhs`;
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  const handleBatchApproveAll = async () => {
    if (pendingVisits.length === 0) return;
    setIsBatchApproving(true);
    try {
      await batchApproveVisits(pendingVisits.map((v) => v.id));
    } finally {
      setIsBatchApproving(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingVisitId || !rejectionReason.trim()) {
      alert('Please provide a specific reason for rejection');
      return;
    }
    await rejectVisit(rejectingVisitId, rejectionReason);
    setRejectingVisitId(null);
    setRejectionReason('');
  };

  // Visits for the selected rep in the timeline drawer
  const repVisits = selectedRep
    ? visits.filter((v) => v.userId === selectedRep.id)
    : [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Field Force */}
        <div className="trackora-card p-5 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Field Force Checked In
            </span>
            <h3 className="font-heading text-2xl font-extrabold text-slate-800 mt-1">
              {stats?.checkedInToday || 4} / {stats?.totalReps || 5} Reps
            </h3>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 80% Attendance on {activeDate}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Visits Logged */}
        <div className="trackora-card p-5 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Visits Logged Today
            </span>
            <h3 className="font-heading text-2xl font-extrabold text-slate-800 mt-1">
              {stats?.totalVisitsLogged || 7} Visits
            </h3>
            <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 mt-1">
              <Briefcase className="w-3.5 h-3.5" /> Across Indian Territories
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Approval Queue */}
        <div className="trackora-card p-5 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Approvals
            </span>
            <h3 className="font-heading text-2xl font-extrabold text-amber-600 mt-1">
              {pendingVisits.length} Visits
            </h3>
            {pendingVisits.length > 0 ? (
              <button
                onClick={handleBatchApproveAll}
                disabled={isBatchApproving}
                className="text-xs font-bold text-amber-700 underline hover:text-amber-800 mt-1 flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isBatchApproving ? 'Approving...' : 'Approve All (1-Click)'}</span>
              </button>
            ) : (
              <span className="text-xs font-semibold text-slate-400 mt-1">
                Queue cleared ✓
              </span>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Total Verified Pipeline */}
        <div className="trackora-card p-5 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Verified Pipeline Value (India)
            </span>
            <h3 className="font-heading text-2xl font-extrabold text-emerald-700 mt-1">
              {formatINR(stats?.totalPipelineINR || 16500000)}
            </h3>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> 18.2% Closing Ratio
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Split: Reps Table + Territory Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Rep Directory & Daily Logs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="trackora-card bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Table Header & Search Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-800">
                  Sales Team Daily Execution
                </h3>
                <p className="text-xs text-slate-500">
                  Inspecting attendance and client visits for date:{' '}
                  <span className="font-bold text-[#136b6f]">{activeDate}</span>
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sales rep or team..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#136b6f] focus:outline-none"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Salesperson</th>
                    <th className="py-3 px-3">Check-In</th>
                    <th className="py-3 px-3">Visits Logged</th>
                    <th className="py-3 px-3">Approved / Pending</th>
                    <th className="py-3 px-3">Monthly Target</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReps.map((rep) => {
                    const repDayVisits = visits.filter((v) => v.userId === rep.id);
                    const approved = repDayVisits.filter((v) => v.status === 'approved').length;
                    const pending = repDayVisits.filter((v) => v.status === 'pending').length;
                    const quotaPct = Math.min((rep.approvedVisitsThisMonth / rep.targetMonthlyVisits) * 100, 100);

                    return (
                      <tr
                        key={rep.id}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        onClick={() => setSelectedRep(rep)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#136b6f]/10 text-[#136b6f] font-bold flex items-center justify-center shrink-0">
                              {rep.avatarText}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{rep.name}</p>
                              <p className="text-[11px] text-slate-500">{rep.teamName}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            08:58 AM
                          </span>
                        </td>

                        <td className="py-3.5 px-3 font-semibold text-slate-700">
                          {repDayVisits.length} visits
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-700 font-bold">{approved} appr.</span>
                            {pending > 0 && (
                              <span className="text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                                {pending} pend.
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="w-24">
                            <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-0.5">
                              <span>{rep.approvedVisitsThisMonth}/50</span>
                              <span>{quotaPct.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#136b6f] h-full rounded-full"
                                style={{ width: `${quotaPct}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRep(rep);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#136b6f] hover:text-white text-slate-700 text-xs font-semibold transition-all inline-flex items-center gap-1"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Territory Breakdown & Pending Queue Quick Action */}
        <div className="space-y-4">
          {/* Quick Pending Approval Action Box */}
          <div className="trackora-card p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-base text-slate-800">
                Pending Approval Queue
              </h4>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {pendingVisits.length} pending
              </span>
            </div>

            {pendingVisits.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                All visits for {activeDate} have been reviewed.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto divide-y divide-slate-100">
                {pendingVisits.map((v) => (
                  <div key={v.id} className="pt-2 first:pt-0 space-y-1 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-800">{v.clientName}</span>
                      <span className="font-bold text-emerald-700">
                        {formatINR(v.estimatedDealSizeINR)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Logged by {v.userName} • {v.state}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => approveVisit(v.id)}
                        className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectingVisitId(v.id)}
                        className="flex-1 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold text-[11px] transition-colors"
                      >
                        Reject...
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Regional Territory Breakdown (India) */}
          <div className="trackora-card p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h4 className="font-heading font-bold text-base text-slate-800">
              Visits by State (India)
            </h4>
            <div className="space-y-2.5">
              {INDIAN_STATES_LIST.map((st) => {
                const count = visits.filter((v) => v.state === st).length;
                const totalStateRevenue = visits
                  .filter((v) => v.state === st)
                  .reduce((sum, v) => sum + v.estimatedDealSizeINR, 0);

                return (
                  <div key={st}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">{st}</span>
                      <span className="text-emerald-700">{formatINR(totalStateRevenue || 3500000)}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#136b6f] h-full rounded-full"
                        style={{ width: `${Math.min(count * 20, 100) || 25}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Drill-down Rep Timeline Drawer */}
      {selectedRep && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-100">
            {/* Drawer Header */}
            <div className="bg-[#136b6f] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 text-white font-bold flex items-center justify-center text-lg shadow-inner">
                  {selectedRep.avatarText}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg">{selectedRep.name}</h3>
                  <p className="text-xs text-emerald-100">
                    {selectedRep.teamName} • Timeline for {activeDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRep(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Timeline Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Daily Attendance Verification */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                  <div>
                    <h5 className="font-bold text-emerald-900 text-xs">Attendance Verified</h5>
                    <p className="text-[11px] text-emerald-700">
                      08:58 AM • T. Nagar, Chennai (GPS Accuracy ±6m)
                    </p>
                  </div>
                </div>
                <span className="font-bold text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  Present
                </span>
              </div>

              <h4 className="font-heading font-bold text-sm text-slate-800 pt-2">
                Daily Stop-by-Stop Itinerary ({repVisits.length} visits)
              </h4>

              {repVisits.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl">
                  <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No field visits recorded for this rep on {activeDate}.</p>
                </div>
              ) : (
                <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {repVisits.map((v, i) => (
                    <div
                      key={v.id}
                      className="relative trackora-card p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2"
                    >
                      {/* Timeline dot */}
                      <span className="absolute -left-[22px] top-4 w-3.5 h-3.5 rounded-full bg-[#136b6f] border-2 border-white shadow-sm" />

                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Stop #{i + 1} • {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <h5 className="font-heading font-bold text-sm text-slate-800">
                            {v.clientName}
                          </h5>
                          <p className="text-slate-500">
                            {v.contactPersonName} ({v.contactPersonRole}) • {v.contactPersonPhone}
                          </p>
                        </div>
                        <span
                          className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
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

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded">
                          {v.meetingType}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-semibold rounded">
                          {v.state}
                        </span>
                        <span className="font-bold text-emerald-700 ml-auto text-sm">
                          {formatINR(v.estimatedDealSizeINR)}
                        </span>
                      </div>

                      {/* Notes */}
                      <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                        {v.notes}
                      </p>

                      {/* Voice Note Wave Player */}
                      {v.hasAudioNote && (
                        <div className="pt-1">
                          <span className="font-semibold text-slate-500 flex items-center gap-1 mb-1">
                            <Mic className="w-3.5 h-3.5 text-purple-600" /> Voice Memo
                          </span>
                          <AudioWavePlayer durationSeconds={v.audioDurationSeconds || 42} />
                        </div>
                      )}

                      {/* Approval Actions */}
                      {v.status === 'pending' && (
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => approveVisit(v.id)}
                            className="flex-1 py-1.5 bg-[#0b7a42] hover:bg-[#086134] text-white font-bold rounded-xl shadow-sm transition-all"
                          >
                            Approve (+1 Quota)
                          </button>
                          <button
                            onClick={() => setRejectingVisitId(v.id)}
                            className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition-all"
                          >
                            Reject...
                          </button>
                        </div>
                      )}

                      {v.approvalDetails?.rejectionReason && (
                        <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px]">
                          <strong>Rejection Note:</strong> {v.approvalDetails.rejectionReason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Rejection Reason Dialog */}
      {rejectingVisitId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 p-5 space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="font-heading font-bold text-base">Rejection Reason Required</h3>
            </div>
            <p className="text-xs text-slate-600">
              Field salespeople require specific feedback when a visit is rejected so they can correct details and resubmit.
            </p>

            {/* Quick Preset Buttons */}
            <div className="space-y-1.5">
              {[
                'Location discrepancy: GPS out of client premises',
                'Incomplete notes: Missing client decision timeline',
                'Client meeting rescheduled / not conducted',
                'Duplicate visit entry detected',
              ].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setRejectionReason(preset)}
                  className="w-full text-left p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs text-slate-700 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Or type custom rejection reason..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRejectingVisitId(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
