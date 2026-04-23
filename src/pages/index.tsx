/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/index.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ReactElement, useEffect, useRef, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { FaqSection } from '@/components/landing/FaqSection';
import { Footer } from '@/components/landing/Footer';
import Head from 'next/head';
import NonLoginNavbar from '@/components/landing/NonLoginNavbar';
import { ProblemSolutionBanner } from '@/components/landing/ProblemSolutionBanner';
import FeatureList from '@/components/landing/FeatureList';
import { WhyChooseUs } from '@/components/landing/WhyChooseUs';
import { PremiumHeroSection } from '@/components/landing/PremiumHeroSection';
import InvoiceTemplatesShowCase from '@/components/landing/InvoiceTemplateShowCase';
import PricingSection from '@/components/landing/PricingSection';

// ─── Types ───────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    orufyBookings?: {
      PopupWidget?: (options?: any) => void;
    };
    gtag?: (...args: any[]) => void;
  }
}

// ─── Schema / Structured Data ────────────────────────────────────────────────

const SITE_URL = 'https://www.sheet2bill.com';

const ldJson = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#software`,
      name: 'Sheet2Bill',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo_512.png`,
        width: 512,
        height: 512,
      },
      description:
        'Professional invoicing and client management software for freelancers and small businesses.',
      sameAs: [
        // Add your social profiles here:
        // 'https://twitter.com/sheet2bill',
        // 'https://www.linkedin.com/company/sheet2bill',
      ],
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#software`,
      name: 'Sheet2Bill',
      alternateName: 'Sheet2Bill Billing Suite',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'InvoicingApplication',
      operatingSystem: 'Web, iOS, Android',
      url: SITE_URL,
      description:
        'Create professional quotes, convert them to invoices, and manage freelance billing in one workflow. Free invoice generator with UPI QR codes and white-label PDF export.',
      featureList: [
        'Invoice Generator',
        'Quote to Invoice Conversion',
        'Client Management CRM',
        'PDF Export with Branding',
        'UPI QR Code Payments',
        'Pre-Invoice Approval Workflow',
        'Revenue Dashboard',
        'Auto-Sequential Invoice Numbering',
      ],
      screenshot: `${SITE_URL}/landing.png`,
      offers: [
        {
          '@type': 'Offer',
          name: 'Starter Plan',
          price: '0',
          priceCurrency: 'INR',
          description: 'Free forever — 3 briefs & invoices per month, 2 saved clients.',
        },
        {
          '@type': 'Offer',
          name: 'Pro Freelancer',
          price: '299',
          priceCurrency: 'INR',
          billingIncrement: '30',
          description: '200 briefs/month, 50 clients, premium templates, no watermark.',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '120',
        bestRating: '5',
        worstRating: '1',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Sheet2Bill',
      url: SITE_URL,
      description:
        'Effortless billing for freelancers. Manage clients, create professional briefs, get approvals, and track invoices — all in one place.',
      publisher: {
        '@id': `${SITE_URL}/#software`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: 'Sheet2Bill: Professional Freelance Invoicing Made Simple',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#software` },
      description:
        'Stop using Excel. Create professional quotes, convert them to invoices, and handle freelance billing in one workflow.',
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
        ],
      },
    },
  ],
};

// ─── Scroll Depth Hook ────────────────────────────────────────────────────────

const SCROLL_THRESHOLDS = [25, 50, 75, 100] as const;

function useScrollDepthTracking() {
  const firedRef = useRef<Set<number>>(new Set());
  const tickingRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (tickingRef.current) return;

    tickingRef.current = true;
    window.requestAnimationFrame(() => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const totalScrollable = scrollHeight - clientHeight;

      if (totalScrollable > 0) {
        const scrolledPercent = Math.floor((scrollTop / totalScrollable) * 100);

        for (const threshold of SCROLL_THRESHOLDS) {
          if (scrolledPercent >= threshold && !firedRef.current.has(threshold)) {
            firedRef.current.add(threshold);
            window.gtag?.('event', 'scroll_depth', {
              value: threshold,
              page_path: window.location.pathname,
            });
          }
        }
      }

      tickingRef.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
}

// ─── Story Section ────────────────────────────────────────────────────────────
// Extracted into its own component for readability and potential code-splitting.

function StorySection() {
  return (
    <section
      aria-labelledby="story-heading"
      className="relative py-24 bg-white overflow-hidden"
    >
      {/* Subtle grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(148 163 184) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(148 163 184) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Accent lines */}
      <div
        aria-hidden="true"
        className="absolute top-10 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />

      <div className="container mx-auto px-6 max-w-4xl relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-8" aria-hidden="true">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/30" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-primary/30" />
          </div>

          <h2
            id="story-heading"
            className="text-4xl md:text-5xl font-light text-slate-900 tracking-tight"
          >
            The Story Behind <span className="font-semibold">Sheet2Bill</span>
          </h2>
          <p className="text-slate-500 text-lg font-light max-w-2xl mx-auto mt-6">
            Bringing clarity and structure to professional billing
          </p>
        </div>

        {/* Card */}
        <div className="relative">
          {/* Corner brackets — decorative */}
          {(
            [
              '-top-4 -left-4 border-t-2 border-l-2 rounded-tl-lg',
              '-top-4 -right-4 border-t-2 border-r-2 rounded-tr-lg',
              '-bottom-4 -left-4 border-b-2 border-l-2 rounded-bl-lg',
              '-bottom-4 -right-4 border-b-2 border-r-2 rounded-br-lg',
            ] as const
          ).map((cls, i) => (
            <div
              key={i}
              aria-hidden="true"
              className={`absolute w-12 h-12 border-primary/20 ${cls}`}
            />
          ))}

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl blur-2xl"
          />

          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/50 p-10 md:p-14">
            <Divider side="left" />

            <div className="space-y-8 text-slate-700">
              <p className="text-xl md:text-2xl font-light leading-relaxed">
                For many professionals, billing feels{' '}
                <strong className="font-medium text-slate-900">chaotic</strong> — client details
                scattered everywhere, project notes lost, and countless hours spent just trying to
                stay organized.
              </p>

              <MathDivider />

              <p className="text-xl md:text-2xl font-light leading-relaxed">
                Sheet2Bill was created to deliver{' '}
                <strong className="font-medium text-slate-900">effortless billing</strong>. One
                elegant platform to create structured briefs, streamline client approvals, and
                generate invoices — all designed to deliver{' '}
                <strong className="font-medium text-slate-900">professional results</strong>{' '}
                seamlessly.
              </p>

              <DotDivider />

              <p className="text-xl md:text-2xl font-light leading-relaxed">
                Designed to eliminate chaos and help you work{' '}
                <strong className="font-medium text-slate-900">
                  smarter, faster, and with complete confidence
                </strong>
                .
              </p>

              <Divider side="right" />

              {/* Signature */}
              <div className="pt-8 mt-12 border-t border-slate-200/50">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900 text-lg">Sheet2Bill Team</p>
                  <TeamIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Story Section Sub-components ────────────────────────────────────────────

function Divider({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-3 ${side === 'right' ? 'flex-row-reverse mt-8' : 'mb-8'}`}
    >
      <div className="w-2 h-2 rounded-full bg-primary/40" />
      <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
    </div>
  );
}

function MathDivider() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-4 py-4">
      <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary/30" />
      <span className="text-primary/30 font-mono text-sm" aria-hidden="true">≈</span>
      <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary/30" />
    </div>
  );
}

function DotDivider() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-4 py-4">
      <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary/30" />
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/30" />
        ))}
      </div>
      <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary/30" />
    </div>
  );
}

function TeamIcon() {
  return (
    <div
      aria-hidden="true"
      className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-px bg-primary/20" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-px h-6 bg-primary/20" />
      </div>
      <div className="w-6 h-6 rounded-full bg-primary/20" />
    </div>
  );
}

// ─── Final CTA Section ────────────────────────────────────────────────────────

function FinalCTASection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative py-32 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:72px_72px]"
      />

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2
            id="cta-heading"
            className="text-4xl md:text-5xl font-bold leading-tight"
          >
            Ready to transform your billing?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of freelancers experiencing effortless billing with professional results.
          </p>
          <div className="pt-4">
            <Link href="/signup" passHref>
              <Button
                size="lg"
                className="h-16 px-12 md:text-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-2xl shadow-primary/25 group"
                aria-label="Sign up free and create your first brief"
              >
                Sign Up Free &amp; Create Your First Brief
                <ArrowRight
                  className="md:ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform"
                  aria-hidden="true"
                />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  useScrollDepthTracking();

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Head>
        {/* ── Primary SEO ── */}
        <title>Sheet2Bill | Free Invoice Generator &amp; Client Management for Freelancers</title>
        <meta
          name="description"
          content="Stop using Excel. Create professional quotes, convert them to invoices, and handle freelance billing in one workflow. Start for free — no credit card required."
        />
        <meta
          name="keywords"
          content="invoice generator, freelance billing software, free invoice generator India, quote to invoice, client management for freelancers, UPI invoice generator, PDF invoice maker, online billing software"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="Sheet2Bill" />
        <link rel="canonical" href={`${SITE_URL}/`} />

        {/* ── Open Graph ── */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:site_name" content="Sheet2Bill" />
        <meta property="og:title" content="Sheet2Bill | Free Invoice Generator" />
        <meta
          property="og:description"
          content="Manage clients, create professional briefs, get approvals, and get paid faster. The all-in-one billing tool for modern freelancers."
        />
        <meta property="og:image" content={`${SITE_URL}/landing.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Sheet2Bill dashboard showing client management and invoice generation" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:locale:alternate" content="en_US" />

        {/* ── Twitter / X ── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sheet2bill" />
        <meta name="twitter:title" content="Sheet2Bill | Free Invoice Generator" />
        <meta
          name="twitter:description"
          content="Streamline your freelance business with effortless billing. Create quotes, send invoices, and track payments — all for free."
        />
        <meta name="twitter:image" content={`${SITE_URL}/landing.png`} />
        <meta name="twitter:image:alt" content="Sheet2Bill dashboard preview" />

        {/* ── PWA / App ── */}
        <meta name="theme-color" content="#ffffff" />
        <link rel="shortcut icon" href="/favicon.ico?v=3" />
        {/* Consider adding apple-touch-icon and manifest links if you have them */}

        {/* ── Structured Data ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        />
      </Head>

      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
      >
        Skip to main content
      </a>

      <NonLoginNavbar />

      <main id="main-content" className="flex-1 pt-16">
        <PremiumHeroSection />
        <ProblemSolutionBanner />
        <FeatureList />

        <section aria-label="How Sheet2Bill works">
          <HowItWorks />
        </section>

        <WhyChooseUs />

        <StorySection />

        <PricingSection />

        <section aria-label="Invoice templates showcase">
          <InvoiceTemplatesShowCase />
        </section>

        <FaqSection />

        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}

// ─── Server-side: redirect authenticated users ────────────────────────────────

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createPagesServerClient(ctx);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (user && !authError) {
    return { redirect: { destination: '/dashboard', permanent: false } };
  }

  return { props: {} };
};

LandingPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};