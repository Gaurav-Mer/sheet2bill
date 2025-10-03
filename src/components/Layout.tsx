import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Users, ClipboardList, Settings } from 'lucide-react';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link href={href}>
      <div
        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
          isActive
            ? 'bg-blue-500 text-white'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        {children}
      </div>
    </Link>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">QuickBill</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavLink href="/dashboard">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink href="/clients">
            <Users className="w-5 h-5 mr-3" />
            Clients
          </NavLink>
          <NavLink href="/templates">
            <ClipboardList className="w-5 h-5 mr-3" />
            Templates
          </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-200">
            <NavLink href="/settings">
                <Settings className="w-5 h-5 mr-3" />
                Settings
            </NavLink>
        </div>
      </aside>
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;