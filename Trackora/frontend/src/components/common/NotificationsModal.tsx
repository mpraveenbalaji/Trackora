import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Flame, Calendar, Trophy, Users, X } from 'lucide-react';

export const NotificationsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, markNotificationRead } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'nudge':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'lead':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'reminder':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'target':
        return <Trophy className="w-5 h-5 text-emerald-500" />;
      default:
        return <Users className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="bg-[#136b6f] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-300" />
            <h3 className="font-heading font-bold text-lg">Notifications & Nudges</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto space-y-3 divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No new notifications</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`pt-3 first:pt-0 flex items-start gap-3 p-2.5 rounded-xl transition-colors cursor-pointer ${
                  !n.isRead ? 'bg-emerald-50/60 border border-emerald-100' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-semibold text-sm text-slate-800 truncate">{n.title}</h4>
                    <span className="text-[11px] text-slate-400 shrink-0">{n.timeAgo}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.body}</p>
                </div>
                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 self-center" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#136b6f] hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
