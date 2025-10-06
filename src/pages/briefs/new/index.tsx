/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/briefs/new.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState, useMemo } from 'react';
// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

type Client = { id: number; name: string; };
type LineItem = {
    description: string;
    quantity: number;
    unit_price: number;
};

// Function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

export default function NewBriefPage({ clients }: { clients: Client[] }) {
    const router = useRouter();

    // --- State Management ---
    const [title, setTitle] = useState('');
    const [clientId, setClientId] = useState<string>('');
    const [notes, setNotes] = useState('Payment due within 14 days.');
    const [taxRate, setTaxRate] = useState<number>(0);
    const [currency, setCurrency] = useState('INR');
    const [issueDate, setIssueDate] = useState(getTodayDate());
    const [dueDate, setDueDate] = useState('');

    const [lineItems, setLineItems] = useState<LineItem[]>([
        { description: '', quantity: 1, unit_price: 0 }
    ]);

    // --- NEW: TanStack Query Mutation ---
    const createBriefMutation = useMutation({
        mutationFn: async (newBrief: any) => {
            const response = await fetch('/api/briefs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBrief),
            });
            if (!response.ok) {
                throw new Error('Failed to create brief');
            }
            return response.json();
        },
        onSuccess: () => {
            toast.success('Brief saved successfully!');
            // We will redirect to a briefs list page in the future
            router.push('/briefs');
        },
        onError: (error) => {
            toast.error('Error saving brief. Please try again.');
            console.error(error);
        },
    });

    // --- Calculations ---
    const totals = useMemo(() => {
        const subtotal = lineItems.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
        const taxAmount = subtotal * (taxRate / 100);
        const grandTotal = subtotal + taxAmount;
        return {
            subtotal: subtotal,
            taxAmount: taxAmount,
            grandTotal: grandTotal,
        };
    }, [lineItems, taxRate]);

    // --- Event Handlers ---
    const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
        const updatedLineItems = [...lineItems];
        updatedLineItems[index] = { ...updatedLineItems[index], [field]: value };
        setLineItems(updatedLineItems);
    };

    const addLineItem = () => {
        setLineItems([...lineItems, { description: '', quantity: 1, unit_price: 0 }]);
    };

    const removeLineItem = (index: number) => {
        const updatedLineItems = lineItems.filter((_, i) => i !== index);
        setLineItems(updatedLineItems);
    };

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!clientId) {
            alert('Please select a client.');
            return;
        }
        // Call the mutation with the payload
        createBriefMutation.mutate({
            clientId, lineItems, title, currency, notes,
            subtotal: totals.subtotal,
            tax_rate: taxRate,
            tax_amount: totals.taxAmount,
            total: totals.grandTotal,
            issue_date: issueDate,
            due_date: dueDate || null,
        });
    }

    return (
        <div className="container mx-auto  max-w-7xl">
            <form onSubmit={handleSubmit}>
                {/* --- Header --- */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Create New Brief</h1>
                        <p className="text-muted-foreground mt-2">Brief # will be auto-generated upon saving.</p>
                    </div>
                    <Button isLoading={createBriefMutation.isPending} type="submit" size="lg">Save Draft Brief</Button>
                </div>

                {/* --- Main Two-Column Layout --- */}
                <div className="flex flex-col md:flex-row gap-8">

                    {/* --- Main Content: Line Items --- */}
                    <div className="flex-grow">
                        <Card>
                            <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
                            <CardContent>
                                <table className="w-full">
                                    <thead className="text-left text-muted-foreground text-sm">
                                        <tr>
                                            <th className="pb-2 font-normal w-1/2">Description</th>
                                            <th className="pb-2 font-normal">Qty</th>
                                            <th className="pb-2 font-normal">Unit Price</th>
                                            <th className="pb-2 font-normal text-right">Amount</th>
                                            <th className="w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lineItems.map((item, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="py-2"><Input placeholder="Description of work..." value={item.description} onChange={(e) => handleLineItemChange(index, 'description', e.target.value)} required /></td>
                                                <td className="py-2 px-2"><Input type="number" value={item.quantity} onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} className="w-20" /></td>
                                                <td className="py-2 px-2"><Input type="number" value={item.unit_price} onChange={(e) => handleLineItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)} className="w-24" /></td>
                                                <td className="py-2 text-right text-muted-foreground">{(item.quantity * item.unit_price).toFixed(2)}</td>
                                                <td className="py-2 text-right"><Button type="button" variant="ghost" size="sm" onClick={() => removeLineItem(index)}>X</Button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Button type="button" variant="outline" onClick={addLineItem} className="mt-4">+ Add Item</Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- Sidebar: Metadata --- */}
                    <aside className="w-full md:w-80 lg:w-96 flex-shrink-0">
                        <Card>
                            <CardHeader><CardTitle>Brief Details</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Brief Title*</Label>
                                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                                <div>
                                    <Label className='w-full' htmlFor="client">Client*</Label>
                                    <Select onValueChange={setClientId} required><SelectTrigger id="client" className='w-full'><SelectValue placeholder="Choose a client..." /></SelectTrigger><SelectContent className='w-full'>{clients.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent></Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label htmlFor="issue-date">Issue Date</Label><Input id="issue-date" type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} /></div>
                                    <div><Label htmlFor="due-date">Due Date</Label><Input id="due-date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
                                </div>
                                <div>
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select onValueChange={setCurrency} defaultValue={currency}>
                                        <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="INR">INR</SelectItem><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem></SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>
                </div>

                {/* --- Footer: Notes and Totals --- */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                        <Label htmlFor="notes">Notes / Terms</Label>
                        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Payment due within 14 days." />
                    </div>
                    <div className="space-y-4 rounded-lg border p-4 self-start">
                        <div className="flex justify-between items-center text-muted-foreground">
                            <span>Subtotal</span>
                            <span>{totals.subtotal}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <Label htmlFor="tax-rate" className="text-muted-foreground">Tax Rate (%)</Label>
                            <Input id="tax-rate" type="number" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} className="w-24 h-8" />
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Tax</span>
                            <span>{totals.taxAmount}</span>
                        </div>
                        <div className="border-t"></div>
                        <div className="flex justify-between font-bold text-lg text-foreground">
                            <span>Total</span>
                            <span>{currency} {totals.grandTotal}</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

// getServerSideProps remains the same
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return { redirect: { destination: '/login', permanent: false } };
    }

    const { data: clients } = await supabase
        .from('clients')
        .select('id, name')
        .eq('user_id', session.user.id);

    return { props: { clients: clients || [] } };
};