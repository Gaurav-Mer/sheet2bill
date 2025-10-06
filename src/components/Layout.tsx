// components/Layout.tsx
import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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