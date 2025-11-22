/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/index.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ReactElement } from 'react';
import { ArrowRight } from 'lucide-react';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { FaqSection } from '@/components/landing/FaqSection';
import { Footer } from '@/components/landing/Footer';
import { BetaBanner } from '@/components/BetaBanner';
import Head from 'next/head';
import NonLoginNavbar from '@/components/landing/NonLoginNavbar';
import { ProblemSolutionBanner } from '@/components/landing/ProblemSolutionBanner';
import FeatureList from '@/components/landing/FeatureList';
import { WhyChooseUs } from '@/components/landing/WhyChooseUs';
import { PremiumHeroSection } from '@/components/landing/PremiumHeroSection';
import InvoiceTemplatesShowCase from '@/components/landing/InvoiceTemplateShowCase';


declare global {
  interface Window {
    orufyBookings?: {
      PopupWidget?: (options?: any) => void;
    };
  }
}

export default function LandingPage() {
  const ldJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Sheet2Bill",
        "url": "https://www.sheet2bill.com",
        "logo": "https://www.sheet2bill.com/logo_512.png", // You must add this logo to your /public folder
        // "sameAs": []
      },
      {
        "@type": "WebSite",
        "name": "Sheet2Bill",
        "url": "https://www.sheet2bill.com",
        "description": "Effortless billing for freelancers. Manage clients, create professional briefs, get approvals, and track invoices—all in one place.",
        "publisher": {
          "@type": "Organization",
          "name": "Sheet2Bill"
        }
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">

      <Head>
        <title>Sheet2Bill | Invoice & Client Management for Freelancers</title>
        <meta name="description" content="Effortless billing for freelancers with professional results. Manage clients, create professional briefs, get approvals, and track invoices—all in one place." />
        <meta name="keywords" content="freelance billing,invoicing software for freelancers, freelance billing software, invoicing software, client management, online invoicing, freelance tools, effortless billing, professional invoicing,freelance invoice software,how to bill a client,client management and invoicing" />
        <meta property="og:title" content="Sheet2Bill | Invoice & Client Management for Freelancers" />
        <meta property="og:description" content="Experience effortless billing with professional results. The ultimate tool for freelancers to manage clients, create professional briefs, and automate invoicing." />
        <meta property="og:image" content="https://sheet2bill.com/landing.png" />
        <meta property="og:url" content="https://sheet2bill.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sheet2Bill | Invoice & Client Management for Freelancers" />
        <meta name="twitter:description" content="Streamline your freelance business with effortless billing and professional results." />
        <meta name="twitter:image" content="https://sheet2bill.com/landing.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        />
        <link rel="shortcut icon" href="/favicon.ico?v=3" />
      </Head>

      {/* --- Header --- */}
      <NonLoginNavbar />

      <main className="flex-1 pt-16">
        <BetaBanner />

        {/* --- Hero Section --- */}
        <PremiumHeroSection />

        <ProblemSolutionBanner />

        {/* --- Features Section --- */}
        <FeatureList />
        <section>
          <HowItWorks />
        </section>

        {/* --- Benefits Section --- */}
        <WhyChooseUs />

        {/* --- Testimonial --- */}
        {/* <section className="py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
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
        </section> */}
        <section className="relative py-12 bg-white overflow-hidden">
          {/* Mathematical grid background */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `
        linear-gradient(to right, rgb(148 163 184) 1px, transparent 1px),
        linear-gradient(to bottom, rgb(148 163 184) 1px, transparent 1px)
      `,
              backgroundSize: '60px 60px'
            }} />
          </div>

          {/* Geometric accent lines */}
          <div className="absolute top-10 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute bottom-10 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="container mx-auto px-6 max-w-4xl relative">
            {/* Elegant header with refined typography */}
            <div className="text-center mb-20">
              <div className="inline-block mb-6">
                {/* Mathematical angle brackets */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/30" />
                  <div className="w-8 h-px bg-gradient-to-l from-transparent to-primary/30" />
                </div>

                <h2 className="text-4xl md:text-5xl font-light text-slate-900 tracking-tight">
                  The Story Behind <span className="font-semibold">Sheet2Bill</span>
                </h2>
              </div>
              <p className="text-slate-500 text-lg font-light max-w-2xl mx-auto mt-6">
                Bringing clarity and structure to professional billing
              </p>
            </div>

            {/* Premium content card with geometric elements */}
            <div className="relative">
              {/* Corner brackets */}
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-primary/20 rounded-tl-lg" />
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-primary/20 rounded-tr-lg" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-primary/20 rounded-bl-lg" />
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-primary/20 rounded-br-lg" />

              {/* Subtle shadow and border treatment */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl blur-2xl" />

              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/50 p-10 md:p-14">
                {/* Coordinate system indicator */}
                <div className="space-y-8 text-slate-700">
                  {/* Mathematical divider with dot */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-2 rounded-full bg-primary/40" />
                    <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
                  </div>

                  <p className="text-xl md:text-2xl font-light leading-relaxed">
                    For many professionals, billing feels <span className="font-medium text-slate-900">chaotic</span> — client details scattered everywhere, project notes lost, and countless hours spent just trying to stay organized.
                  </p>

                  {/* Mathematical equation-style divider */}
                  <div className="flex items-center justify-center gap-4 py-4">
                    <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary/30" />
                    <span className="text-primary/30 font-mono text-sm">≈</span>
                    <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary/30" />
                  </div>

                  <p className="text-xl md:text-2xl font-light leading-relaxed">
                    Sheet2Bill was created to deliver <span className="font-medium text-slate-900">effortless billing</span>. One elegant platform to create structured briefs, streamline client approvals, and generate invoices—all designed to deliver <span className="font-medium text-slate-900">professional results</span> seamlessly.
                  </p>

                  {/* Mathematical divider with multiple dots */}
                  <div className="flex items-center justify-center gap-4 py-4">
                    <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary/30" />
                    <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                    </div>
                    <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary/30" />
                  </div>

                  <p className="text-xl md:text-2xl font-light leading-relaxed">
                    Designed to eliminate chaos and help you work <span className="font-medium text-slate-900">smarter, faster, and with complete confidence</span>.
                  </p>

                  {/* Function notation divider */}
                  <div className="flex items-center gap-3 mt-8">
                    <div className="flex-1 h-px bg-gradient-to-l from-primary/20 to-transparent" />
                    <div className="w-2 h-2 rounded-full bg-primary/40" />
                  </div>

                  {/* Signature with mathematical styling */}
                  <div className="pt-8 mt-12 border-t border-slate-200/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900 text-lg">Sheet2Bill Team</div>
                      </div>
                      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        {/* Mathematical cross symbol */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-px bg-primary/20" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-px h-6 bg-primary/20" />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-primary/20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FAQ Section --- */}
        <section>
          <InvoiceTemplatesShowCase />
        </section>

        <section>
          <FaqSection />
        </section>

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
                Join thousands of freelancers experiencing effortless billing with professional results
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
  // This validates the token with Supabase Auth but lets Middleware handle the refreshing.
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();
  if (user && !authError) return { redirect: { destination: '/dashboard', permanent: false } };
  return { props: {} };
};
LandingPage.getLayout = function getLayout(page: ReactElement) { return page; };