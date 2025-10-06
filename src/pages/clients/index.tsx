/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
// UI Components
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
// Our New Reusable Components
import { ClientTable } from '@/components/clients/ClientTable';
import { Pagination } from '@/components/clients/Pagination';
// CORRECTED: 'Clientform' to 'ClientForm'
import { ClientForm } from '@/components/clients/Clientform';

export type Client = {
  id: number;
  name: string;
  email: string | null;
  phone_number: string | null;
  contact_person: string | null;
  country: string | null;
  city: string | null;
  tax_id: string | null;
  notes: string | null;
};

// CORRECTED: Added the 'user' prop to the PageProps type
type PageProps = {
  clients: Client[];
  user: any;
  count: number;
  page: number;
  searchQuery: string;
};

const ITEMS_PER_PAGE = 10;

export default function ClientsPage({ clients, count, page, searchQuery }: PageProps) {
  const router = useRouter();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const refreshData = () => router.replace(router.asPath);

  const handleOpenEdit = (client: Client) => {
    setSelectedClient(client);
    setEditModalOpen(true);
  };

  const handleOpenDelete = (client: Client) => {
    setSelectedClient(client);
    setDeleteAlertOpen(true);
  };

  async function handleAddClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await fetch('/api/clients', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { 'Content-Type': 'application/json' },
    });
    setAddModalOpen(false);
    refreshData();
  }

  async function handleEditClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedClient) return;
    const formData = new FormData(event.currentTarget);
    await fetch(`/api/clients/${selectedClient.id}`, {
      method: 'PUT',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { 'Content-Type': 'application/json' },
    });
    setEditModalOpen(false);
    refreshData();
  }

  async function handleDeleteClient() {
    if (!selectedClient) return;
    await fetch(`/api/clients/${selectedClient.id}`, { method: 'DELETE' });
    setDeleteAlertOpen(false);
    refreshData();
  }

  return (
    <div className="container mx-auto mt-10 max-w-6xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">Client Hub</h1>
          <p className="text-muted-foreground mt-2">Manage all your clients in one place.</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>+ Add New Client</Button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <form className="w-full max-w-sm">
          <Input type="search" name="q" placeholder="Search by name or email..." defaultValue={searchQuery} />
        </form>
      </div>

      <ClientTable clients={clients} onEdit={handleOpenEdit} onDelete={handleOpenDelete} searchQuery={searchQuery} />

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(count / ITEMS_PER_PAGE)}
        totalCount={count}
        searchQuery={searchQuery}
      />

      {/* Modals & Dialogs */}
      <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Add New Client</DialogTitle></DialogHeader><ClientForm onSubmit={handleAddClient} submitButtonText="Save Client" /></DialogContent>
      </Dialog>
      <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Edit Client: {selectedClient?.name}</DialogTitle></DialogHeader><ClientForm client={selectedClient} onSubmit={handleEditClient} submitButtonText="Save Changes" /></DialogContent>
      </Dialog>
      <Dialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Are you sure?</DialogTitle></DialogHeader>
          <DialogDescription>This action will permanently delete the client "{selectedClient?.name}".</DialogDescription>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteAlertOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDeleteClient}>Yes, Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// CORRECTED: getServerSideProps now has the full search and pagination logic
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createPagesServerClient(ctx);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const searchQuery = ctx.query.q as string || '';
  const page = parseInt(ctx.query.page as string, 10) || 1;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .eq('user_id', session.user.id);

  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
  }

  query = query
    .order('name')
    .range(startIndex, endIndex);

  const { data: clients, error, count } = await query;

  if (error) {
    console.error("Error fetching clients:", error);
  }

  return {
    props: {
      user: session.user,
      clients: clients || [],
      count: count || 0,
      page: page,
      searchQuery: searchQuery
    },
  };
};