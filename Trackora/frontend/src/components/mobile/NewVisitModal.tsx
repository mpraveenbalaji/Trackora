import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_CLIENTS, INDIAN_STATES_LIST } from '../../lib/mock-data/initialData';
import type { MeetingType } from '../../types';
import {
  MapPin,
  Building,
  User,
  Phone,
  Mail,
  FileText,
  Camera,
  Mic,
  CheckCircle,
  X,
  AlertCircle,
  IndianRupee,
} from 'lucide-react';

export const NewVisitModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, activeDate, logNewVisit } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [area, setArea] = useState('T. Nagar, Chennai');
  const [meetingType, setMeetingType] = useState<MeetingType>('In-Person');
  const [dealValueINR, setDealValueINR] = useState('500000');
  const [notes, setNotes] = useState('');
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google Map Interactive Marker State
  const [isSatellite, setIsSatellite] = useState(false);
  const [pinPos, setPinPos] = useState({ x: 50, y: 48 }); // Percentage-based position
  const [markedCoords, setMarkedCoords] = useState({ lat: 13.0418, lng: 80.2341 });

  if (!isOpen) return null;

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPinPos({ x, y });
    setMarkedCoords({
      lat: Number((13.0418 + (y - 50) * 0.0002).toFixed(4)),
      lng: Number((80.2341 + (x - 50) * 0.0002).toFixed(4)),
    });
  };

  const handleSelectPredefinedClient = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = MOCK_CLIENTS.find((c) => c.id === e.target.value);
    if (found) {
      setCustomerName(found.name);
      setPhone(found.phone);
      setSelectedState(found.state);
      setArea(found.area);
      setContactName('Store / Operations Lead');
      setEmail('contact@' + found.name.toLowerCase().replace(/[^a-z]/g, '') + '.in');
      if (found.coordinates) {
        setMarkedCoords({ lat: found.coordinates.lat, lng: found.coordinates.lng });
      }
      setPinPos({ x: 52, y: 46 });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) {
      alert('Please enter or select a customer name');
      return;
    }
    if (!currentUser) return;

    setIsSubmitting(true);
    try {
      await logNewVisit({
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatarText,
        clientId: 'c-' + Date.now(),
        clientName: customerName,
        contactPersonName: contactName || 'General Contact',
        contactPersonRole: 'Business Representative',
        contactPersonPhone: phone || '+91 98400 00000',
        contactPersonEmail: email || 'contact@client.in',
        date: activeDate,
        state: selectedState,
        area: area || 'Central Commercial Hub',
        meetingType,
        estimatedDealSizeINR: parseInt(dealValueINR || '0', 10),
        notes: notes || 'Met on premises. Client inquired about Trackora field attendance and multi-location visit logging.',
        hasAudioNote: hasVoiceNote,
        audioDurationSeconds: hasVoiceNote ? 34 : undefined,
        location: {
          lat: markedCoords.lat,
          lng: markedCoords.lng,
          accuracyMeters: 5,
          isMocked: false,
          distanceFromClientMeters: 15,
        },
      });

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0b7a42] text-white px-5 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-200" />
            <h3 className="font-heading font-bold text-lg">Log New Field Visit (India)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/90 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-sm">
          {/* INTERACTIVE GOOGLE MAP LOCATION MARKER */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shadow-xs">
            {/* Map Top Bar */}
            <div className="p-2.5 bg-white border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600 fill-rose-100" />
                <span className="font-bold text-slate-800">Google Map Location Marker</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSatellite(!isSatellite)}
                  className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-all ${
                    isSatellite
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isSatellite ? 'Satellite' : 'Street'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPinPos({ x: 50, y: 50 });
                    setMarkedCoords({ lat: 13.0418, lng: 80.2341 });
                  }}
                  className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 hover:bg-emerald-100"
                >
                  GPS Center 📍
                </button>
              </div>
            </div>

            {/* Interactive Map Surface */}
            <div
              onClick={handleMapClick}
              className={`relative h-44 w-full cursor-crosshair select-none transition-colors ${
                isSatellite ? 'bg-slate-900' : 'bg-slate-100'
              }`}
            >
              {/* Simulated Map Streets & Parcels */}
              <div className="absolute inset-0 opacity-40 pointer-events-none">
                {/* Horizontal Road (Usman Road) */}
                <div className={`absolute top-1/2 left-0 right-0 h-4 -translate-y-1/2 ${isSatellite ? 'bg-slate-700' : 'bg-white border-y border-slate-300'}`}>
                  <div className="h-full flex items-center justify-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Usman Road</span>
                  </div>
                </div>
                {/* Vertical Cross Road (Pondy Bazaar) */}
                <div className={`absolute top-0 bottom-0 left-1/3 w-4 -translate-x-1/2 ${isSatellite ? 'bg-slate-700' : 'bg-white border-x border-slate-300'}`}></div>
                {/* Secondary Street */}
                <div className={`absolute top-0 bottom-0 right-1/4 w-3 ${isSatellite ? 'bg-slate-800' : 'bg-white'}`}></div>
                {/* Green Park */}
                <div className={`absolute top-3 left-4 w-20 h-12 rounded-lg ${isSatellite ? 'bg-emerald-950' : 'bg-emerald-100 border border-emerald-200'}`}></div>
              </div>

              {/* High-Accuracy GPS Pulse Radar under Pin */}
              <div
                style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute h-10 w-10 rounded-full bg-blue-400 opacity-60"></span>
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500"></div>
                </div>
              </div>

              {/* Red Google Maps Pin */}
              <div
                style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-75"
              >
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-rose-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
                    <MapPin className="w-4 h-4 fill-white text-rose-600" />
                  </div>
                  <div className="w-1.5 h-1.5 bg-rose-600 rotate-45 -mt-1 shadow-sm"></div>
                </div>
              </div>

              {/* Google Watermark */}
              <div className="absolute bottom-2 left-2.5 px-1.5 py-0.5 rounded bg-white/80 backdrop-blur-xs text-[10px] font-black text-[#4285F4] pointer-events-none tracking-tight">
                Google
              </div>

              {/* Hint badge */}
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-medium text-white pointer-events-none">
                Tap anywhere on map to mark pin
              </div>
            </div>

            {/* Coordinates & Resolved Address Bar */}
            <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono font-bold text-slate-800">
                  {markedCoords.lat}° N, {markedCoords.lng}° E
                </span>
                <span className="ml-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                  GPS Verified (±5m)
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium truncate max-w-[150px]">
                {area || 'T. Nagar, Chennai'}
              </span>
            </div>
          </div>

          {/* Quick Preset Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Select Preset or Enter Business Name
            </label>
            <select
              onChange={handleSelectPredefinedClient}
              className="w-full mb-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium focus:ring-2 focus:ring-[#0b7a42] focus:outline-none"
            >
              <option value="">-- Choose from Indian Enterprise Client List --</option>
              {MOCK_CLIENTS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.state} - {c.area})
                </option>
              ))}
            </select>

            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Business Name (e.g. Pothys, Reliance, Tata, Saravana Stores)"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0b7a42] focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Contact Person Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Contact Person Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Murugan Swaminathan"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0b7a42] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98400 12345"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0b7a42] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@business.in"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0b7a42] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Area / Local Market</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="T. Nagar, Usman Road"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0b7a42] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* State / Territory Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">State / Region (India)</label>
            <div className="flex flex-wrap gap-1.5">
              {INDIAN_STATES_LIST.map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setSelectedState(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedState === st
                      ? 'bg-[#0b7a42] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Meeting Type Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Meeting Type</label>
            <div className="flex flex-wrap gap-1.5">
              {(['In-Person', 'Cold Call', 'Follow-up', 'New'] as MeetingType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setMeetingType(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    meetingType === t
                      ? 'bg-[#c8102e] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Deal Value (INR ₹) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Estimated Deal Size (₹ INR)
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="number"
                value={dealValueINR}
                onChange={(e) => setDealValueINR(e.target.value)}
                placeholder="500000 (e.g. ₹5 Lakhs)"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-semibold text-emerald-800 focus:ring-2 focus:ring-[#0b7a42] focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              e.g. ₹ 5,00,000 (5 Lakhs) or ₹ 25,00,000 (25 Lakhs)
            </p>
          </div>

          {/* Enquiry / Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Enquiry / Meeting Notes
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Client requested a trial for 50 sales agents across Pondicherry & Chennai branches..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0b7a42] focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Multimedia Attachments: Photo & Voice Note */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setHasPhoto(!hasPhoto)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                hasPhoto
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Camera className="w-4 h-4 text-blue-500" />
              <span>{hasPhoto ? 'Photo Attached ✓' : 'Add Photo'}</span>
            </button>

            <button
              type="button"
              onClick={() => setHasVoiceNote(!hasVoiceNote)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                hasVoiceNote
                  ? 'bg-purple-50 text-purple-700 border-purple-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Mic className="w-4 h-4 text-purple-500" />
              <span>{hasVoiceNote ? 'Voice Note (34s) ✓' : 'Record Voice Note'}</span>
            </button>
          </div>

          {/* Approval Notice */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Once submitted, this visit enters a <strong>Pending Approval</strong> state. Upon manager
              verification, it will count toward your monthly quota and leaderboard standing.
            </span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0b7a42] to-[#086134] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting to Queue...' : 'Save & Submit Visit'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
