import React from 'react';

const ClientsPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Clients</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Client
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Client List</h2>
        {/* Placeholder for the list of clients */}
      </div>
    </div>
  );
};

export default ClientsPage;