/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/briefs/BriefForm.tsx
import { FormEvent, useState, useMemo } from 'react';
// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Import your central types
import { Client, Brief, LineItem } from '@/types';
import { AlertCircle } from 'lucide-react';
import { Switch } from '../ui/switch';
import { AVAILABLE_TEMPLATES } from '@/lib/templates';
import { FeatureGate } from '../FeatureGate';

type BriefFormProps = {
    clients: Client[];
    initialData?: Brief & { line_items: LineItem[] };
    onSubmit: (payload: any) => void; // Changed from Promise<any> to void for useMutation's mutate function
    submitButtonText: string;
    isSubmitting: boolean;
};

// Function to get today's date in YYYY-MM-DD format
const getFormattedDate = (date?: string | Date) => {
    if (!date) return '';
    const d = new Date(date);
    // Adjust for timezone offset before converting to ISO string
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
}

export function BriefForm({ clients, initialData, onSubmit, submitButtonText, isSubmitting }: BriefFormProps) {
    // --- State Management ---
    const [title, setTitle] = useState(initialData?.title || '');
    const [clientId, setClientId] = useState(initialData?.client_id?.toString() || '');
    const [notes, setNotes] = useState(initialData?.notes || 'Payment due within 14 days.');
    const [taxRate, setTaxRate] = useState<number>(initialData?.tax_rate || 0);
    const [currency, setCurrency] = useState(initialData?.currency || 'INR');
    const [issueDate, setIssueDate] = useState(getFormattedDate(initialData?.issue_date) || getFormattedDate(new Date()));
    const [dueDate, setDueDate] = useState(getFormattedDate(initialData?.due_date));
    const [lineItems, setLineItems] = useState<LineItem[]>(initialData?.line_items.length ? initialData.line_items : [{ description: '', quantity: 1, unit_price: 0 }]);
    const [isPasswordProtected, setIsPasswordProtected] = useState(initialData?.is_password_protected || false);
    const [password, setPassword] = useState('');
    const [templateId, setTemplateId] = useState(initialData?.template_id ?? 'zurich'); // NEW: State for selected template

    // --- Calculations ---
    const totals = useMemo(() => {
        const subtotal = lineItems.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
        const taxAmount = subtotal * (taxRate / 100);
        const grandTotal = subtotal + taxAmount;
        return { subtotal, taxAmount, grandTotal };
    }, [lineItems, taxRate]);

    // --- Event Handlers ---
    const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
        const updatedLineItems = [...lineItems];
        const item = updatedLineItems[index];
        if (item) {
            (item[field] as any) = value;
            setLineItems(updatedLineItems);
        }
    };

    const addLineItem = () => {
        setLineItems([...lineItems, { description: '', quantity: 1, unit_price: 0 }]);
    };

    const removeLineItem = (index: number) => {
        const updatedLineItems = lineItems.filter((_, i) => i !== index);
        setLineItems(updatedLineItems);
    };

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (!clientId) {
            // Replaced alert with a placeholder for a toast notification
            console.error('Please select a client.');
            return;
        }

        const payload = {
            client_id: parseInt(clientId),
            lineItems, title, currency, notes,
            subtotal: totals.subtotal,
            tax_rate: taxRate,
            tax_amount: totals.taxAmount,
            total: totals.grandTotal,
            issue_date: issueDate,
            due_date: dueDate || null,
            status: 'draft',
            is_password_protected: isPasswordProtected,
            access_password: password, // Send the plain password to the API to be hashed
        };

        onSubmit(payload);
    }

    return (
        <form onSubmit={handleSubmit} className="container mx-auto max-w-7xl">
            {initialData?.rejection_reason && (
                <div className="mb-8 p-4 bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                                Client Requested Changes:
                            </p>
                            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                                "{initialData.rejection_reason}"
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {/* --- Header --- */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{initialData ? `Edit Brief #${initialData.brief_number}` : 'Create New Brief'}</h1>
                    <p className="text-muted-foreground mt-2">Fill in the details below to create or update a brief.</p>
                </div>
                <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : submitButtonText}
                </Button>
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
                                        <th className="pb-2 font-normal text-center">Qty</th>
                                        <th className="pb-2 font-normal text-right">Unit Price</th>
                                        <th className="pb-2 font-normal text-right">Amount</th>
                                        <th className="w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lineItems.map((item, index) => (
                                        <tr key={index} className="border-b last:border-b-0">
                                            <td className="py-2"><Input placeholder="Description of work..." value={item.description} onChange={(e) => handleLineItemChange(index, 'description', e.target.value)} required /></td>
                                            <td className="py-2 px-2"><Input type="number" value={item.quantity} onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value))} className="w-20 text-center" /></td>
                                            <td className="py-2 px-2"><Input type="number" value={item.unit_price} onChange={(e) => handleLineItemChange(index, 'unit_price', parseFloat(e.target.value))} className="w-24 text-right" /></td>
                                            <td className="py-2 text-right text-muted-foreground pr-2">{(item.quantity * item.unit_price).toFixed(2)}</td>
                                            <td className="py-2 text-right"><Button type="button" variant="ghost" size="sm" onClick={() => removeLineItem(index)}>X</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Button type="button" variant="outline" onClick={addLineItem} className="mt-4">+ Add Item</Button>

                            <div className="border-t mt-4 pt-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password-protection" className="cursor-pointer">Password Protect</Label>
                                    <Switch
                                        id="password-protection"
                                        checked={isPasswordProtected}
                                        onCheckedChange={setIsPasswordProtected}
                                    />
                                </div>
                                {isPasswordProtected && (
                                    <div>
                                        {/* UPDATED: Change the label and add a helpful placeholder */}
                                        <Label htmlFor="password">{initialData?.is_password_protected ? 'Set New Password' : 'Set Password'}</Label>
                                        <Input
                                            id="password"
                                            type="text" // Can be "password" if you want to hide it
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder={initialData?.is_password_protected ? "Leave blank to keep current" : "Enter a password..."}
                                            // The password is only required if the user is turning protection ON for the first time
                                            required={!initialData?.is_password_protected && isPasswordProtected}
                                        />
                                    </div>
                                )}
                            </div>
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
                                <Label htmlFor="client">Client*</Label>
                                <Select onValueChange={setClientId} required defaultValue={clientId}><SelectTrigger id="client"><SelectValue placeholder="Choose a client..." /></SelectTrigger><SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent></Select>
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
                            <div>
                                <Label htmlFor="template">Template</Label>
                                <FeatureGate>
                                    <Select onValueChange={setTemplateId} defaultValue={templateId}>
                                        <SelectTrigger className='w-full' id="template"><SelectValue /></SelectTrigger>
                                        <SelectContent className='w-full'>
                                            {AVAILABLE_TEMPLATES.map(template => (
                                                <SelectItem key={template.id} value={template.id as string}>
                                                    {template.name}
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

            {/* --- Footer: Notes and Totals --- */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div>
                    <Label htmlFor="notes">Notes / Terms</Label>
                    <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Payment due within 14 days." />
                </div>
                <div className="space-y-2 rounded-lg border p-4 self-start">
                    <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{totals.subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between items-center"><Label htmlFor="tax-rate" className="text-muted-foreground">Tax Rate (%)</Label><Input id="tax-rate" type="number" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} className="w-24 h-8" /></div>
                    <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>{totals.taxAmount.toFixed(2)}</span></div>
                    <div className="border-t"></div>
                    <div className="flex justify-between font-bold text-lg text-foreground"><span>Total</span><span>{currency} {totals.grandTotal.toFixed(2)}</span></div>
                </div>
            </div>
        </form>
    );
}