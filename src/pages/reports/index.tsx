/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Client, Profile } from '@/types';

type ReportStats = {
    total_revenue: number;
    total_tax: number;
    invoice_count: number;
    avg_invoice_value: number;
};

// UPDATED: PageProps now includes currency in the filters
type PageProps = {
    stats: ReportStats;
    clients: Client[];
    filters: {
        start_date: string;
        end_date: string;
        client_id: string;
        currency: string;
    };
};

// UPDATED: Helper now formats currency dynamically
const formatCurrency = (amount: number | null, currency: string) => {
    // If 'all' is selected, just show the number, as it's a mix of currencies.
    if (currency === 'all') {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    }
    // Otherwise, format with the specific currency.
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(amount || 0);
};

export default function ReportsPage({ stats, clients, filters }: PageProps) {
    const router = useRouter();

    const handleFilterChange = (key: string, value: string) => {
        const { page, ...rest } = router.query;
        const query = { ...rest, [key]: value };
        router.push({ pathname: '/reports', query });
    };

    return (
        <div className="container mx-auto max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                <p className="text-muted-foreground mt-2">Filter and view your business performance.</p>
            </div>

            {/* --- Filter Bar --- */}
            <Card className="mb-8">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-end">
                    <div className="grid grid-cols-2 md:flex md:items-center gap-4 flex-grow">
                        <div><Label htmlFor="start_date">From</Label><Input id="start_date" type="date" defaultValue={filters.start_date} onChange={e => handleFilterChange('start_date', e.target.value)} /></div>
                        <div><Label htmlFor="end_date">To</Label><Input id="end_date" type="date" defaultValue={filters.end_date} onChange={e => handleFilterChange('end_date', e.target.value)} /></div>
                        <div>
                            <Label htmlFor="client_id">Client</Label>
                            <Select defaultValue={filters.client_id} onValueChange={value => handleFilterChange('client_id', value)}>
                                <SelectTrigger id="client_id">
                                    <SelectValue placeholder="All Clients" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Clients</SelectItem>
                                    {clients.map(client => (
                                        <SelectItem key={client.id} value={client.id.toString()}>{client.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* --- NEW: Currency Filter Dropdown --- */}
                        <div>
                            <Label htmlFor="currency">Currency</Label>
                            <Select defaultValue={filters.currency} onValueChange={value => handleFilterChange('currency', value)}>
                                <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INR">INR</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => router.push('/reports')}>Reset Filters</Button>
                </CardContent>
            </Card>

            {/* --- Dynamic Stat Cards --- */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card><CardHeader><CardTitle className="text-sm font-medium">Total Revenue</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{formatCurrency(stats.total_revenue, filters.currency)}</p></CardContent></Card>
                <Card><CardHeader><CardTitle className="text-sm font-medium">Taxes Collected</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{formatCurrency(stats.total_tax, filters.currency)}</p></CardContent></Card>
                <Card><CardHeader><CardTitle className="text-sm font-medium">Paid Invoices</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats.invoice_count}</p></CardContent></Card>
                <Card><CardHeader><CardTitle className="text-sm font-medium">Avg. Invoice Value</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{formatCurrency(stats.avg_invoice_value, filters.currency)}</p></CardContent></Card>
            </div>
        </div>
    );
}

// --- UPDATED getServerSideProps ---
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { redirect: { destination: '/login', permanent: false } };

    // Fetch user's profile to get their default currency
    const { data: profile } = await supabase.from('profiles').select('default_currency').single();

    // Read all filters from the URL, with intelligent defaults
    const filters = {
        start_date: ctx.query.start_date as string || '',
        end_date: ctx.query.end_date as string || '',
        client_id: ctx.query.client_id as string || 'all',
        currency: (ctx.query.currency as string) || profile?.default_currency || 'USD',
    };

    const [statsQuery, clientsQuery] = await Promise.all([
        supabase.rpc('get_revenue_report', {
            start_date: filters.start_date || null,
            end_date: filters.end_date || null,
            client_id_filter: filters.client_id === 'all' ? null : parseInt(filters.client_id),
            // CORRECTED: Pass the currency filter to the RPC function
            currency_filter: filters.currency === 'all' ? null : filters.currency,
        }).single(),
        supabase.from('clients').select('id, name').order('name')
    ]);

    const { data: stats, error: statsError } = statsQuery;
    const { data: clients, error: clientsError } = clientsQuery;

    if (statsError || clientsError) {
        console.error("Reports page error:", statsError || clientsError);
    }

    return {
        props: {
            stats: stats || { total_revenue: 0, total_tax: 0, invoice_count: 0, avg_invoice_value: 0 },
            clients: clients || [],
            filters, // Pass the active filters to the page
        },
    };
};