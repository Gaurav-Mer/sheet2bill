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
import { AlertCircle, X } from 'lucide-react';
import { Switch } from '../ui/switch';
import { AVAILABLE_TEMPLATES } from '@/lib/templates';
import { FeatureGate } from '../FeatureGate';

type BriefFormProps = {
    clients: Client[];
    initialData?: Brief & { line_items: LineItem[] };
    onSubmit: (payload: any) => void;
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
    const [templateId, setTemplateId] = useState(initialData?.template_id ?? 'zurich');

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
            access_password: password,
            template_id: templateId,
        };

        onSubmit(payload);
    }

    return (
        <div className="flex flex-col min-h-dvh">
            <form onSubmit={handleSubmit} className="flex-1 container mx-auto max-w-7xl py-4 md:py-6 pb-24 md:pb-6">
                {/* Rejection Reason Alert */}
                {initialData?.rejection_reason && (
                    <div className="mb-6 md:mb-8 p-3 md:p-4 bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-lg">
                        <div className="flex gap-2 md:gap-3">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs md:text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                                    Client Requested Changes:
                                </p>
                                <p className="mt-1 text-xs md:text-sm text-yellow-700 dark:text-yellow-300 break-words">
                                    "{initialData.rejection_reason}"
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Header --- */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold">
                        {initialData ? `Edit Brief #${initialData.brief_number}` : 'Create New Brief'}
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
                        Fill in the details below to create or update a brief.
                    </p>
                </div>

                {/* Desktop Save Button */}
                <div className="hidden md:flex justify-end mb-6">
                    <Button type="submit" size="lg" disabled={isSubmitting} isLoading={isSubmitting}>
                        {submitButtonText}
                    </Button>
                </div>

                {/* --- Main Layout --- */}
                <div className="flex flex-col gap-6 md:gap-8">
                    {/* Brief Details - Mobile First */}
                    <Card className="md:hidden">
                        <CardHeader>
                            <CardTitle>Brief Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title-mobile">Brief Title*</Label>
                                <Input id="title-mobile" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div>
                                <Label htmlFor="client-mobile">Client*</Label>
                                <Select onValueChange={setClientId} required defaultValue={clientId}>
                                    <SelectTrigger id="client-mobile" className="w-full">
                                        <SelectValue placeholder="Choose a client..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clients.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="issue-date-mobile" className="text-sm">Issue Date</Label>
                                    <Input id="issue-date-mobile" type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="due-date-mobile" className="text-sm">Due Date</Label>
                                    <Input id="due-date-mobile" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="currency-mobile">Currency</Label>
                                    <Select onValueChange={setCurrency} defaultValue={currency}>
                                        <SelectTrigger id="currency-mobile" className="w-full">
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
                                    <Label htmlFor="template-mobile">Template</Label>
                                    <FeatureGate>
                                        <Select onValueChange={setTemplateId} defaultValue={templateId}>
                                            <SelectTrigger className='w-full' id="template-mobile">
                                                <SelectValue />
                                            </SelectTrigger>
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
                            </div>
                        </CardContent>
                    </Card>

                    {/* Desktop Layout with Sidebar */}
                    <div className="hidden md:flex md:flex-row gap-8">
                        {/* --- Main Content: Line Items --- */}
                        <div className="flex-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Line Items</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
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
                                                        <td className="py-2">
                                                            <Input
                                                                placeholder="Description of work..."
                                                                value={item.description}
                                                                onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                                                                required
                                                            />
                                                        </td>
                                                        <td className="py-2 px-2">
                                                            <Input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value))}
                                                                className="w-20 text-center"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-2">
                                                            <Input
                                                                type="number"
                                                                value={item.unit_price}
                                                                onChange={(e) => handleLineItemChange(index, 'unit_price', parseFloat(e.target.value))}
                                                                className="w-24 text-right"
                                                            />
                                                        </td>
                                                        <td className="py-2 text-right text-muted-foreground pr-2">
                                                            {(item.quantity * item.unit_price).toFixed(2)}
                                                        </td>
                                                        <td className="py-2 text-right">
                                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeLineItem(index)}>
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <Button type="button" variant="outline" onClick={addLineItem} className="mt-4">
                                        + Add Item
                                    </Button>

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
                                                <Label htmlFor="password">
                                                    {initialData?.is_password_protected ? 'Set New Password' : 'Set Password'}
                                                </Label>
                                                <Input
                                                    id="password"
                                                    type="text"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder={initialData?.is_password_protected ? "Leave blank to keep current" : "Enter a password..."}
                                                    required={!initialData?.is_password_protected && isPasswordProtected}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* --- Sidebar: Metadata (Desktop) --- */}
                        <aside className="w-80 lg:w-96 flex-shrink-0">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Brief Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Brief Title*</Label>
                                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    </div>
                                    <div>
                                        <Label htmlFor="client">Client*</Label>
                                        <Select onValueChange={setClientId} required defaultValue={clientId}>
                                            <SelectTrigger id="client">
                                                <SelectValue placeholder="Choose a client..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {clients.map(c => (
                                                    <SelectItem key={c.id} value={c.id.toString()}>
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="issue-date">Issue Date</Label>
                                            <Input id="issue-date" type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
                                        </div>
                                        <div>
                                            <Label htmlFor="due-date">Due Date</Label>
                                            <Input id="due-date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select onValueChange={setCurrency} defaultValue={currency}>
                                            <SelectTrigger id="currency">
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
                                        <Label htmlFor="template">Template</Label>
                                        <FeatureGate>
                                            <Select onValueChange={setTemplateId} defaultValue={templateId}>
                                                <SelectTrigger className='w-full' id="template">
                                                    <SelectValue />
                                                </SelectTrigger>
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

                    {/* Mobile Line Items */}
                    <Card className="md:hidden">
                        <CardHeader>
                            <CardTitle>Line Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {lineItems.map((item, index) => (
                                    <div key={index} className="border rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-sm">Item {index + 1}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeLineItem(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div>
                                            <Label className="text-sm">Description</Label>
                                            <Input
                                                placeholder="Description of work..."
                                                value={item.description}
                                                onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="text-sm">Quantity</Label>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value))}
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-sm">Unit Price</Label>
                                                <Input
                                                    type="number"
                                                    value={item.unit_price}
                                                    onChange={(e) => handleLineItemChange(index, 'unit_price', parseFloat(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm pt-2 border-t">
                                            <span className="text-muted-foreground">Amount:</span>
                                            <span className="font-medium">
                                                {(item.quantity * item.unit_price).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button type="button" variant="outline" onClick={addLineItem} className="mt-4 w-full">
                                + Add Item
                            </Button>

                            {/* Password Protection - Mobile */}
                            <div className="border-t mt-6 pt-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password-protection-mobile" className="cursor-pointer">
                                        Password Protect
                                    </Label>
                                    <Switch
                                        id="password-protection-mobile"
                                        checked={isPasswordProtected}
                                        onCheckedChange={setIsPasswordProtected}
                                    />
                                </div>
                                {isPasswordProtected && (
                                    <div>
                                        <Label htmlFor="password-mobile">
                                            {initialData?.is_password_protected ? 'Set New Password' : 'Set Password'}
                                        </Label>
                                        <Input
                                            id="password-mobile"
                                            type="text"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder={initialData?.is_password_protected ? "Leave blank to keep current" : "Enter a password..."}
                                            required={!initialData?.is_password_protected && isPasswordProtected}
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* --- Footer: Notes and Totals --- */}
                    <div className="flex flex-col gap-6 md:gap-8">
                        <div>
                            <Label htmlFor="notes">Notes / Terms</Label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="e.g., Payment due within 14 days."
                                className="mt-2"
                            />
                        </div>

                        <Card>
                            <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between text-sm md:text-base text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>{totals.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center gap-4">
                                    <Label htmlFor="tax-rate" className="text-sm md:text-base text-muted-foreground">
                                        Tax Rate (%)
                                    </Label>
                                    <Input
                                        id="tax-rate"
                                        type="number"
                                        value={taxRate}
                                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                                        className="w-20 md:w-24 h-8"
                                    />
                                </div>
                                <div className="flex justify-between text-sm md:text-base text-muted-foreground">
                                    <span>Tax</span>
                                    <span>{totals.taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="border-t my-2"></div>
                                <div className="flex justify-between font-bold text-base md:text-lg text-foreground">
                                    <span>Total</span>
                                    <span>{currency} {totals.grandTotal.toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>

            {/* Fixed Bottom Button - Mobile Only */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg z-10">
                <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    className="w-full"
                    onClick={handleSubmit}
                >
                    {submitButtonText}
                </Button>
            </div>
        </div>
    );
}