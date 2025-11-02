/* eslint-disable react/no-unescaped-entities */
// pages/index.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ReactElement } from 'react';
import { BarChart, Check, CheckCheck, Clock, FileDown, FilePlus, FileText, Settings, Users, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { CurrentTemplate } from '@/components/templates/CurrentTemplate';
import { sampleInvoiceData } from '@/lib/sample-data';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { FaqSection } from '@/components/landing/FaqSection';
import { Footer } from '@/components/landing/Footer';
import Laptop from '@/components/SVG/Laptop';
import Image from 'next/image';
import { BetaBanner } from '@/components/BetaBanner';
import Head from 'next/head';
import NonLoginNavbar from '@/components/landing/NonLoginNavbar';
import { SocialProof } from '@/components/landing/SocialProof';

const benefits = [
  { icon: Clock, title: 'Save Hours Every Month', description: 'Automate your entire billing process and get back to the work that matters.' },
  { icon: FileText, title: 'Look Professional', description: 'Impress your clients with beautiful, branded invoices from premium templates.' },
  { icon: Check, title: 'Get Paid Faster', description: 'Prevent disputes with our pre-invoice approval workflow, ensuring every invoice is correct.' },
];

export default function LandingPage() {
  const ldJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Sheet2Bill",
        "url": "https://sheet2bill.com",
        "logo": "https://sheet2bill.com/logo.png",
        "sameAs": [
          // Add links to your social media profiles here
          // "https://twitter.com/sheet2bill",
          // "https://www.linkedin.com/company/sheet2bill"
        ]
      },
      {
        "@type": "WebSite",
        "name": "Sheet2Bill",
        "url": "https://sheet2bill.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://sheet2bill.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Head>
        <title>Freelance Invoicing Software | Sheet2Bill | Client Billing Tool</title>
        <meta name="description" content="The ultimate invoicing software for freelancers. Easily manage clients, create professional briefs, get approvals, and track payments—all in one place." />
        <meta name="keywords" content="freelance invoicing software, client billing tool, online invoicing, freelance client management, invoice generator" />
        <meta property="og:title" content="Freelance Invoicing Software | Sheet2Bill" />
        <meta property="og:description" content="Streamline your entire billing process. Create briefs, get approvals, and generate professional invoices with ease. Sign up free!" />
        <meta property="og:image" content="https://sheet2bill.com/og-image.png" />
        <meta property="og:url" content="https://sheet2bill.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Freelance Invoicing Software | Sheet2Bill" />
        <meta name="twitter:description" content="The ultimate client billing tool for freelancers. Simplify your workflow from brief to payment. Get started for free." />
        <meta name="twitter:image" content="https://sheet2bill.com/twitter-image.png" />
        <link rel="canonical" href="https://sheet2bill.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        />
      </Head>
      {/* --- Header --- */}
      <NonLoginNavbar />

      <main className="flex-1 pt-16">
        <BetaBanner />

        {/* --- Hero Section --- */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.05)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left: Text Content */}
              <div className="text-center md:text-left space-y-8 mt-4">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">The Future of Freelance Invoicing</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                  From Brief to Bill,
                  <br />
                  <span className="relative inline-block mt-2">
                    <span className="relative z-10 text-white px-4 py-1">Seamlessly</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 transform -rotate-1 rounded-lg" />
                  </span>
                  .
                </h1>

                <p className="text-xl text-muted-foreground max-w-xl mx-auto md:mx-0 leading-relaxed">
                  The all-in-one platform for freelancers to manage clients, create professional briefs, get approvals, and get paid faster. Stop the chaos, start streamlining.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                  <Link href="/signup" passHref>
                    <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/25 group">
                      Get Started - It's Free
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="#features" passHref>
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 hover:bg-primary/5 hover:border-primary/50">
                      Discover Features
                    </Button>
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center md:justify-start space-x-8 pt-8 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Free forever plan</span>
                  </div>
                </div>
              </div>

              {/* Right: Visual */}
              <div className="hidden md:block">
                <div className="relative">
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-2xl transform rotate-12 animate-pulse" />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-2xl transform -rotate-12 animate-pulse" style={{ animationDelay: '1s' }} />

                  {/* Main Card */}
                  <div className="relative p-6 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl shadow-primary/10 transform hover:scale-105 transition-transform duration-500">
                    {/* Browser Chrome */}
                    <div className="bg-background/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/30">
                      <div className="flex justify-between items-center px-4 py-3 bg-secondary/30 border-b border-border/30">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" />
                          <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors" />
                        </div>
                        <div className="text-xs font-medium text-muted-foreground bg-background/50 px-3 py-1 rounded-full">
                          Dashboard
                        </div>
                        <div className="w-16" />
                      </div>

                      {/* App Preview */}
                      <div className="p-6 bg-gradient-to-br from-secondary/10 to-background">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h3 className="font-bold text-xl">Project Alpha</h3>
                            <p className="text-sm text-muted-foreground mt-1">Client Dashboard</p>
                          </div>
                          <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 text-green-600 text-sm font-semibold rounded-full">
                            ✓ Paid
                          </div>
                        </div>

                        <div className="relative aspect-video bg-background/50 backdrop-blur-sm rounded-xl border border-border/30 overflow-hidden">
                          <Image
                            src="/landing.png"
                            alt="Sheet2Bill Dashboard Preview - Client Project Alpha Invoice Paid"
                            width={400}
                            height={250}
                            className="w-full h-full object-cover scale-110 hover:scale-125 transition-transform duration-700"
                            priority
                          />
                        </div>
                      </div>
                    </div>

                    <p className="text-center mt-6 text-sm font-medium text-muted-foreground">
                      Your new command center awaits
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section id="features" className="py-32 bg-gradient-to-b from-background to-secondary/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Powerful Features</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Your Complete Billing Command Center
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Packed with powerful features to save you time and make you look like a pro.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Users, title: "Smart Client Hub", desc: "A full CRM to create, read, update, delete, and search all your clients. Keep every detail and billing history in one organized place.", color: "from-blue-500 to-cyan-500" },
                { icon: CheckCheck, title: "Pre-Invoice Approval Flow", desc: "Eliminate invoice errors and disputes. Send a professional brief for client approval via a secure link before you ever send a bill.", color: "from-green-500 to-emerald-500" },
                { icon: FilePlus, title: "One-Click Invoice Conversion", desc: "Turn any approved brief into a final, sequentially-numbered invoice with a single click. No more re-typing data.", color: "from-purple-500 to-pink-500" },
                { icon: Zap, title: "Invoice Tracking Dashboard", desc: "See the status of all your invoices at a glance—from 'draft', to 'sent', to 'paid'. Never lose track of a payment again.", color: "from-yellow-500 to-orange-500" },
                { icon: FileDown, title: "Premium PDF Exports", desc: "Download beautiful, branded PDF invoices that are ready to send to your clients, generated by a powerful server-side engine.", color: "from-red-500 to-rose-500" },
                { icon: BarChart, title: "At-a-Glance Reporting", desc: "Your main dashboard gives you instant insights into your business with key metrics like Total Revenue and Outstanding Amount.", color: "from-indigo-500 to-blue-500" },
                { icon: Settings, title: "Profile & Brand Customization", desc: "Add your company logo, full address, and a custom brand color to make every invoice and communication truly yours.", color: "from-teal-500 to-cyan-500" }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-8 bg-card border border-border/50 rounded-2xl hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />

                  <div className="relative">
                    <div className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-500`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <HowItWorks />
        </section>

        {/* --- Benefits Section --- */}
        <section className="py-32 bg-gradient-to-b from-secondary/5 to-background">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((item, index) => (
                <div
                  key={index}
                  className="group relative p-10 text-center bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-3xl hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500" />

                  <div className="relative">
                    <div className="inline-flex p-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-500">
                      <item.icon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Testimonial --- */}
        <section className="py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:72px_72px]" />

          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl">
              <div className="mb-8">
                <div className="flex justify-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-500 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>

              <blockquote>
                <p className="text-2xl md:text-3xl font-semibold leading-relaxed mb-8">
                  "The approval workflow is a game-changer. I've saved hours on back-and-forth emails and my clients love the professional briefs."
                </p>
                <footer>
                  <div className="font-bold text-xl">Priya S.</div>
                  <div className="text-muted-foreground mt-2">Digital Marketer · Jaipur, Rajasthan</div>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        <section>
          <FaqSection />
        </section>

        <SocialProof />

        {/* --- Final CTA --- */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:72px_72px]" />

          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Ready to transform your billing?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of freelancers who've streamlined their invoicing process
              </p>
              <div className="pt-4">
                <Link href="/signup" passHref>
                  <Button size="lg" className="h-16 px-12 md:text-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-2xl shadow-primary/25 group">
                    Sign Up Free & Create Your First Brief
                    <ArrowRight className="md:ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <Footer />
    </div>
  );
}

// Redirects logged-in users to their dashboard
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createPagesServerClient(ctx);
  const { data: { session } } = await supabase.auth.getSession();
  if (session) return { redirect: { destination: '/dashboard', permanent: false } };
  return { props: {} };
};
LandingPage.getLayout = function getLayout(page: ReactElement) { return page; };