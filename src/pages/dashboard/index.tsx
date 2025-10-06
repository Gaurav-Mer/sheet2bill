/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/dashboard.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Define the shape of our data
type DashboardProps = {
  user: any;
  stats: {
    clientCount: number;
    draftBriefs: number;
    approvedBriefs: number;
  };
  recentBriefs: {
    id: number;
    title: string;
    status: string;
    total: number;
    currency: string;
    clients: { name: string } | null;
  }[];
};

export default function Dashboard({ user, stats, recentBriefs }: DashboardProps) {
  return (
    <div className="container mx-auto mt-10 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">A summary of your recent activity.</p>
        </div>
        <div className="flex space-x-2">
          <Link href="/clients" passHref>
            <Button variant="outline">Manage Clients</Button>
          </Link>
          <Link href="/briefs/new" passHref>
            <Button>+ Create New Brief</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Total Clients</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.clientCount}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Draft Briefs</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.draftBriefs}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Approved Briefs</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.approvedBriefs}</p></CardContent>
        </Card>
      </div>

      {/* Recent Briefs List */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Recent Briefs</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentBriefs.length > 0 ? recentBriefs.map(brief => (
                <div key={brief.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{brief.title}</p>
                    <p className="text-sm text-muted-foreground">{brief.clients?.name || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{brief.currency} {brief.total?.toFixed(2)}</p>
                    <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${brief.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {brief.status}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="p-10 text-center text-muted-foreground">You haven&apos;t created any briefs yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createPagesServerClient(ctx);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const userId = session.user.id;

  // We will run all our data fetching queries in parallel for better performance
  const [
    clientQuery,
    draftBriefsQuery,
    approvedBriefsQuery,
    recentBriefsQuery
  ] = await Promise.all([
    // Query 1: Get total client count
    supabase.from('clients').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    // Query 2: Get count of draft briefs
    supabase.from('briefs').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'draft'),
    // Query 3: Get count of approved briefs
    supabase.from('briefs').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'approved'),
    // Query 4: Get the 5 most recent briefs with client names
    supabase.from('briefs')
      .select('id, title, status, total, currency, clients(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)
  ]);

  return {
    props: {
      user: session.user,
      stats: {
        clientCount: clientQuery.count || 0,
        draftBriefs: draftBriefsQuery.count || 0,
        approvedBriefs: approvedBriefsQuery.count || 0,
      },
      recentBriefs: recentBriefsQuery.data || [],
    },
  };
};