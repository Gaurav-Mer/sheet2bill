/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/briefs/new.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AVAILABLE_TEMPLATES } from '@/lib/templates';
import { FeatureGate } from '@/components/FeatureGate';

type Client = { id: number; name: string };
type LineItem = { description: string; quantity: number; unit_price: number };

// Utility: Format date
const getTodayDate = () => new Date().toISOString().split('T')[0];

export default function NewBriefPage({ clients }: { clients: Client[] }) {
    const router = useRouter();

    // Form state
    const [title, setTitle] = useState('');
    const [clientId, setClientId] = useState<string>('');
    const [notes, setNotes] = useState('Payment due within 14 days.');
    const [taxRate, setTaxRate] = useState<number>(0);
    const [currency, setCurrency] = useState('INR');
    const [issueDate, setIssueDate] = useState(getTodayDate());
    const [dueDate, setDueDate] = useState('');
    const [templateId, setTemplateId] = useState('zurich');
    const [lineItems, setLineItems] = useState<LineItem[]>([
        { description: '', quantity: 1, unit_price: 0 },
    ]);

    // Mutation to save brief
    const createBriefMutation = useMutation({
        mutationFn: async (newBrief: any) => {
            const res = await fetch('/api/briefs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBrief),
            });
            if (!res.ok) throw new Error('Failed to create brief');
            return res.json();
        },
        onSuccess: () => {
            toast.success('Brief saved successfully!');
            router.push('/briefs');
        },
        onError: (error) => {
            console.error(error);
            toast.error('Error saving brief. Please try again.');
        },
    });

    // Compute totals
    const totals = useMemo(() => {
        const subtotal = lineItems.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);
        const taxAmount = subtotal * (taxRate / 100);
        const grandTotal = subtotal + taxAmount;
        return { subtotal, taxAmount, grandTotal };
    }, [lineItems, taxRate]);

    // Handlers
    const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
        const updated = [...lineItems];
        updated[index] = { ...updated[index], [field]: value };
        setLineItems(updated);
    };

    const addLineItem = () =>
        setLineItems([...lineItems, { description: '', quantity: 1, unit_price: 0 }]);

    const removeLineItem = (index: number) =>
        setLineItems(lineItems.filter((_, i) => i !== index));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return toast.error('Brief title is required.');
        if (!clientId) return toast.error('Please select a client.');
        if (!lineItems.some((item) => item.description.trim() && item.unit_price > 0))
            return toast.error('Add at least one valid line item.');

        createBriefMutation.mutate({
            clientId,
            lineItems,
            title,
            currency,
            notes,
            subtotal: totals.subtotal,
            tax_rate: taxRate,
            tax_amount: totals.taxAmount,
            total: totals.grandTotal,
            issue_date: issueDate,
            due_date: dueDate || null,
            template_id: templateId,
        });
    };

    return (
        <div className="container mx-auto max-w-7xl">
            <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Create New Brief</h1>
                        <p className="text-muted-foreground mt-2">Brief # will be auto-generated upon saving.</p>
                    </div>
                    <Button
                        type="submit"
                        size="lg"
                        disabled={createBriefMutation.isPending}
                        isLoading={createBriefMutation.isPending}
                    >
                        Save Draft Brief
                    </Button>
                </div>

                {/* Main Layout */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left: Line Items */}
                    <div className="flex-grow">
                        <Card>
                            <CardHeader>
                                <CardTitle>Line Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <table className="w-full text-sm">
                                    <thead className="text-muted-foreground">
                                        <tr>
                                            <th className="text-left pb-2">Description</th>
                                            <th className="pb-2">Qty</th>
                                            <th className="pb-2">Unit Price</th>
                                            <th className="text-right pb-2">Amount</th>
                                            <th className="w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lineItems.map((item, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="py-2">
                                                    <Input
                                                        placeholder="Description..."
                                                        value={item.description}
                                                        onChange={(e) =>
                                                            handleLineItemChange(index, 'description', e.target.value)
                                                        }
                                                        required
                                                    />
                                                </td>
                                                <td className="py-2 px-2 w-20">
                                                    <Input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)
                                                        }
                                                    />
                                                </td>
                                                <td className="py-2 px-2 w-24">
                                                    <Input
                                                        type="number"
                                                        value={item.unit_price}
                                                        onChange={(e) =>
                                                            handleLineItemChange(
                                                                index,
                                                                'unit_price',
                                                                parseFloat(e.target.value) || 0
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="py-2 text-right text-muted-foreground">
                                                    {(item.quantity * item.unit_price).toFixed(2)}
                                                </td>
                                                <td className="py-2 text-right">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeLineItem(index)}
                                                    >
                                                        ✕
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Button type="button" variant="outline" onClick={addLineItem} className="mt-4">
                                    + Add Item
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Details */}
                    <aside className="w-full md:w-80 lg:w-96 flex-shrink-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Brief Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Brief Title*</Label>
                                    <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>

                                <div>
                                    <Label>Client*</Label>
                                    <Select onValueChange={setClientId} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a client..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map((c) => (
                                                <SelectItem key={c.id} value={c.id.toString()}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Issue Date</Label>
                                        <Input
                                            type="date"
                                            value={issueDate}
                                            onChange={(e) => setIssueDate(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Due Date</Label>
                                        <Input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label>Currency</Label>
                                    <Select onValueChange={setCurrency} defaultValue={currency}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INR">INR</SelectItem>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="EUR">EUR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Template</Label>
                                    <FeatureGate>
                                        <Select onValueChange={setTemplateId} defaultValue={templateId}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {AVAILABLE_TEMPLATES.map((t) => (
                                                    <SelectItem key={t.id} value={t.id}>
                                                        {t.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FeatureGate>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>
                </div>

                {/* Footer: Notes & Totals */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                        <Label>Notes / Terms</Label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g., Payment due within 14 days."
                        />
                    </div>

                    <div className="space-y-3 border rounded-lg p-4 self-start">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span>{totals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <Label className="text-muted-foreground">Tax Rate (%)</Label>
                            <Input
                                type="number"
                                value={taxRate}
                                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                                className="w-24 h-8"
                            />
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Tax</span>
                            <span>{totals.taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="border-t my-2"></div>
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>
                                {currency} {totals.grandTotal.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

// --- Server Side ---
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (!session) return { redirect: { destination: '/login', permanent: false } };

    const { data: clients } = await supabase
        .from('clients')
        .select('id, name')
        .eq('user_id', session.user.id);

    return { props: { clients: clients || [] } };
};
