import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { ArrowRight, Eye, EyeOff, FileText } from 'lucide-react';
import { FormEvent, useState } from 'react';
import Link from 'next/link';

function humanizeError(message: string): string {
    if (message.includes('User already registered') || message.includes('already registered'))
        return 'An account with this email already exists. Sign in instead.';
    if (message.includes('Password should be at least') || message.includes('password'))
        return 'Password must be at least 8 characters.';
    if (message.includes('Invalid email') || message.includes('invalid email'))
        return 'Please enter a valid email address.';
    if (message.includes('Email rate limit exceeded') || message.includes('rate limit'))
        return 'Too many attempts. Please wait a moment and try again.';
    return message;
}

function GoogleIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="mr-2.5 flex-shrink-0">
            <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
        </svg>
    );
}

interface SignupModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    invoiceTitle?: string;
}

export function SignupModal({ open, onOpenChange, invoiceTitle }: SignupModalProps) {
    const supabase = useSupabaseClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    async function handleGoogleSignIn() {
        setErrorMsg('');
        setGoogleLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent('/briefs/new?from=draft')}`,
            },
        });
        if (error) {
            setErrorMsg('Could not sign in with Google. Please try again.');
            setGoogleLoading(false);
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setLoading(true);

        const email = (event.currentTarget.elements.namedItem('modal_email') as HTMLInputElement).value;
        const password = (event.currentTarget.elements.namedItem('modal_password') as HTMLInputElement).value;

        const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/briefs/new?from=draft`,
            },
        });

        setLoading(false);

        if (error) {
            setErrorMsg(humanizeError(error.message));
            return;
        }

        if (data.session) {
            router.push('/briefs/new?from=draft');
        } else if (data.user) {
            setSuccessMsg("Check your inbox for a confirmation link. Your invoice draft is saved and will be pre-loaded when you confirm.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden gap-0">
                <div className="p-6 space-y-5">
                    <DialogHeader className="space-y-3 text-left">
                        {invoiceTitle && (
                            <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2">
                                <FileText className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                <span>Draft saved: <strong className="text-zinc-700">{invoiceTitle}</strong></span>
                            </div>
                        )}
                        <DialogTitle className="text-xl font-normal text-zinc-900 tracking-tight leading-snug">
                            Save your invoice — it&apos;s free
                        </DialogTitle>
                        <p className="text-sm text-zinc-500 leading-relaxed font-normal">
                            Create a free account to save and send this invoice to your client.
                        </p>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={googleLoading || loading}
                            className="w-full h-11 font-medium rounded-lg text-sm bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm transition-all flex items-center justify-center border-0"
                        >
                            <GoogleIcon />
                            {googleLoading ? 'Redirecting...' : 'Continue with Google'}
                        </Button>

                        <div className="relative flex items-center py-0.5">
                            <div className="flex-grow border-t border-zinc-200/60" />
                            <span className="flex-shrink mx-4 text-[11px] text-zinc-400 uppercase tracking-widest">or with email</span>
                            <div className="flex-grow border-t border-zinc-200/60" />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <Input
                                type="email"
                                name="modal_email"
                                required
                                placeholder="name@domain.com"
                                className="h-10 rounded-lg bg-zinc-50/50 border-zinc-200 text-sm"
                                autoComplete="email"
                            />
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    name="modal_password"
                                    required
                                    placeholder="Create a password (8+ chars)"
                                    className="h-10 rounded-lg bg-zinc-50/50 border-zinc-200 text-sm pr-10"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {errorMsg && (
                                <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 leading-relaxed">{errorMsg}</p>
                            )}
                            {successMsg && (
                                <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 leading-relaxed">{successMsg}</p>
                            )}

                            <Button
                                type="submit"
                                disabled={loading || googleLoading || !!successMsg}
                                className="w-full h-10 font-semibold rounded-lg text-sm bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2"
                            >
                                {loading ? 'Creating account...' : 'Create Free Account'}
                                <ArrowRight className="w-4 h-4 opacity-80" />
                            </Button>
                        </form>
                    </div>

                    <p className="text-center text-xs text-zinc-400 leading-relaxed pt-1">
                        By continuing you agree to our{' '}
                        <Link href="/terms" className="text-zinc-600 hover:underline underline-offset-2">Terms</Link>
                        {' '}&amp;{' '}
                        <Link href="/privacy" className="text-zinc-600 hover:underline underline-offset-2">Privacy Policy</Link>.
                        {' '}Already have an account?{' '}
                        <Link href="/login" className="text-zinc-700 font-medium hover:underline underline-offset-2">Sign in</Link>
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
