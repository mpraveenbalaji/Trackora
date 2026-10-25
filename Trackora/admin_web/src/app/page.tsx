'use client';

import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  Search,
  MapPin,
  Mic,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  XCircle,
  Building2,
  ArrowUpRight,
  Filter,
  Check,
  LogOut,
  Sparkles,
  Phone,
  Mail,
  Compass,
  Layers,
  ChevronDown,
  Lock,
  KeyRound,
  Download,
  Calendar,
} from 'lucide-react';

interface VisitRecord {
  id: string;
  repName: string;
  repAvatar: string;
  repTerritory: string;
  clientName: string;
  contactPerson: string;
  phone: string;
  state: string;
  area: string;
  amountINR: number;
  time: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  meetingType: string;
  hasAudio: boolean;
  hasPhoto: boolean;
  lat: number;
  lng: number;
}

const INITIAL_VISITS: VisitRecord[] = [
  {
    id: 'v-101',
    repName: 'Praveen Balaji',
    repAvatar: 'PB',
    repTerritory: 'Chennai & Tamil Nadu',
    clientName: 'Pothys Flagship Store',
    contactPerson: 'Murugan Swaminathan (Operations GM)',
    phone: '+91 98400 11223',
    state: 'Tamil Nadu',
    area: 'Usman Road, T. Nagar, Chennai',
    amountINR: 1500000,
    time: '10:45 AM',
    status: 'Pending',
    meetingType: 'In-Person Contract',
    hasAudio: true,
    hasPhoto: true,
    lat: 13.0418,
    lng: 80.2341,
  },
  {
    id: 'v-102',
    repName: 'Inthiyaz Ahmed',
    repAvatar: 'IA',
    repTerritory: 'Bengaluru & Karnataka',
    clientName: 'Reliance Retail South Hub',
    contactPerson: 'Anil Kumble (Regional Commercials)',
    phone: '+91 99000 44556',
    state: 'Karnataka',
    area: 'MG Road / Brigade Road, Bengaluru',
    amountINR: 4500000,
    time: '01:15 PM',
    status: 'Pending',
    meetingType: 'Enterprise Proposal',
    hasAudio: true,
    hasPhoto: true,
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: 'v-103',
    repName: 'Praveen Balaji',
    repAvatar: 'PB',
    repTerritory: 'Chennai & Tamil Nadu',
    clientName: 'Saravana Stores Elite',
    contactPerson: 'R. Veeramani (Procurement Lead)',
    phone: '+91 98401 55667',
    state: 'Tamil Nadu',
    area: 'Pondy Bazaar, T. Nagar, Chennai',
    amountINR: 850000,
    time: '03:30 PM',
    status: 'Approved',
    meetingType: 'Product Demo',
    hasAudio: false,
    hasPhoto: true,
    lat: 13.0402,
    lng: 80.2389,
  },
  {
    id: 'v-104',
    repName: 'Priya Sharma',
    repAvatar: 'PS',
    repTerritory: 'Mumbai & Western Region',
    clientName: 'Tata Consultancy Services',
    contactPerson: 'K. Chandrasekaran (Vendor Relations)',
    phone: '+91 98200 77889',
    state: 'Maharashtra',
    area: 'Powai Business Hub, Mumbai',
    amountINR: 3200000,
    time: '04:10 PM',
    status: 'Approved',
    meetingType: 'SLA Review',
    hasAudio: true,
    hasPhoto: true,
    lat: 19.1176,
    lng: 72.906,
  },
  {
    id: 'v-105',
    repName: 'Sanjay Verma',
    repAvatar: 'SV',
    repTerritory: 'Coimbatore & Western TN',
    clientName: 'L&T Heavy Engineering',
    contactPerson: 'V. Sundaram (Plant Admin)',
    phone: '+91 94432 11990',
    state: 'Tamil Nadu',
    area: 'Malumichampatti, Coimbatore',
    amountINR: 1800000,
    time: '11:20 AM',
    status: 'Approved',
    meetingType: 'Routine Follow-up',
    hasAudio: false,
    hasPhoto: true,
    lat: 10.9387,
    lng: 76.9953,
  },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [adminEmail, setAdminEmail] = useState('admin@trackora.in');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Dashboard Filters & State
  const [visits, setVisits] = useState<VisitRecord[]>(INITIAL_VISITS);
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepTab, setSelectedRepTab] = useState<'All' | 'PB' | 'IA'>('All');
  const [selectedVisitModal, setSelectedVisitModal] = useState<VisitRecord | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === 'admin@trackora.in' && adminPassword === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Use admin@trackora.in / admin123');
    }
  };

  const handleApprove = (id: string) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'Approved' } : v))
    );
  };

  const handleReject = (id: string) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'Rejected' } : v))
    );
  };

  const handleBatchApprove = () => {
    setVisits((prev) => prev.map((v) => ({ ...v, status: 'Approved' })));
  };

  const formatINR = (val: number) => {
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹ ${(val / 100000).toFixed(2)} L`;
  };

  const filteredVisits = visits.filter((v) => {
    const matchesState = selectedState === 'All' || v.state === selectedState;
    const matchesRep =
      selectedRepTab === 'All' || v.repAvatar === selectedRepTab;
    const matchesSearch =
      v.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.repName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesRep && matchesSearch;
  });

  const pendingVisits = visits.filter((v) => v.status === 'Pending');
  const totalPipeline = visits
    .filter((v) => v.status === 'Approved')
    .reduce((sum, v) => sum + v.amountINR, 0);

  // --------------------------------------------------------------------------
  // LOGIN SCREEN (If not authenticated)
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0b7a42] to-emerald-400 flex items-center justify-center shadow-lg mb-4">
              <span className="text-3xl font-black text-white">T</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Trackora Admin Portal
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Field Force Management & Verification System (India)
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0b7a42] focus:outline-none"
                  placeholder="admin@trackora.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0b7a42] focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {loginError && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#0b7a42] to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Sign In to Executive Dashboard</span>
            </button>
          </form>

          {/* Quick Demo Login Credentials Card */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200/80">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                ⚡ 1-Click Demo Admin Credentials
              </span>
              <p className="text-xs text-slate-700 font-mono">
                Email: <strong>admin@trackora.in</strong>
                <br />
                Password: <strong>admin123</strong>
              </p>
              <button
                type="button"
                onClick={() => {
                  setAdminEmail('admin@trackora.in');
                  setAdminPassword('admin123');
                  setIsAuthenticated(true);
                }}
                className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1"
              >
                <span>Instant Demo Sign In →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // EXECUTIVE ADMIN DASHBOARD
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0b7a42] to-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
            T
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg text-slate-900 tracking-tight">
                Trackora
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Admin Control Center
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              National Field Sales Overview • India Territory
            </p>
          </div>
        </div>

        {/* Global Live Geofence Badge & Admin Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span>Live Geofence GPS Active (±5m)</span>
          </div>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">
                Suresh Narayanan
              </p>
              <p className="text-[11px] text-slate-500">VP Sales Operations</p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              title="Log out"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Executive KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Verified Pipeline */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Approved Pipeline (India)
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {formatINR(totalPipeline)}
              </h3>
              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4% MoM Growth
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Visits Logged Today */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Today's Field Visits
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {visits.length} Logged
              </h3>
              <p className="text-xs font-semibold text-blue-600 flex items-center gap-1 mt-1">
                <Briefcase className="w-3.5 h-3.5" /> 92% of Target Achieved
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          {/* Field Attendance */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Team Attendance
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                48 / 52 Reps
              </h3>
              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 92.3% On-Duty Live
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Audit Approval Queue
              </span>
              <h3 className="text-2xl font-black text-amber-600 mt-1">
                {pendingVisits.length} Pending
              </h3>
              {pendingVisits.length > 0 ? (
                <button
                  onClick={handleBatchApprove}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 underline mt-1 flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Batch Approve All (1-Click)</span>
                </button>
              ) : (
                <span className="text-xs font-semibold text-slate-400 mt-1">
                  All visits verified ✓
                </span>
              )}
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* INTERACTIVE LIVE FIELD MAP OF INDIA */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#0b7a42]" />
                <span>Live Field Force Geolocation Map (India)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time tracking of active sales visits, client locations, and
                geofence verification
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter Territory:</span>
              <div className="flex gap-1">
                {['All', 'Tamil Nadu', 'Karnataka', 'Maharashtra'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedState(st)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      selectedState === st
                        ? 'bg-[#0b7a42] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Map Visualizer */}
          <div className="relative h-72 w-full bg-slate-900 overflow-hidden flex items-center justify-center">
            {/* Grid Pattern Background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* India Territory Contours & Pin Markers */}
            <div className="relative w-full max-w-2xl h-full flex items-center justify-center">
              {/* Chennai Pin (Praveen Balaji at Pothys) */}
              <div className="absolute top-[58%] right-[32%] group cursor-pointer">
                <div className="relative flex flex-col items-center">
                  <div className="px-2 py-0.5 rounded-md bg-white text-slate-900 font-bold text-[10px] shadow-lg mb-1 whitespace-nowrap border border-slate-100">
                    Praveen • Pothys (T. Nagar)
                  </div>
                  <div className="relative">
                    <span className="animate-ping absolute -top-1 -left-1 h-6 w-6 rounded-full bg-emerald-400 opacity-75"></span>
                    <div className="w-5 h-5 rounded-full bg-[#0b7a42] border-2 border-white shadow-md flex items-center justify-center text-[9px] text-white font-bold">
                      PB
                    </div>
                  </div>
                </div>
              </div>

              {/* Bengaluru Pin (Inthiyaz Ahmed at Reliance) */}
              <div className="absolute top-[52%] right-[44%] group cursor-pointer">
                <div className="relative flex flex-col items-center">
                  <div className="px-2 py-0.5 rounded-md bg-white text-slate-900 font-bold text-[10px] shadow-lg mb-1 whitespace-nowrap border border-slate-100">
                    Inthiyaz • Reliance Hub (MG Rd)
                  </div>
                  <div className="relative">
                    <span className="animate-ping absolute -top-1 -left-1 h-6 w-6 rounded-full bg-teal-400 opacity-75"></span>
                    <div className="w-5 h-5 rounded-full bg-teal-600 border-2 border-white shadow-md flex items-center justify-center text-[9px] text-white font-bold">
                      IA
                    </div>
                  </div>
                </div>
              </div>

              {/* Mumbai Pin (Priya Sharma at TCS) */}
              <div className="absolute top-[42%] left-[34%] group cursor-pointer">
                <div className="relative flex flex-col items-center">
                  <div className="px-2 py-0.5 rounded-md bg-white text-slate-900 font-bold text-[10px] shadow-lg mb-1 whitespace-nowrap border border-slate-100">
                    Priya • TCS (Powai)
                  </div>
                  <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-[9px] text-white font-bold">
                    PS
                  </div>
                </div>
              </div>

              {/* Coimbatore Pin (Sanjay Verma at L&T) */}
              <div className="absolute top-[68%] right-[40%] group cursor-pointer">
                <div className="relative flex flex-col items-center">
                  <div className="px-2 py-0.5 rounded-md bg-white text-slate-900 font-bold text-[10px] shadow-lg mb-1 whitespace-nowrap border border-slate-100">
                    Sanjay • L&T (Coimbatore)
                  </div>
                  <div className="w-5 h-5 rounded-full bg-purple-600 border-2 border-white shadow-md flex items-center justify-center text-[9px] text-white font-bold">
                    SV
                  </div>
                </div>
              </div>
            </div>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-white text-[11px] flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0b7a42]"></span>
                Chennai Hub
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                Bengaluru Hub
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                Mumbai Hub
              </span>
              <span className="text-slate-400">Google Maps Satellite Sync ✓</span>
            </div>
          </div>
        </div>

        {/* VISIT APPROVAL AUDIT & REVIEWS SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0b7a42]" />
                <span>Field Visit Approvals & Audit Feed</span>
              </h3>
              <p className="text-xs text-slate-500">
                Review GPS timestamps, voice summaries, and client storefront
                proof before approving quota
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Client or Rep..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0b7a42] focus:outline-none"
              />
            </div>
          </div>

          {/* Visits Table / Cards */}
          <div className="space-y-3">
            {filteredVisits.map((visit) => {
              const isApproved = visit.status === 'Approved';
              const isPending = visit.status === 'Pending';
              return (
                <div
                  key={visit.id}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Rep & Client Details */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                      {visit.repAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {visit.clientName}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {visit.state}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isApproved
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isPending
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {visit.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5 flex-wrap">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{visit.area}</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-semibold text-slate-800">
                          {visit.contactPerson}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>Logged by {visit.repName}</span>
                      </p>

                      {/* Attachments proof tags */}
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                        <span className="font-bold text-[#0b7a42]">
                          Deal: {formatINR(visit.amountINR)}
                        </span>
                        <span>Time: {visit.time}</span>
                        {visit.hasPhoto && (
                          <span className="text-blue-600 font-medium flex items-center gap-0.5">
                            ✓ Storefront Photo
                          </span>
                        )}
                        {visit.hasAudio && (
                          <span className="text-purple-600 font-medium flex items-center gap-0.5">
                            <Mic className="w-3 h-3" /> Voice Memo (34s)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => handleApprove(visit.id)}
                          className="px-3.5 py-2 rounded-xl bg-[#0b7a42] hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(visit.id)}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Flag / Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified & Credited</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TEAM LEADERBOARD & PERFORMANCE METRICS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0b7a42]" />
              <span>Top Field Sales Performers (India)</span>
            </h3>

            <div className="space-y-3">
              {[
                {
                  name: 'Praveen Balaji',
                  territory: 'Chennai & Tamil Nadu',
                  amount: '₹ 68,50,000',
                  targetAchieved: '114%',
                  visits: '28 Visits',
                  avatar: 'PB',
                  rank: 1,
                },
                {
                  name: 'Inthiyaz Ahmed',
                  territory: 'Bengaluru & Karnataka',
                  amount: '₹ 54,20,000',
                  targetAchieved: '98%',
                  visits: '24 Visits',
                  avatar: 'IA',
                  rank: 2,
                },
                {
                  name: 'Priya Sharma',
                  territory: 'Mumbai & Western Zone',
                  amount: '₹ 42,00,000',
                  targetAchieved: '92%',
                  visits: '20 Visits',
                  avatar: 'PS',
                  rank: 3,
                },
              ].map((rep) => (
                <div
                  key={rep.name}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#0b7a42] font-black text-xs flex items-center justify-center">
                      #{rep.rank}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#0b7a42] text-white font-bold text-xs flex items-center justify-center">
                      {rep.avatar}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {rep.name}
                      </h4>
                      <p className="text-xs text-slate-500">{rep.territory}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-black text-sm text-[#0b7a42]">
                      {rep.amount}
                    </p>
                    <p className="text-xs text-slate-500 font-semibold">
                      {rep.targetAchieved} Quota ({rep.visits})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick System Status & Export */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 mb-2">
                System Diagnostics
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Mobile companion app build & server endpoints
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="font-medium text-slate-600">
                    Flutter User APK
                  </span>
                  <span className="font-bold text-emerald-700">
                    verison_1.apk (Ready)
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="font-medium text-slate-600">
                    Admin Web Local Address
                  </span>
                  <span className="font-mono font-bold text-blue-700">
                    http://localhost:3000
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="font-medium text-slate-600">
                    GPS Geofence Threshold
                  </span>
                  <span className="font-bold text-slate-800">±15 meters</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() =>
                  alert('EOD Attendance & Visit Summary exported successfully!')
                }
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Export Daily Territory Audit (CSV)</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
