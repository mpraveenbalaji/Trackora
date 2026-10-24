import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MobileAppContainer } from './components/mobile/MobileAppContainer';
import { NotificationsModal } from './components/common/NotificationsModal';
import { Smartphone } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentUser, isSimulatedMobileView, setIsSimulatedMobileView } = useApp();
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex flex-col selection:bg-[#136b6f] selection:text-white">
      {/* Universal Control Header */}
      <Header onOpenNotifs={() => setIsNotifsOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-start items-center p-2 sm:p-4">
        {isSimulatedMobileView ? (
          /* Phone Simulator Viewport */
          <div className="w-full flex flex-col items-center py-4">
            <div className="mb-2 text-xs font-semibold text-slate-500 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#136b6f]" />
              <span>Simulating iPhone 16 Pro Viewport (Field Salesperson UX)</span>
              <button
                onClick={() => setIsSimulatedMobileView(false)}
                className="underline text-[#136b6f] hover:text-[#0b7a42]"
              >
                Switch to Full Desktop
              </button>
            </div>
            <div className="mobile-simulator-viewport">
              <div className="mobile-notch" />
              <div className="flex-1 overflow-y-auto">
                <MobileAppContainer onOpenNotifs={() => setIsNotifsOpen(true)} />
              </div>
            </div>
          </div>
        ) : (
          /* Full Responsive Viewport */
          <div className="w-full">
            {currentUser?.role === 'manager' || currentUser?.role === 'superadmin' ? (
              <AdminDashboard />
            ) : (
              <div className="max-w-2xl mx-auto py-4">
                <div className="rounded-3xl shadow-xl overflow-hidden border border-slate-200">
                  <MobileAppContainer onOpenNotifs={() => setIsNotifsOpen(true)} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Notifications Modal */}
      <NotificationsModal isOpen={isNotifsOpen} onClose={() => setIsNotifsOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
