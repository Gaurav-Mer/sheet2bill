'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from "date-fns"
import { Loader2, CheckCircle2, Calendar as CalendarIcon, Plus, X, AlertCircle } from 'lucide-react'

// Shadcn UI Imports
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Iitem } from '@/types' // Assuming Iitem uses string for ID

// Props Interface
interface InquiryModalProps {
    isOpen: boolean
    onClose: () => void
    initialItem: Iitem | null
    allItems: Iitem[]
    freelancerId: string
    currency?: string
}

// --- Zod Schema (Updated for Range & Snapshots) ---
const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Please provide more details about your needs"),

    // We use a Date Range object now to support both "Deadlines" and "Events"
    date_range: z.object({
        from: z.date(),
        to: z.date().optional(),
    }, { error: "Please select a date or range" }),

    // We validate the whole object to ensure we have ID and Price
    selected_items: z.array(z.object({
        id: z.string(), // Supabase IDs are UUID strings
        name: z.string(),
        default_price: z.number(),
    })).min(1, "Please select at least one service"),
})

export default function InquiryModal({ isOpen, onClose, initialItem, allItems, freelancerId, currency = "USD" }: InquiryModalProps) {
    const supabase = createClientComponentClient()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // 1. Initialize Form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
            selected_items: [],
        },
    })

    // 2. Watch Logic (To calculate totals in real-time)
    const selectedItems = form.watch("selected_items")
    const estimatedTotal = selectedItems.reduce((acc, item) => acc + item.default_price, 0)

    // 3. Effect: Pre-select item if opened via URL
    useEffect(() => {
        if (isOpen && initialItem) {
            const current = form.getValues("selected_items")
            const isPresent = current.some(i => i.id?.toString() === initialItem.id?.toString())
            if (!isPresent) {
                // Ensure ID is string to match schema
                const itemToAdd = {
                    ...initialItem,
                    id: String(initialItem.id)
                }
                form.setValue("selected_items", [...current, itemToAdd])
            }
        }
    }, [isOpen, initialItem, form])

    // 4. Handle Submit
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            // A. Handle Dates
            // If user selects one day, Start = End. If range, Start != End.
            const startDate = values.date_range.from.toISOString();
            const endDate = values.date_range.to
                ? values.date_range.to.toISOString()
                : startDate; // Fallback to start date

            // B. Create Snapshot (The Freeze Logic)
            // We save the price/name AS IT IS NOW.
            const itemsSnapshot = values.selected_items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.default_price,
                currency: currency
            }))

            // C. Prepare Payload
            const payload = {
                freelancer_id: freelancerId,

                // Client Info
                client_name: values.name,
                client_email: values.email,
                client_phone: null, // Optional

                // Project Info
                message: values.message,
                start_date: startDate,
                end_date: endDate,

                // The "Frozen" Data
                requested_items: itemsSnapshot,

                status: 'pending'
            }

            const { error } = await supabase.from('inquiries').insert(payload)

            if (error) throw error

            // E. TRIGGER NOTIFICATION (New Logic)
            // We call the API route to handle the secure push notification
            await fetch('/api/inquiries/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    freelancer_id: freelancerId,
                    client_name: values.name,
                    service_count: values.selected_items.length
                })
            });

            setSuccess(true)
            form.reset()
        } catch (error) {
            console.error('Error submitting inquiry:', error)
            alert("Failed to send request. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose()
            setTimeout(() => setSuccess(false), 300)
            form.reset()
        }
    }

    // Helper: Add/Remove items
    const toggleItem = (item: Iitem) => {
        const current = form.getValues("selected_items")
        const exists = current.find(i => i.id === String(item.id))

        if (exists) {
            form.setValue("selected_items", current.filter(i => i.id !== String(item.id)))
        } else {
            form.setValue("selected_items", [...current, { ...item, id: String(item.id) }])
        }
    }

    console.log("errorir", form.formState.errors)

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-2xl gap-0 flex flex-col max-h-[90vh]">

                {success ? (
                    // --- SUCCESS VIEW ---
                    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 size={32} className="text-green-600" />
                        </div>

                        <DialogTitle className="text-2xl font-bold mb-2">Request Sent Successfully!</DialogTitle>

                        <DialogDescription className="mb-8 max-w-sm mx-auto text-gray-500">
                            The freelancer has received your inquiry. They will review your project details and send you a formal <b>Proposal</b> soon.
                        </DialogDescription>

                        <Button
                            onClick={() => handleOpenChange(false)}
                            className=" text-white  w-full sm:w-auto"
                        >
                            Done
                        </Button>
                    </div>
                ) : (
                    // --- FORM VIEW ---
                    <>
                        {/* Fixed Header */}
                        <div className="bg-secondary/50 px-6 py-4 border-b border-secondary flex justify-between items-center shrink-0">
                            <div>
                                <DialogTitle className="text-lg font-bold">Request Service</DialogTitle>
                                <p className="text-sm text-gray-500 font-medium">
                                    Est. Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(estimatedTotal)}
                                </p>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-6 overflow-y-auto">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                    {/* 1. Services (Multi-Select) */}
                                    <FormField
                                        control={form.control}
                                        name="selected_items"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>Selected Services</FormLabel>
                                                <div className="space-y-3">
                                                    {/* Active Chips */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedItems.map(item => (
                                                            <div key={item.id} className="bg-secondary text-black text-xs pl-3 pr-2 py-1.5 rounded-full flex items-center gap-2 animate-in fade-in zoom-in-95">
                                                                {item.name}
                                                                <X
                                                                    size={14}
                                                                    className="cursor-pointer hover:text-destructive"
                                                                    onClick={() => toggleItem(item as unknown as Iitem)}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Dropdown */}
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="outline" size="sm" className="w-full justify-start text-muted-foreground border-dashed">
                                                                <Plus size={14} className="mr-2" /> Add another service...
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="p-0 w-[300px]" align="start">
                                                            <Command>
                                                                <CommandList>
                                                                    <CommandGroup heading="Available Services">
                                                                        {allItems.map(item => (
                                                                            <CommandItem
                                                                                key={item.id}
                                                                                onSelect={() => toggleItem(item)}
                                                                                className="flex justify-between cursor-pointer"
                                                                            >
                                                                                <span>{item.name}</span>
                                                                                <span className="text-xs text-gray-500 ml-2">
                                                                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(item.default_price)}
                                                                                </span>
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* 2. Date Range Picker (The update) */}
                                    <FormField
                                        control={form.control}
                                        name="date_range"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>When is this required?</FormLabel>
                                                <FormDescription className="text-xs">
                                                    Select a single date for a deadline, or a range for an event.
                                                </FormDescription>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                                                {field.value?.from ? (
                                                                    field.value.to ? (
                                                                        <>
                                                                            {format(field.value.from, "LLL dd, y")} -{" "}
                                                                            {format(field.value.to, "LLL dd, y")}
                                                                        </>
                                                                    ) : (
                                                                        format(field.value.from, "LLL dd, y")
                                                                    )
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            initialFocus
                                                            mode="range" // Enables Start/End selection
                                                            defaultMonth={field.value?.from}
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            numberOfMonths={1}
                                                            disabled={(date) => date < new Date()}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* 3. Contact Details */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl><Input placeholder="john@example.com" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* 4. Message */}
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Project Details</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe your requirements. E.g. 'I need a minimalist logo...'"
                                                        className="resize-none min-h-[100px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Submit Button */}

                                </form>
                            </Form>
                        </div>
                        <div className='shrink-0 w-full p-2'>
                            <div className="pt-2">

                                <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <AlertCircle size={14} className="mt-0.5 shrink-0 text-gray-400" />
                                    <p>
                                        This is a preliminary request. The freelancer will review your details and send you a formal <strong>Brief & Invoice</strong> for your approval.
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={form.handleSubmit(onSubmit)}
                                className="w-full h-12 bg-primary  text-base font-medium transition-all"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Submit Request"}
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}