import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Client } from '@/types';
import { TrendingUp, DollarSign, FileText, Calculator, Filter } from 'lucide-react';

type ReportStats = {
    total_revenue: number;
    total_tax: number;
    invoice_count: number;
    avg_invoice_value: number;
};

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

const formatCurrency = (amount: number | null, currency: string) => {
    if (currency === 'all') {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(amount || 0);
};

export default function ReportsPage({ stats, clients, filters }: PageProps) {
    const router = useRouter();

    const handleFilterChange = (key: string, value: string) => {
        const { _, ...rest } = router.query;
        const query = { ...rest, [key]: value };
        router.push({ pathname: '/reports', query });
    };

    const statCards = [
        {
            title: 'Total Revenue',
            value: formatCurrency(stats.total_revenue, filters.currency),
            icon: DollarSign,
            trend: '+12.5%',
            trendUp: true,
            bgGradient: 'from-emerald-500/10 to-emerald-500/5',
            iconColor: 'text-emerald-600',
            iconBg: 'bg-emerald-500/10'
        },
        {
            title: 'Taxes Collected',
            value: formatCurrency(stats.total_tax, filters.currency),
            icon: Calculator,
            trend: '+8.2%',
            trendUp: true,
            bgGradient: 'from-blue-500/10 to-blue-500/5',
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-500/10'
        },
        {
            title: 'Paid Invoices',
            value: stats.invoice_count.toString(),
            icon: FileText,
            trend: '+15.3%',
            trendUp: true,
            bgGradient: 'from-violet-500/10 to-violet-500/5',
            iconColor: 'text-violet-600',
            iconBg: 'bg-violet-500/10'
        },
        {
            title: 'Avg. Invoice Value',
            value: formatCurrency(stats.avg_invoice_value, filters.currency),
            icon: TrendingUp,
            trend: '-2.4%',
            trendUp: false,
            bgGradient: 'from-amber-500/10 to-amber-500/5',
            iconColor: 'text-amber-600',
            iconBg: 'bg-amber-500/10'
        }
    ];

    return (
        <div className="min-h-dvh ">
            <div className="container mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="mb-8 lg:mb-12">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">
                                Reports & Analytics
                            </h1>
                            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                                Track your business performance with real-time insights
                            </p>
                        </div>
                        {/* <Button className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 shadow-lg shadow-slate-900/20 transition-all duration-200 w-full sm:w-auto">
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                        </Button> */}
                    </div>
                </div>

                {/* Filter Bar */}
                <Card className="mb-2 border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">
                    <div className="px-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-slate-600" />
                            <h3 className="font-semibold text-slate-900">Filters</h3>
                        </div>
                    </div>
                    <CardContent className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
                            {/* Date Range */}
                            <div className="space-y-2">
                                <Label htmlFor="start_date" className="text-xs font-medium text-slate-700">
                                    Start Date
                                </Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    defaultValue={filters.start_date}
                                    onChange={e => handleFilterChange('start_date', e.target.value)}
                                    className="border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end_date" className="text-xs font-medium text-slate-700">
                                    End Date
                                </Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    defaultValue={filters.end_date}
                                    onChange={e => handleFilterChange('end_date', e.target.value)}
                                    className="border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                                />
                            </div>

                            {/* Client Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="client_id" className="text-xs font-medium text-slate-700">
                                    Client
                                </Label>
                                <Select
                                    defaultValue={filters.client_id}
                                    onValueChange={value => handleFilterChange('client_id', value)}
                                >
                                    <SelectTrigger id="client_id" className="border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                                        <SelectValue placeholder="All Clients" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Clients</SelectItem>
                                        {clients.map(client => (
                                            <SelectItem key={client.id} value={client.id.toString()}>
                                                {client.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Currency Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="currency" className="text-xs font-medium text-slate-700">
                                    Currency
                                </Label>
                                <Select
                                    defaultValue={filters.currency}
                                    onValueChange={value => handleFilterChange('currency', value)}
                                >
                                    <SelectTrigger id="currency" className="border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Reset Button */}
                            <div className="space-y-2 flex items-end">
                                <Button
                                    variant="outline"
                                    onClick={() => router.push('/reports')}
                                    className="w-full border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors"
                                >
                                    Reset All
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stat Cards */}
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card
                                key={index}
                                className={`border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                                    <CardTitle className="text-xs sm:text-sm font-medium text-slate-600">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`${stat.iconBg} p-2 rounded-lg transition-transform duration-300 group-hover:scale-110`}>
                                        <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                                    </div>
                                </CardHeader>

                                <CardContent className="relative z-10">
                                    <div className="space-y-2">
                                        <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                            {stat.value}
                                        </p>
                                        {/* <div className="flex items-center gap-1 text-xs">
                                            <TrendingUp
                                                className={`w-3 h-3 ${stat.trendUp ? 'text-emerald-600' : 'text-red-600 rotate-180'}`}
                                            />
                                            <span className={`font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {stat.trend}
                                            </span>
                                            <span className="text-slate-500 ml-1">vs last period</span>
                                        </div> */}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div >
    );
}

// Server-side props remain the same
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();
    if (!user || authError) return { redirect: { destination: '/login', permanent: false } };

    const { data: profile } = await supabase.from('profiles').select('default_currency').single();

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
            currency_filter: filters.currency === 'all' ? null : filters.currency,
        }).single(),
        supabase.from('clients').select('id, name').eq("user_id", user.id).order('name')
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
            filters,
        },
    };
};