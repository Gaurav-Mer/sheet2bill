// pages/brief/[token].tsx
import { GetServerSidePropsContext } from 'next';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ReactElement, useEffect, useState } from 'react';
import bcryptjs from 'bcryptjs'; // Use bcryptjs for browser compatibility if needed, or bcrypt on server

// UI Components
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createClient } from '@supabase/supabase-js';
import qs from 'qs';
import { Calendar, CheckCircle, Mail, XCircle } from 'lucide-react';
import { normalizeCurrency } from '@/lib/normalizeCountry';

// --- Type Definition ---
type BriefDetails = {
    id: number;
    brief_number: string;
    issue_date: string;
    currency: string;
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    total: number;
    notes: string | null;
    status: string;
    clients: { name: string; email: string | null };
    line_items: { description: string; quantity: number; unit_price: number }[];
};

// --- Component 1: The Password Form ---
const PasswordGate = ({ passwordError, token }: { passwordError?: string; token: string }) => (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
            <CardHeader><CardTitle>This Brief is Protected</CardTitle></CardHeader>
            <CardContent>
                <form method="POST" action={`/brief/${token}`} className="space-y-4">
                    <div>
                        <Label htmlFor="password">Please enter the password to view.</Label>
                        <Input name="password" id="password" type="password" required autoFocus />
                    </div>
                    {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
                    <Button type="submit" className="w-full">Unlock Brief</Button>
                </form>
            </CardContent>
        </Card>
    </div>
);

// --- Component 2: The Main Brief Content ---
const BriefContent = ({ brief }: { brief: BriefDetails }) => {
    const [currentStatus, setCurrentStatus] = useState(brief.status);
    const [isRejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [formattedIssueDate, setFormattedIssueDate] = useState(brief.issue_date);
    useEffect(() => {
        setFormattedIssueDate(new Date(brief.issue_date).toLocaleDateString());
    }, [brief.issue_date]);

    const updateStatusMutation = useMutation({
        mutationFn: async ({ status, reason }: { status: string; reason?: string }) => {
            const response = await fetch(`/api/briefs/${brief.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, rejection_reason: reason }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update status');
            }
            return response.json();
        },
        onSuccess: (data) => {
            toast.success(`Brief ${data.status}! The sender has been notified.`);
            setCurrentStatus(data.status);
            setRejectModalOpen(false);
        },
        onError: (error: Error) => {
            toast.error(`Could not update status: ${error.message}`);
        }
    });

    const handleRejectSubmit = () => {
        if (!rejectionReason.trim()) {
            toast.error('Please provide a reason for the requested changes.');
            return;
        }
        updateStatusMutation.mutate({ status: 'rejected', reason: rejectionReason });
    };

    const getStatusBadge = () => {
        const baseClasses = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs md:text-sm font-semibold capitalize";

        if (currentStatus === 'approved') {
            return (
                <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`}>
                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                    Approved
                </span>
            );
        } else if (currentStatus === 'rejected') {
            return (
                <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300`}>
                    <XCircle className="w-3 h-3 md:w-4 md:h-4" />
                    Changes Requested
                </span>
            );
        } else {
            return (
                <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300`}>
                    {currentStatus}
                </span>
            );
        }
    };
    const currencySymbol = normalizeCurrency(brief.currency)?.currency?.symbol ?? brief?.currency;

    return (
        <div className="min-h-screen bg-muted flex items-center justify-center p-3 md:p-4 lg:p-6">
            <div className="w-full max-w-4xl bg-card rounded-lg shadow-lg p-4 md:p-8 lg:p-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 border-b pb-4 md:pb-6">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate">
                            {brief.brief_number}
                        </h1>
                        <div className="flex items-center gap-1.5 mt-1 md:mt-2 text-sm md:text-base text-muted-foreground">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>Issued on: {formattedIssueDate}</span>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        {getStatusBadge()}
                    </div>
                </div>

                {/* Client Info */}
                <div className="mt-4 md:mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                    <h2 className="text-xs md:text-sm font-semibold text-muted-foreground uppercase mb-2">
                        Billed To
                    </h2>
                    <p className="text-base md:text-lg font-bold text-foreground">
                        {brief.clients.name}
                    </p>
                    {brief.clients.email && (
                        <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{brief.clients.email}</span>
                        </div>
                    )}
                </div>

                {/* Line Items - Desktop Table */}
                <div className="mt-6 md:mt-8 hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2 font-semibold text-muted-foreground w-1/2">Description</th>
                                <th className="py-2 font-semibold text-muted-foreground text-center">Qty</th>
                                <th className="py-2 font-semibold text-muted-foreground text-right">Unit Price</th>
                                <th className="py-2 font-semibold text-muted-foreground text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brief.line_items.map((item, index) => (
                                <tr key={index} className="border-b last:border-b-0">
                                    <td className="py-3">{item.description}</td>
                                    <td className="py-3 text-center">{item.quantity}</td>
                                    <td className="py-3 text-right">{item.unit_price.toFixed(2)}</td>
                                    <td className="py-3 text-right font-medium">
                                        {(item.quantity * item.unit_price).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Line Items - Mobile Cards */}
                <div className="mt-6 md:hidden space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase">Line Items</h3>
                    {brief.line_items.map((item, index) => (
                        <Card key={index} className="border-border">
                            <CardContent className="p-4 space-y-2">
                                <div className="flex justify-between items-start gap-2">
                                    <span className="text-xs font-semibold text-muted-foreground">Item {index + 1}</span>
                                </div>
                                <p className="text-sm font-medium text-foreground">{item.description}</p>
                                <div className="grid grid-cols-3 gap-2 pt-2 border-t text-sm">
                                    <div>
                                        <span className="text-xs text-muted-foreground block">Qty</span>
                                        <span className="font-medium">{item.quantity}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground block">Unit Price</span>
                                        <span className="font-medium">{item.unit_price.toFixed(2)}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-muted-foreground block">Amount</span>
                                        <span className="font-semibold text-foreground">
                                            {(item.quantity * item.unit_price).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Totals Section */}
                <div className="mt-6 md:mt-8">
                    <Card className="border-border bg-muted/30">
                        <CardContent className="p-4 md:p-6">
                            <div className="space-y-2 md:space-y-3">
                                <div className="flex justify-between text-sm md:text-base text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>{currencySymbol} {brief.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm md:text-base text-muted-foreground">
                                    <span>Tax ({brief.tax_rate}%)</span>
                                    <span>{currencySymbol} {brief.tax_amount.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-2 md:pt-3"></div>
                                <div className="flex justify-between text-base md:text-lg font-bold text-foreground">
                                    <span>Total</span>
                                    <span>{currencySymbol} {brief.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Notes */}
                {brief.notes && (
                    <div className="mt-6 md:mt-8 border-t pt-4 md:pt-6">
                        <h3 className="font-semibold text-sm md:text-base text-muted-foreground mb-2">Notes</h3>
                        <p className="text-xs md:text-sm text-muted-foreground whitespace-pre-wrap">
                            {brief.notes}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 md:mt-10">
                    {(currentStatus === 'sent' || currentStatus === 'draft') ? (
                        <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:justify-center">
                            <Button
                                size="lg"
                                className="bg-primary hover:bg-primary/90 w-full md:w-auto"
                                onClick={() => updateStatusMutation.mutate({ status: 'approved' })}
                                disabled={updateStatusMutation.isPending}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {updateStatusMutation.isPending ? 'Processing...' : 'Approve Brief'}
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => setRejectModalOpen(true)}
                                className="w-full md:w-auto"
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Request Changes
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center p-4 rounded-lg bg-muted">
                            <p className={`text-base md:text-lg font-semibold ${currentStatus === 'approved' ? 'text-green-600 dark:text-green-400' : 'text-destructive'
                                }`}>
                                This brief has been {currentStatus === 'rejected' ? 'marked for changes' : currentStatus}.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* "Request Changes" Modal */}
            <Dialog open={isRejectModalOpen} onOpenChange={setRejectModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Request Changes</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-sm">
                        Please provide a brief explanation of the changes you&apos;d like to request.
                    </DialogDescription>
                    <div className="py-4">
                        <Label htmlFor="reason" className="text-sm">Your Comments</Label>
                        <Textarea
                            id="reason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="e.g., Please update the quantity for the first line item."
                            className="mt-2 min-h-[100px]"
                        />
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setRejectModalOpen(false)}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRejectSubmit}
                            disabled={updateStatusMutation.isPending}
                            className="w-full sm:w-auto"
                        >
                            {updateStatusMutation.isPending ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// --- Component 3: The Main Page Wrapper (Default Export) ---
type PageProps = {
    brief?: BriefDetails;
    showPasswordForm: boolean;
    passwordError?: string;
    token: string;
};

export default function BriefPageWrapper(props: PageProps) {
    if (props.showPasswordForm) {
        return <PasswordGate passwordError={props.passwordError} token={props.token} />;
    }

    if (props.brief) {
        return <BriefContent brief={props.brief} />;
    }

    return <div>Error: Brief not available or access denied.</div>;
}

// --- The Gatekeeper: getServerSideProps ---
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Use the service role key to bypass RLS for this public page
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { token } = ctx.params as { token: string };
    if (!token) return { notFound: true };

    const { data: briefMeta, error: metaError } = await supabase
        .from('briefs')
        .select('id, is_password_protected, access_password')
        .eq('brief_token', token)
        .single();

    if (metaError || !briefMeta) {
        return { notFound: true };
    }

    if (briefMeta.is_password_protected) {
        // --- NEW: Rate Limiting Logic ---
        const ip = ctx.req.headers['x-forwarded-for'] || ctx.req.socket.remoteAddress;

        // Calculate the timestamp for one hour ago
        const oneHourAgo = new Date(Date.now() - LOCKOUT_DURATION_MINUTES * 60 * 1000).toISOString();

        // Count recent failed attempts from this IP for this brief
        const { count: failedAttempts } = await supabase
            .from('password_attempts')
            .select('*', { count: 'exact', head: true })
            .eq('brief_id', briefMeta.id)
            .eq('ip_address', ip)
            .gte('created_at', oneHourAgo);
        console.log("failedAttempts", failedAttempts)
        if (failedAttempts && failedAttempts >= MAX_ATTEMPTS) {
            // If the limit is reached, block them.
            return { props: { showPasswordForm: true, passwordError: `Too many failed attempts. Please try again in ${LOCKOUT_DURATION_MINUTES} minutes.`, token } };
        }
        if (ctx.req.method === 'POST') {
            let body = '';
            await new Promise(resolve => {
                ctx.req.on('data', chunk => {
                    body += chunk.toString();
                });
                ctx.req.on('end', () => {
                    resolve(body);
                });
            });
            const parsedBody = qs.parse(body);
            const passwordAttempt = parsedBody.password as string;
            const isValid = await bcryptjs.compare(passwordAttempt || '', briefMeta.access_password || '');

            if (!isValid) {
                // If password is wrong, LOG the failed attempt.
                await supabase.from('password_attempts').insert({ ip_address: ip, brief_id: briefMeta.id });
                return { props: { showPasswordForm: true, passwordError: 'Incorrect password.', token } };
            }

        } else {
            // It's a GET request for a protected brief, so show the password form.
            await supabase.from('password_attempts').delete().eq('brief_id', briefMeta.id).eq('ip_address', ip);
            return { props: { showPasswordForm: true, token } };
        }
    }

    // If we've reached this point, the user has access. Fetch the full brief data.
    const { data: brief, error } = await supabase
        .from('briefs')
        .select(`*, clients ( name, email ), line_items ( * )`)
        .eq('brief_token', token)
        .single();

    if (error || !brief) {
        return { notFound: true };
    }

    return { props: { brief, showPasswordForm: false, token } };
};

// --- Layout Configuration ---
BriefPageWrapper.getLayout = function getLayout(page: ReactElement) {
    return page;
};




const MAX_ATTEMPTS = 5; // Set our limit
const LOCKOUT_DURATION_MINUTES = 60; // Set our lockout time
