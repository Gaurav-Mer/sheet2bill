import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { SignupModal } from '@/components/SignupModal';

export const DRAFT_KEY = 'sheet2bill_draft';

type LineItem = { description: string; quantity: number; unit_price: number };

export interface BriefDraft {
    clientName: string;
    title: string;
    lineItems: LineItem[];
    currency: 'INR' | 'USD';
    notes: string;
}

export default function TryPage() {
    const [title, setTitle] = useState('');
    const [clientName, setClientName] = useState('');
    const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
    const [notes, setNotes] = useState('Payment due within 14 days.');
    const [lineItems, setLineItems] = useState<LineItem[]>([
        { description: '', quantity: 1, unit_price: 0 },
    ]);
    const [showModal, setShowModal] = useState(false);

    // Restore any previously saved draft so users don't lose work on revisit
    useEffect(() => {
        try {
            const raw = localStorage.getItem(DRAFT_KEY);
            if (!raw) return;
            const draft = JSON.parse(raw) as BriefDraft;
            if (draft.title) setTitle(draft.title);
            if (draft.clientName) setClientName(draft.clientName);
            if (draft.currency) setCurrency(draft.currency);
            if (draft.notes) setNotes(draft.notes);
            if (Array.isArray(draft.lineItems) && draft.lineItems.length > 0) {
                setLineItems(draft.lineItems);
            }
        } catch {}
    }, []);

    const totals = useMemo(() => {
        const subtotal = lineItems.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);
        return { subtotal, grandTotal: subtotal };
    }, [lineItems]);

    const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
        const updated = [...lineItems];
        updated[index] = { ...updated[index], [field]: value };
        setLineItems(updated);
    };

    const addLineItem = () =>
        setLineItems(prev => [...prev, { description: '', quantity: 1, unit_price: 0 }]);

    const removeLineItem = (index: number) => {
        if (lineItems.length === 1) return;
        setLineItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Please add an invoice title.');
            return;
        }
        if (!clientName.trim()) {
            toast.error('Please enter a client name.');
            return;
        }
        if (!lineItems.some(item => item.description.trim() && item.unit_price > 0)) {
            toast.error('Add at least one line item with a description and price.');
            return;
        }

        const draft: BriefDraft = {
            clientName: clientName.trim(),
            title: title.trim(),
            lineItems: lineItems.filter(item => item.description.trim()),
            currency,
            notes,
        };

        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        } catch {}

        setShowModal(true);
    };

    const currencySymbol = currency === 'INR' ? '₹' : '$';
    const formatAmount = (n: number) =>
        currency === 'INR'
            ? n.toLocaleString('en-IN', { maximumFractionDigits: 2 })
            : n.toLocaleString('en-US', { maximumFractionDigits: 2 });

    return (
        <div className="min-h-screen bg-zinc-50/50 font-sans antialiased">
            <Head>
                <title>Create Your Invoice — Sheet2Bill</title>
                <meta name="description" content="Create a professional invoice in minutes. No signup required to start." />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            {/* Nav */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-zinc-200/60">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Logo className="h-5 w-5 text-zinc-900" />
                        <span className="font-semibold text-sm text-zinc-900 tracking-tight">Sheet2Bill</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors hidden sm:block">
                            Sign in
                        </Link>
                        <Link href="/signup">
                            <Button size="sm" variant="outline" className="text-xs h-8">
                                Create account
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 pb-16">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Create Your Invoice</h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        Fill in your details below. We&apos;ll save your draft when you&apos;re ready.
                    </p>
                </div>

                <form onSubmit={handleSave} noValidate>
                    <div className="flex flex-col lg:flex-row gap-6">

                        {/* Line Items */}
                        <div className="flex-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Line Items</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* Mobile: stacked cards */}
                                    <div className="md:hidden space-y-3">
                                        {lineItems.map((item, index) => (
                                            <div key={index} className="border border-zinc-200 rounded-lg p-3 space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Item {index + 1}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-zinc-300 hover:text-red-500 hover:bg-red-50"
                                                        onClick={() => removeLineItem(index)}
                                                        disabled={lineItems.length === 1}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-zinc-500">Description</Label>
                                                    <Input
                                                        placeholder="e.g. Website design, Logo creation..."
                                                        value={item.description}
                                                        onChange={e => handleLineItemChange(index, 'description', e.target.value)}
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <Label className="text-xs text-zinc-500">Qty</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="any"
                                                            value={item.quantity}
                                                            onChange={e => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs text-zinc-500">Unit Price ({currencySymbol})</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="any"
                                                            value={item.unit_price}
                                                            onChange={e => handleLineItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center text-sm border-t border-zinc-100 pt-2">
                                                    <span className="text-zinc-500">Amount</span>
                                                    <span className="font-semibold text-zinc-900">
                                                        {currencySymbol}{formatAmount(item.quantity * item.unit_price)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop: table */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-zinc-100">
                                                    <th className="text-left pb-2.5 text-xs font-medium text-zinc-400 uppercase tracking-wide">Description</th>
                                                    <th className="pb-2.5 text-xs font-medium text-zinc-400 uppercase tracking-wide w-20">Qty</th>
                                                    <th className="pb-2.5 text-xs font-medium text-zinc-400 uppercase tracking-wide w-32">Unit Price</th>
                                                    <th className="text-right pb-2.5 text-xs font-medium text-zinc-400 uppercase tracking-wide w-28">Amount</th>
                                                    <th className="w-10" />
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {lineItems.map((item, index) => (
                                                    <tr key={index} className="border-b border-zinc-100">
                                                        <td className="py-2 pr-2">
                                                            <Input
                                                                placeholder="e.g. Website design, Consulting..."
                                                                value={item.description}
                                                                onChange={e => handleLineItemChange(index, 'description', e.target.value)}
                                                                className="text-sm"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-1">
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="any"
                                                                value={item.quantity}
                                                                onChange={e => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                                className="text-sm"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-1">
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="any"
                                                                value={item.unit_price}
                                                                onChange={e => handleLineItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                                className="text-sm"
                                                            />
                                                        </td>
                                                        <td className="py-2 text-right font-medium text-zinc-700 tabular-nums">
                                                            {currencySymbol}{formatAmount(item.quantity * item.unit_price)}
                                                        </td>
                                                        <td className="py-2 pl-2">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 w-7 p-0 text-zinc-300 hover:text-red-500 hover:bg-red-50"
                                                                onClick={() => removeLineItem(index)}
                                                                disabled={lineItems.length === 1}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addLineItem}
                                        className="mt-4 gap-1.5 text-xs"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add Item
                                    </Button>

                                    {/* Totals */}
                                    <div className="mt-5 pt-4 border-t border-zinc-100 space-y-1.5 max-w-xs ml-auto">
                                        <div className="flex justify-between text-sm text-zinc-500">
                                            <span>Subtotal</span>
                                            <span className="tabular-nums">{currencySymbol}{formatAmount(totals.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-base font-semibold text-zinc-900">
                                            <span>Total</span>
                                            <span className="tabular-nums">{currencySymbol}{formatAmount(totals.grandTotal)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Invoice Details */}
                        <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Invoice Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="invoice-title">
                                            Invoice Title <span className="text-red-400">*</span>
                                        </Label>
                                        <Input
                                            id="invoice-title"
                                            placeholder="e.g. Website Redesign Project"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            className="mt-1.5"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="client-name">
                                            Client Name <span className="text-red-400">*</span>
                                        </Label>
                                        <Input
                                            id="client-name"
                                            placeholder="e.g. Acme Corp"
                                            value={clientName}
                                            onChange={e => setClientName(e.target.value)}
                                            className="mt-1.5"
                                        />
                                    </div>

                                    <div>
                                        <Label>Currency</Label>
                                        <div className="flex rounded-lg border border-zinc-200 overflow-hidden mt-1.5">
                                            {(['INR', 'USD'] as const).map(c => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => setCurrency(c)}
                                                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                                                        currency === c
                                                            ? 'bg-zinc-900 text-white'
                                                            : 'bg-white text-zinc-600 hover:bg-zinc-50'
                                                    }`}
                                                >
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="notes">Notes</Label>
                                        <Textarea
                                            id="notes"
                                            value={notes}
                                            onChange={e => setNotes(e.target.value)}
                                            rows={3}
                                            className="mt-1.5 text-sm resize-none"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                            >
                                Save & Send Invoice
                            </Button>

                            <p className="text-center text-xs text-zinc-400 leading-relaxed">
                                Free account required to send.{' '}
                                <span className="text-zinc-500">Takes 30 seconds.</span>
                            </p>
                        </aside>
                    </div>
                </form>
            </main>

            <SignupModal
                open={showModal}
                onOpenChange={setShowModal}
                invoiceTitle={title}
            />
        </div>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
    const { data: { user } } = await supabase.auth.getUser();
    // Logged-in users go directly to the real form
    if (user) {
        return { redirect: { destination: '/briefs/new', permanent: false } };
    }
    return { props: {} };
};

TryPage.getLayout = function getLayout(page: ReactElement) {
    return page;
};
