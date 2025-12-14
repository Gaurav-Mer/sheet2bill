/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ClientTable } from '@/components/clients/ClientTable';
import { Pagination } from '@/components/clients/Pagination';
import { ClientForm } from '@/components/clients/Clientform';
import toast from 'react-hot-toast';
import { UpgradeModal } from '@/components/UpgradeModal';

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
  const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');

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
    try {
      const formData = new FormData(event.currentTarget);
      console.log("formData", Object.fromEntries(formData))
      return
      const res = await fetch('/api/clients', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 402) {
          setAddModalOpen(false);
          setUpgradeMessage(errorData.message);
          setUpgradeModalOpen(true);
        } else {
          throw new Error(errorData.message || 'An unknown error occurred.');
        }
        return;
      }
      setAddModalOpen(false);
      refreshData();
    } catch (error: any) {
      console.log("error is ", error)
      toast.error(error.message);

    }
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
    <div className="mx-auto max-w-7xl ">
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        message={upgradeMessage}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Client Hub</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage all your clients in one place.
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)} className="w-full sm:w-auto hidden md:block">
          + Add New Client
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 items-stretch sm:items-center mb-6">
        <form className="flex w-full max-w-md">
          <Input
            type="search"
            name="q"
            placeholder="Search by name or email..."
            className="rounded-r-none flex-1"
            defaultValue={searchQuery}
          />
          <Button type="submit" className="rounded-l-none whitespace-nowrap">
            Search
          </Button>
        </form>
      </div>

      {/* Client Table */}
      <div className="overflow-x-auto rounded-lg  ">
        <ClientTable
          clients={clients}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          searchQuery={searchQuery}
        />
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(count / ITEMS_PER_PAGE)}
          totalCount={count}
          searchQuery={searchQuery}
          basePath="/clients"
          itemPerPage={ITEMS_PER_PAGE}
        />
        <div className=' fixed bottom-0 left-0 md:hidden w-full p-4  bg-background border-t'>
          <Button onClick={() => setAddModalOpen(true)} className="w-full sm:w-auto  ">
            + Add New Client
          </Button>
        </div>
      </div>

      {/* Modals */}
      <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <ClientForm onSubmit={handleAddClient} submitButtonText="Save Client" />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Client: {selectedClient?.name}</DialogTitle>
          </DialogHeader>
          <ClientForm client={selectedClient} onSubmit={handleEditClient} submitButtonText="Save Changes" />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            This action will permanently delete the client "{selectedClient?.name}".
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAlertOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteClient}>Yes, Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createPagesServerClient(ctx);
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (!user || authError) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const searchQuery = (ctx.query.q as string) || '';
  const page = parseInt(ctx.query.page as string, 10) || 1;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id);

  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
  }

  query = query.order('name').range(startIndex, endIndex);
  const { data: clients, error, count } = await query;

  if (error) console.error("Error fetching clients:", error);

  return {
    props: {
      user: user,
      clients: clients || [],
      count: count || 0,
      page,
      searchQuery,
    },
  };
};
