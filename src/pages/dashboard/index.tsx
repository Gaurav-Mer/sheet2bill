/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/dashboard.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, FileText } from 'lucide-react';

// Define the shape of our data
type DashboardProps = {
  user: any;
  stats: {
    total_revenue: number;
    outstanding_amount: number;
    client_count: number;
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
  // Helper to format currency professionally
  const formatCurrency = (amount: number | null) => {
    // You can customize the currency and locale
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'sent': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'; // for 'draft'
    }
  }

  return (
    <div className="container mx-auto mt-10 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome Back, {user?.email?.split('@')[0]}!</h1>
          <p className="text-muted-foreground mt-2">Here's a snapshot of your business.</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Link href="/clients" passHref><Button variant="outline">Manage Clients</Button></Link>
          <Link href="/briefs/new" passHref><Button>+ Create New Brief</Button></Link>
        </div>
      </div>

      {/* --- PREMIUM Stats Cards with Financial Data --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(stats.total_revenue)}</div>
            <p className="text-xs text-muted-foreground">All-time earnings from paid invoices.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(stats.outstanding_amount)}</div>
            <p className="text-xs text-muted-foreground">From sent and draft invoices.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.client_count}</div>
            <p className="text-xs text-muted-foreground">Total number of clients managed.</p>
          </CardContent>
        </Card>
      </div>

      {/* --- PREMIUM Recent Briefs Table --- */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <tbody className="divide-y divide-border">
                {recentBriefs.length > 0 ? recentBriefs.map(brief => (
                  <tr key={brief.id} className="hover:bg-muted/50">
                    <td className="p-4">
                      <Link href={`/briefs/${brief.id}/edit`} className="font-semibold text-foreground hover:underline">
                        {brief.title || 'Untitled Brief'}
                      </Link>
                      <p className="text-sm text-muted-foreground">{brief.clients?.name || 'N/A'}</p>
                    </td>
                    <td className="p-4 text-right">
                      <p className="font-semibold">{brief.currency} {brief.total?.toFixed(2)}</p>
                      <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${getStatusClass(brief.status)}`}>
                        {brief.status === 'rejected' ? 'Changes Requested' : brief.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td className="p-10 text-center text-muted-foreground">You haven't created any briefs yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- PREMIUM getServerSideProps with Database Function ---
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createPagesServerClient(ctx);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  // Run queries in parallel for high performance
  const [statsQuery, recentBriefsQuery] = await Promise.all([
    supabase.rpc('get_dashboard_stats').single(),
    supabase.from('briefs').select('id, title, status, total, currency, clients(name)').limit(5).order('created_at', { ascending: false })
  ]);

  const { data: stats, error: statsError } = statsQuery;
  const { data: recentBriefs, error: briefsError } = recentBriefsQuery;

  if (statsError || briefsError) {
    console.error("Dashboard Fetch Error:", statsError || briefsError);
  }

  return {
    props: {
      user: session.user,
      stats: stats || { total_revenue: 0, outstanding_amount: 0, client_count: 0 },
      recentBriefs: recentBriefs || [],
    },
  };
};