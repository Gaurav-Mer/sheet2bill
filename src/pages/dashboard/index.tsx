import React from 'react';

const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Draft</h2>
          {/* Placeholder for draft documents */}
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Awaiting Approval</h2>
          {/* Placeholder for documents awaiting approval */}
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Approved</h2>
          {/* Placeholder for approved documents */}
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Invoiced</h2>
          {/* Placeholder for invoiced documents */}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;