/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/dashboard.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, WalletCards } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { RevenuePieChart } from '@/components/dashboard/RevenuePieChart';
import Head from 'next/head';

// Define the shape of our data, including the new activeCurrency prop
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
  activeCurrency: string; // e.g., 'all', 'INR', 'USD'
  monthlyRevenue?: any; // Data for the revenue chart
};

export default function Dashboard({ user, stats, recentBriefs, activeCurrency = "USD", monthlyRevenue }: DashboardProps) {
  const router = useRouter();
  // Helper to format currency professionally
  const formatCurrency = (amount: number | null, currency: string) => {
    // If 'all' is selected, don't show a currency symbol as it's a mixed total
    if (currency === 'all') {
      return new Intl.NumberFormat('en-IN', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount || 0);
    }
    // Otherwise, format with the selected currency
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount || 0);
  };

  const handleCurrencyChange = (value: string) => {
    const newUrl = value === 'all' ? '/dashboard' : `/dashboard?currency=${value}`;
    router.push(newUrl);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'sent': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <Head>
        <title>Dashboard | Sheet2Bill</title>
        <meta name="description" content="Your freelance command center. Track revenue, manage invoices, and monitor client briefs." />

        {/* 🔒 SECURITY: Prevent Google/Bots from indexing private user data */}
        <meta name="robots" content="noindex, nofollow" />

        {/* Open Graph (For when users save to bookmark tools like Notion/Pocket) */}
        <meta property="og:title" content="My Dashboard - Sheet2Bill" />
        <meta property="og:description" content="Manage your freelance business." />
        <meta property="og:site_name" content="Sheet2Bill" />
        <meta name="twitter:image" content="https://sheet2bill.com/landing.png" />
      </Head>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome Back, {user?.email?.split('@')[0]}!</h1>
          <p className="text-muted-foreground mt-2">Here's a snapshot of your business.</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {/* --- THIS IS THE NEW CURRENCY FILTER --- */}
          <Select defaultValue={activeCurrency} onValueChange={handleCurrencyChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Currency" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="all">All Currencies</SelectItem> */}
              <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
              <SelectItem value="USD">US Dollar (USD)</SelectItem>
              {/* Add more currencies as needed */}
            </SelectContent>
          </Select>
          <Link href="/briefs/new" passHref><Button>+ Create New Brief</Button></Link>
        </div>
      </div>

      {/* --- PREMIUM Stats Cards with Financial Data --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <WalletCards className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(stats.total_revenue, activeCurrency)}</div>
            <p className="text-xs text-muted-foreground">
              {activeCurrency === 'all' ? 'From all currencies (not converted)' : `Earnings in ${activeCurrency}`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(stats.outstanding_amount, activeCurrency)}</div>
            <p className="text-xs text-muted-foreground">
              {activeCurrency === 'all' ? 'From all currencies (not converted)' : `Pending in ${activeCurrency}`}
            </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
        <RevenueChart data={monthlyRevenue} />
        <RevenuePieChart data={monthlyRevenue} />
      </div>


      {/* --- PREMIUM Recent Briefs Table --- */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Recent Activity {activeCurrency !== 'all' && `(${activeCurrency})`}</h2>
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <tbody className="divide-y divide-border">
                {recentBriefs.length > 0 ? recentBriefs.map(brief => (
                  <tr key={brief.id} className="hover:bg-muted/fifty">
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

                    <td colSpan={2} className="p-10 text-center text-muted-foreground">
                      <div className='flex items-center justify-center gap-3 h-full flex-col'>
                        <div className='h-20 w-20 p-4 rounded-full bg-primary/10'>
                          <svg width="full" height="full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14" stroke="#61ac0c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M22 10H18C15 10 14 9 14 6V2L22 10Z" stroke="#61ac0c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </div>
                        <p className="text-xs text-center text-black/50 mt-1">  No recent activity for this currency.</p>

                      </div>
                    </td>
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

// --- THIS IS THE UPDATED getServerSideProps FUNCTION ---
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createPagesServerClient(ctx);

  // 1. CHANGE: Use getUser() instead of getSession()
  // This validates the token with Supabase Auth but lets Middleware handle the refreshing.
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  // 2. CHANGE: Check for user or error
  if (authError || !user) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const { data: profile } = await supabase.from('profiles').select('default_currency').single();
  const currencyFilter = (ctx.query.currency as string) || profile?.default_currency || 'USD';

  // 3. CHANGE: Access ID directly from user object
  const userId = user.id;

  // Run queries in parallel
  const [analyticsQuery, recentBriefsQuery] = await Promise.all([
    // 5. CALL THE NEW SQL FUNCTION
    supabase.rpc('get_dashboard_analytics', {
      currency_filter: currencyFilter === 'all' ? null : currencyFilter
    }).single(),

    (() => {
      let query = supabase.from('briefs')
        .select('id, title, status, total, currency, clients(name)')
        .eq('user_id', userId);

      // Removed console.log("query", query) for cleaner production code, add back if debugging
      if (currencyFilter && currencyFilter !== 'all') {
        query = query.eq('currency', currencyFilter);
      }
      return query.order('created_at', { ascending: false }).limit(5);
    })()
  ]);

  const { data: analytics, error: analyticsError } = analyticsQuery as any;
  const { data: recentBriefs, error: briefsError } = recentBriefsQuery;

  if (analyticsError || briefsError) {
    console.error("Dashboard Fetch Error:", analyticsError || briefsError);
  }

  return {
    props: {
      // 4. CHANGE: Pass user directly
      user: user,
      stats: analytics || { total_revenue: 0, outstanding_amount: 0, client_count: 0 },
      monthlyRevenue: analytics?.monthly_revenue || [],
      recentBriefs: recentBriefs || [],
      activeCurrency: currencyFilter,
    },
  };
};

