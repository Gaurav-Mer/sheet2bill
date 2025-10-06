/* eslint-disable @typescript-eslint/no-explicit-any */
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

    return (
        <div className="min-h-screen bg-muted flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-card rounded-lg shadow-lg p-8 md:p-12">
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">{brief.brief_number}</h1>
                        <p className="text-muted-foreground">Issued on: {formattedIssueDate}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${currentStatus === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                        currentStatus === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}
                    >
                        {currentStatus === 'rejected' ? 'Changes Requested' : currentStatus}
                    </div>
                </div>

                {/* Client Info */}
                <div className="mt-6">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase">Billed To</h2>
                    <p className="text-lg font-bold text-foreground">{brief.clients.name}</p>
                    <p className="text-muted-foreground">{brief.clients.email}</p>
                </div>

                {/* Line Items Table */}
                <div className="mt-8">
                    <table className="w-full text-left">
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
                                    <td className="py-3 text-right">{(item.quantity * item.unit_price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="mt-6 flex justify-end">
                    <div className="w-full max-w-xs space-y-2">
                        <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{brief.currency} {brief.subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between text-muted-foreground"><span>Tax ({brief.tax_rate}%)</span><span>{brief.currency} {brief.tax_amount.toFixed(2)}</span></div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Total</span><span>{brief.currency} {brief.total.toFixed(2)}</span></div>
                    </div>
                </div>

                {/* Notes */}
                {brief.notes && (
                    <div className="mt-8 border-t pt-6">
                        <h3 className="font-semibold text-muted-foreground">Notes</h3>
                        <p className="text-sm text-muted-foreground">{brief.notes}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-10 text-center">
                    {(currentStatus === 'sent' || currentStatus === 'draft') ? (
                        <div className="space-x-4">
                            <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => updateStatusMutation.mutate({ status: 'approved' })} disabled={updateStatusMutation.isPending}>
                                {updateStatusMutation.isPending ? 'Processing...' : 'Approve Brief'}
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => setRejectModalOpen(true)}>Request Changes</Button>
                        </div>
                    ) : (
                        <p className={`text-lg font-semibold ${currentStatus === 'approved' ? 'text-green-600' : 'text-destructive'}`}>
                            This brief has been {currentStatus}.
                        </p>
                    )}
                </div>
            </div>

            {/* "Request Changes" Modal */}
            <Dialog open={isRejectModalOpen} onOpenChange={setRejectModalOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Request Changes</DialogTitle></DialogHeader>
                    <DialogDescription>Please provide a brief explanation of the changes you’d like to request.</DialogDescription>
                    <div className="py-4">
                        <Label htmlFor="reason" className="sr-only">Your Comments</Label>
                        <Textarea id="reason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="e.g., Please update the quantity for the first line item." />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleRejectSubmit} disabled={updateStatusMutation.isPending}>
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
