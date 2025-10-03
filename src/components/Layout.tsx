import React from 'react';
import Link from 'next/link';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">QuickBill Flow</h1>
        </div>
        <nav>
          <ul>
            <li className="p-4 hover:bg-gray-700">
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <Link href="/clients">Clients</Link>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <Link href="/templates">Templates</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;