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
import Image from 'next/image';
import { Check, CircleX, Plus, Search } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Client = { id: number; name: string };
type LineItem = { description: string; quantity: number; unit_price: number };

// Utility: Format date
const getTodayDate = () => new Date().toISOString().split('T')[0];

export default function NewBriefPage({ clients, items }: { clients: Client[], items: any[] }) {
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
    // --- NEW STATE FOR ITEM MODAL ---
    const [isItemModalOpen, setItemModalOpen] = useState<null | number>(null);
    const [itemSearchQuery, setItemSearchQuery] = useState('');
    console.log("lineItems", lineItems)
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
        //for the new one opening modal
        if (value === "add_new_sheet2bill") {
            return setItemModalOpen(index)
        }
        if (!value || value === "add_new_sheet2bill") return
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

    // Filter items based on search
    const addNewVal = (name: string, index: number) => {
        setLineItems(prev => {
            const data = [...prev]
            data[index] = { ...data[index], description: name }
            console.log("update is ", data)
            return data
        })
        //close dialog and reset search
        setItemModalOpen(null);
        setItemSearchQuery('');
    }


    const isAddedItem = (item: string) => {
        const selected = items?.find(it => String(it.id) === String(item))
        if (!selected) return item
        return selected?.name
    }
    return (
        <div className="flex flex-col min-h-dvh">
            {/* Main Content */}
            <div className="flex-1 container mx-auto max-w-7xl pb-16 md:pb-8">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="flex flex-row w-full justify-between items-center  gap-3 mb-6 md:mb-8 pt-4 md:pt-0">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">Create New Brief</h1>
                            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                                Brief # will be auto-generated upon saving.
                            </p>
                        </div>
                        {/* Desktop Save Button */}
                        <div className="hidden md:block">
                            <Button
                                type="submit"
                                size="lg"
                                disabled={createBriefMutation.isPending}
                                isLoading={createBriefMutation.isPending}
                            >
                                Save Draft Brief
                            </Button>
                        </div>
                    </div>

                    {/* Main Layout */}
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* Line Items Section */}
                        <div className="flex-1 w-full">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg sm:text-xl">Line Items</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* Mobile: Stacked Cards */}
                                    <div className="md:hidden space-y-4">
                                        {lineItems.map((item, index) => (
                                            <div key={index} className="border rounded-lg p-3 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        Item {index + 1}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeLineItem(index)}
                                                    >
                                                        ✕
                                                    </Button>
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Description</Label>
                                                    <Input
                                                        placeholder="Description..."
                                                        value={item.description}
                                                        onChange={(e) =>
                                                            handleLineItemChange(index, 'description', e.target.value)
                                                        }
                                                        required
                                                    />

                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <Label className="text-xs">Quantity</Label>
                                                        <Input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) =>
                                                                handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Unit Price</Label>
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
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center pt-2 border-t">
                                                    <span className="text-sm font-medium">Amount</span>
                                                    <span className="text-sm font-semibold">
                                                        {(item.quantity * item.unit_price).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop: Table View */}
                                    <div className="hidden md:block overflow-x-auto px-1">
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
                                                            {/* <Input
                                                                placeholder="Description..."
                                                                value={item.description}
                                                                onChange={(e) =>
                                                                    handleLineItemChange(index, 'description', e.target.value)
                                                                }
                                                                required
                                                            /> */}
                                                            {item?.description ?
                                                                <div className='p-2 border items-center rounded-md  justify-between grid grid-cols-9 gap-2'>
                                                                    <p className='col-span-8'> {isAddedItem(item.description)}</p>
                                                                    <CircleX className='cursor-pointer' size={16} onClick={() => {
                                                                        setLineItems(it => {
                                                                            const data = [...it]
                                                                            data[index] = { ...data[index], description: "" }
                                                                            return data
                                                                        })
                                                                    }} /></div>
                                                                : <Select onValueChange={(value) => handleLineItemChange(index, 'description', value)} value={item.description}>
                                                                    <SelectTrigger className='w-full '>
                                                                        <SelectValue placeholder="Add from item library..." />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {items?.map((libItem) => (
                                                                            <SelectItem
                                                                                key={libItem.id}
                                                                                value={libItem.id.toString()}
                                                                            >
                                                                                {libItem.name}
                                                                            </SelectItem>
                                                                        ))}

                                                                        {items?.length === 0 && <SelectItem value='no' disabled>No items in library</SelectItem>}
                                                                        <SelectItem value='add_new_sheet2bill' className='text-sm font-semibold p-4! hover:underline cursor-pointer text-primary' >+ Add from library</SelectItem>
                                                                    </SelectContent>
                                                                </Select>}
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
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addLineItem}
                                        className="mt-4 w-full sm:w-auto"
                                    >
                                        + Add Item
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Brief Details Section */}
                        <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg sm:text-xl">Brief Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>Brief Title*</Label>
                                        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    </div>

                                    <div>
                                        <Label>Client*</Label>
                                        <Select onValueChange={setClientId} required>
                                            <SelectTrigger className='w-full'>
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

                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <Label className="text-xs sm:text-sm">Issue Date</Label>
                                            <Input
                                                type="date"
                                                value={issueDate}
                                                onChange={(e) => setIssueDate(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs sm:text-sm">Due Date</Label>
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
                                            <SelectTrigger className='w-full'>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="INR">INR</SelectItem>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* <div>
                                        <Label>Template</Label>
                                        <FeatureGate>
                                            <Select onValueChange={setTemplateId} defaultValue={templateId}>
                                                <SelectTrigger className='w-full'>
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
                                            {currentTemplate && <Image src={currentTemplate?.img} className='mx-auto mt-4 border rounded-sm' width={200} height={200} alt='sdf' />}
                                        </FeatureGate>
                                    </div> */}

                                </CardContent>
                            </Card>
                        </aside>
                    </div>

                    {/* --- Template Selection Grid (NEW) --- */}
                    <FeatureGate>
                        <Card className='mt-6'>
                            <CardHeader>
                                <CardTitle>Choose Template</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Select a template design for your brief
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {AVAILABLE_TEMPLATES.map((template) => (
                                        <button
                                            key={template.id}
                                            type="button"
                                            onClick={() => setTemplateId(template.id as string)}
                                            className={twMerge(
                                                "relative group overflow-hidden rounded-lg border-2 transition-all duration-200 hover:shadow-lg",
                                                templateId === template.id
                                                    ? "border-primary ring-2 ring-primary ring-offset-2"
                                                    : "border-border hover:border-primary/50"
                                            )}
                                        >
                                            {/* Template Preview Image */}
                                            <div className="aspect-[3/4] relative bg-muted">
                                                <Image
                                                    src={template.img}
                                                    alt={template.name}
                                                    fill
                                                    className="object-cover"
                                                />

                                                {/* Overlay on hover */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />

                                                {/* Selected Checkmark */}
                                                {templateId === template.id && (
                                                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                                                        <Check className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Template Name */}
                                            <div className="p-3 text-center bg-background border-t">
                                                <p className={twMerge(
                                                    "text-sm font-medium transition-colors",
                                                    templateId === template.id
                                                        ? "text-primary"
                                                        : "text-foreground group-hover:text-primary"
                                                )}>
                                                    {template.name}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </FeatureGate>

                    {/* Notes & Totals Section */}
                    <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base sm:text-lg">Notes / Terms</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="e.g., Payment due within 14 days."
                                        rows={4}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base sm:text-lg">Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm sm:text-base text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span>{totals.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Label className="text-muted-foreground text-sm sm:text-base">Tax Rate (%)</Label>
                                        <Input
                                            type="number"
                                            value={taxRate}
                                            onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                                            className="w-20 sm:w-24 h-8"
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-base text-muted-foreground">
                                        <span>Tax</span>
                                        <span>{totals.taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t my-2"></div>
                                    <div className="flex justify-between font-semibold text-base sm:text-lg">
                                        <span>Total</span>
                                        <span>
                                            {currency} {totals.grandTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <Dialog open={isItemModalOpen !== null} onOpenChange={() => setItemModalOpen(null)}>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Select Item from Library</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    <div className="relative mb-4">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search items..."
                                            value={itemSearchQuery}
                                            onChange={(e) => setItemSearchQuery(e.target.value)}
                                            className="pl-8"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setItemModalOpen(null)}>Close</Button>
                                    <Button onClick={() => addNewVal(itemSearchQuery, isItemModalOpen ?? -1)}>Add new item</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </form>
            </div>

            {/* Mobile: Fixed Bottom Save Button */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg z-10">
                <Button
                    type="submit"
                    size="lg"
                    disabled={createBriefMutation.isPending}
                    isLoading={createBriefMutation.isPending}
                    onClick={handleSubmit}
                    className="w-full"
                >
                    Save Draft Brief
                </Button>
            </div>
        </div>
    );
}

// --- Server Side ---
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx);
<<<<<<< HEAD
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { redirect: { destination: '/login', permanent: false } };
=======
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();
    if (!user || authError) return { redirect: { destination: '/login', permanent: false } };
>>>>>>> origin/main

    // 1. Fetch Clients
    const { data: clients } = await supabase
        .from('clients')
        .select('id, name')
        .eq('user_id', user.id);

    // 2.  Fetch Items
    const { data: items } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', session.user.id)
        .order('name');

    return {
        props: {
            clients: clients || [],
            items: items || [] // Pass items to the page
        }
    };
};