import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';

interface Client {
  name: string;
  email: string;
  address: string;
}

const ClientsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  const handleAddClient = (clientData: Client) => {
    setClients(prevClients => [...prevClients, clientData]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Clients</h1>
          <p className="text-gray-500 mt-1">Manage your clients and their billing history.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Client
        </button>
      </div>

      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddClient={handleAddClient}
      />

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Client List</h2>
        {clients.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>You haven&apos;t added any clients yet.</p>
            <p>Click &quot;Add Client&quot; to get started.</p>
          </div>
        ) : (
          <ClientTable clients={clients} />
        )}
      </div>
    </div>
  );
};

const AddClientModal = ({ isOpen, onClose, onAddClient }: { isOpen: boolean; onClose: () => void; onAddClient: (data: Client) => void; }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClient({ name, email, address });
    // Clear form
    setName('');
    setEmail('');
    setAddress('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Client">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <textarea id="address" value={address} onChange={e => setAddress(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600">Add Client</button>
        </div>
      </form>
    </Modal>
  );
};

const ClientTable = ({ clients }: { clients: Client[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button className="p-2 rounded-full hover:bg-gray-200">
                    <Edit className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-200">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsPage;