// components/Layout.tsx
import { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { TrialExpiredBanner } from './TrialExpiredBanner';
import { useProfile } from '@/hooks/useProfile';

export function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTrialBanner, setShowTrialBanner] = useState(false);
  const { profile, isLoading } = useProfile();

  useEffect(() => {
    // Don't do anything until the user's profile has loaded
    if (isLoading || !profile) {
      return;
    }
    // --- The Core Logic ---
    // Condition 1: User must be on the 'free' plan.
    const isOnFreePlan = profile.subscription_status === 'free';
    // Condition 2: They must have a trial end date that is in the past.
    const trialHasEnded = profile.subscription_ends_at && new Date(profile.subscription_ends_at) < new Date();
    // Condition 3: They must not have already dismissed the banner.
    const bannerNotDismissed = localStorage.getItem('trialBannerDismissed') !== 'true';

    if (isOnFreePlan && trialHasEnded && bannerNotDismissed) {
      setShowTrialBanner(true);
    }
  }, [profile, isLoading]);


  const handleDismissBanner = () => {
    // Hide the banner in the UI
    setShowTrialBanner(false);
    // Remember the user's choice so we don't show it again
    localStorage.setItem('trialBannerDismissed', 'true');
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* --- DESKTOP SIDEBAR --- */}
      {/* This is now fixed to the left side of the screen */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-40 w-64">
        <Sidebar />
      </div>

      {/* --- MOBILE SIDEBAR (Slide-out) --- */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {showTrialBanner && <TrialExpiredBanner onDismiss={handleDismissBanner} />}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)}></div>
          {/* Sidebar itself */}
          <div className="relative z-50 w-64">
            <Sidebar />
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      {/* This div now correctly sits to the right of the desktop sidebar */}
      <div className="md:pl-64 flex flex-col h-full">
        {/* We now have a consistent header for both mobile and desktop */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* The actual page content renders here */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}