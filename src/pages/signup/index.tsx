import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, ReactElement, useState } from 'react';
import { CheckCircle2, Zap, ShieldCheck, Eye, EyeOff, ArrowRight } from 'lucide-react';

const perks = [
    { icon: CheckCircle2, label: 'Free forever on our Starter plan' },
    { icon: Zap, label: 'Up and running in under 2 minutes' },
    { icon: ShieldCheck, label: 'Secure data management architecture' },
];

function humanizeError(message: string): string {
    if (message.includes('User already registered') || message.includes('already registered')) return 'An account with this email already exists. Sign in instead.';
    if (message.includes('Password should be at least') || message.includes('password')) return 'Password must be at least 8 characters.';
    if (message.includes('Invalid email') || message.includes('invalid email')) return 'Please enter a valid email address.';
    if (message.includes('Email rate limit exceeded') || message.includes('rate limit')) return 'Too many attempts. Please wait a moment and try again.';
    if (message.includes('signup_disabled')) return 'Sign-ups are temporarily disabled. Please try again later.';
    if (message.includes('network') || message.includes('fetch')) return 'Network error. Please check your connection and try again.';
    return message;
}

function GoogleIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="mr-2.5">
            <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
        </svg>
    );
}

export default function SignUpPage() {
    const supabaseClient = useSupabaseClient();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    async function handleGoogleSignIn() {
        setErrorMsg('');
        setGoogleLoading(true);
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard`,
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

        const email = event.currentTarget.email.value;
        const password = event.currentTarget.password.value;

        const { error, data } = await supabaseClient.auth.signUp({ email, password });

        setLoading(false);

        if (error) {
            setErrorMsg(humanizeError(error.message));
            return;
        }

        if (data.session) {
            router.push('/dashboard');
        } else if (data.user) {
            setSuccessMsg("Almost there! Check your inbox for a confirmation link. If you don't see it, check your spam folder.");
        }
    }

    return (
        <div className="min-h-screen flex bg-zinc-50/50 font-sans antialiased text-zinc-900 selection:bg-zinc-900 selection:text-white">
            <Head>
                <title>Sign Up — Sheet2Bill</title>
                <meta name="description" content="Create a free Sheet2Bill account to start managing your clients and invoices." />
            </Head>

            {/* ── LEFT PANEL (Premium Editorial Layout) ── */}
            <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden bg-white border-r border-zinc-200/80">
                {/* Subtle Geometric Premium Grid Mesh Overlay */}
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-[0.35]" />

                {/* Branding Brandmark Anchor */}
                <div className="relative z-10 flex items-center gap-2.5 cursor-pointer self-start group transition-opacity hover:opacity-80" onClick={() => router.push('/')}>
                    <Logo className="h-6 w-6 text-zinc-900" />
                    <span className="text-zinc-900 font-semibold text-base tracking-tight">Sheet2Bill</span>
                </div>

                {/* Main Value Prop Stack */}
                <div className="relative z-10 my-auto max-w-md space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-normal text-zinc-900 tracking-tight leading-[1.15]">
                            Start billing smarter today. <br />
                            <span className="font-serif italic text-primary">Completely free</span>.
                        </h2>
                        <p className="text-zinc-500 text-base leading-relaxed">
                            Join independent operators and small modern teams who manage client approvals and invoices with confidence.
                        </p>
                    </div>

                    {/* Clean Key Feature Indicators */}
                    <div className="space-y-6">
                        {perks.map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-zinc-50/50 border border-zinc-200/80 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-zinc-600" />
                                </div>
                                <p className="text-zinc-700 text-sm md:text-base font-normal">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monospace System Footnote */}
                <p className="text-zinc-400 text-xs uppercase tracking-wider relative z-10">
                    © {new Date().getFullYear()} Sheet2Bill // System Platform Core
                </p>
            </div>

            {/* ── RIGHT PANEL (Minimalist Studio Form Canvas) ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white lg:bg-transparent">
                <div className="w-full max-w-[380px] space-y-8">

                    {/* Mobile Dynamic Header Bar Wrapper */}
                    <div className="lg:hidden flex items-center gap-2 mb-8 cursor-pointer justify-center" onClick={() => router.push('/')}>
                        <Logo className="h-6 w-6 text-zinc-900" />
                        <span className="font-semibold text-base text-zinc-900 tracking-tight">Sheet2Bill</span>
                    </div>

                    {/* Headline Info Block */}
                    <div className="space-y-2 text-left">
                        <h1 className="text-3xl font-normal text-zinc-900 tracking-tight">Create your account</h1>
                        <p className="text-zinc-500 text-sm md:text-base">Start for free — no credit card setup required</p>
                    </div>

                    {/* Interactive Stack Canvas */}
                    <div className="space-y-6">
                        {/* Native OAuth Federated Integration Interface Trigger */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoogleSignIn}
                            disabled={googleLoading || loading}
                            className="w-full h-11 font-medium rounded-lg text-sm border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 shadow-sm transition-all flex items-center justify-center tracking-normal bg-white"
                        >
                            <GoogleIcon />
                            {googleLoading ? 'Redirecting...' : 'Continue with Google'}
                        </Button>

                        {/* Minimal Pure Separator Breakpoint */}
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-zinc-200/60"></div>
                            <span className="flex-shrink mx-4 text-xs  text-zinc-400 uppercase tracking-widest">or register with email</span>
                            <div className="flex-grow border-t border-zinc-200/60"></div>
                        </div>

                        {/* Secure Registration Pipeline Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-xs md:text-sm font-medium text-zinc-600 tracking-normal">
                                    Email address
                                </label>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    placeholder="name@domain.com"
                                    className="h-11 rounded-lg bg-zinc-50/50 border-zinc-200/80 font-normal text-base text-zinc-900 focus:bg-white focus:border-zinc-900 focus:ring-0 transition-all placeholder:text-zinc-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-xs md:text-sm font-medium text-zinc-600 tracking-normal">
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        required
                                        placeholder="••••••••"
                                        className="h-11 rounded-lg bg-zinc-50/50 border-zinc-200/80 font-normal text-base text-zinc-900 focus:bg-white focus:border-zinc-900 focus:ring-0 transition-all pr-12 placeholder:text-zinc-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-zinc-400 font-normal pt-0.5">Password must be at least 8 characters long</p>
                            </div>

                            {/* Error / Success Feedback Wrappers */}
                            {errorMsg && (
                                <div className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 leading-relaxed">
                                    {errorMsg}
                                </div>
                            )}

                            {successMsg && (
                                <div className="text-sm font-normal text-emerald-800 bg-emerald-50/60 border border-emerald-200/60 rounded-lg px-4 py-3 leading-relaxed">
                                    {successMsg}
                                </div>
                            )}

                            {/* Primary Authorization Form Submission Call-to-action */}
                            <Button
                                type="submit"
                                disabled={loading || googleLoading}
                                className="w-full h-11 font-semibold rounded-lg text-sm bg-primary hover:bg-primary/95 text-white transition-all flex items-center justify-center gap-2 shadow-sm mt-2"
                            >
                                {loading ? 'Creating account...' : 'Get Started Free'}
                                <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                            </Button>
                        </form>
                    </div>

                    {/* Mobile Trust Badges Array Row */}
                    <div className="lg:hidden flex flex-col gap-2.5 pt-2">
                        {perks.map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-3 bg-zinc-50 border border-zinc-200/60 rounded-xl p-3.5">
                                <Icon className="w-5 h-5 text-zinc-600 flex-shrink-0" />
                                <span className="text-sm text-zinc-600 font-normal">{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Legal Compliance Attributions Frame */}
                    <p className="text-center text-xs text-zinc-400 leading-relaxed pt-2">
                        By creating an account, you agree to our{' '}
                        <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-zinc-600 font-medium hover:underline underline-offset-2">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-zinc-600 font-medium hover:underline underline-offset-2">
                            Privacy Policy
                        </a>.
                    </p>

                    <div className="relative flex py-0 items-center">
                        <div className="flex-grow border-t border-zinc-200/60"></div>
                        <span className="flex-shrink mx-4 text-xs  text-zinc-400 uppercase tracking-widest">Account check</span>
                        <div className="flex-grow border-t border-zinc-200/60"></div>
                    </div>

                    <Link href="/login">
                        <button
                            className="w-full underline cursor-pointer  font-semibold rounded-lg text-sm border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 transition-colors bg-white"
                        >
                            Sign in instead
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

SignUpPage.getLayout = function getLayout(page: ReactElement) {
    return page;
};