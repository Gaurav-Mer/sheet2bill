import React from 'react';
import { FileText, Clock, CheckCircle, FileCheck } from 'lucide-react';

const StatCard = ({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode, color: string }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center space-x-4 transition-shadow hover:shadow-md">
      <div className={`rounded-full p-3 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-10">Here&apos;s a snapshot of your billing activity.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Draft"
          value="12"
          icon={<FileText className="w-6 h-6 text-yellow-800" />}
          color="bg-yellow-100"
        />
        <StatCard
          title="Awaiting Approval"
          value="3"
          icon={<Clock className="w-6 h-6 text-blue-800" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Approved"
          value="8"
          icon={<CheckCircle className="w-6 h-6 text-green-800" />}
          color="bg-green-100"
        />
        <StatCard
          title="Invoiced"
          value="27"
          icon={<FileCheck className="w-6 h-6 text-indigo-800" />}
          color="bg-indigo-100"
        />
      </div>
    </div>
  );
};

export default DashboardPage;