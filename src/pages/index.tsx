/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/index.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ReactElement, useEffect, useRef, useCallback, useState } from 'react';
import { ArrowRight, Clock, RefreshCw, CreditCard } from 'lucide-react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import FinalCTASection from '@/components/landing/FinalCTASection';
const ProblemSolutionBanner = dynamic(() => import('@/components/landing/ProblemSolutionBanner').then(mod => mod.ProblemSolutionBanner));
const FeatureList = dynamic(() => import('@/components/landing/FeatureList'));
const WhyChooseUs = dynamic(() => import('@/components/landing/WhyChooseUs').then(mod => mod.WhyChooseUs));
const HowItWorks = dynamic(() => import('@/components/landing/HowItWorks').then(mod => mod.HowItWorks));

const PricingSection = dynamic(() => import('@/components/landing/PricingSection'));
const InvoiceTemplatesShowCase = dynamic(() => import('@/components/landing/InvoiceTemplateShowCase'));
const FaqSection = dynamic(() => import('@/components/landing/FaqSection').then(mod => mod.FaqSection));
const Footer = dynamic(() => import('@/components/landing/Footer').then(mod => mod.Footer));
const NonLoginNavbar = dynamic(() => import("@/components/landing/NonLoginNavbar").then(mod => mod.default));
const PremiumHeroSection = dynamic(() => import("@/components/landing/PremiumHeroSection").then(mod => mod.PremiumHeroSection))

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
      alternateName: 'Sheet2Bill Billing Suite',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'InvoicingApplication',
      operatingSystem: 'Web, iOS, Android',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo_512.png`,
        width: 512,
        height: 512,
      },
      description:
        'Free GST invoice generator and billing software for Indian freelancers and consultants. Create professional quotes, get online client approvals, and send PDF invoices with UPI QR codes — all in one workflow.',
      featureList: [
        'Free GST Invoice Generator',
        'Quote to Invoice Conversion',
        'Online Client Approval Workflow',
        'Branded PDF Invoice Export',
        'UPI QR Code Payment Integration',
        'Client Management CRM',
        'Auto-Sequential Invoice Numbering',
        'Revenue & Payment Dashboard',
        'Razorpay Payment Collection',
        'White-label Invoice Branding',
      ],
      screenshot: `${SITE_URL}/landing.png`,
      offers: [
        {
          '@type': 'Offer',
          name: 'Starter Plan',
          price: '0',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          description: 'Free forever — 3 invoices per month, 2 saved clients, PDF export.',
        },
        {
          '@type': 'Offer',
          name: 'Pro Freelancer',
          price: '299',
          priceCurrency: 'INR',
          billingIncrement: '30',
          availability: 'https://schema.org/InStock',
          description: '200 invoices/month, 50 clients, premium templates, no watermark, custom branding.',
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Sheet2Bill',
      url: SITE_URL,
      description:
        'Free invoice generator and billing software for Indian freelancers. Manage clients, create GST-ready quotes, collect approvals, and get paid faster with UPI and Razorpay.',
      publisher: { '@id': `${SITE_URL}/#software` },
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
      name: 'Sheet2Bill — Free Invoice Generator & Billing Software for Indian Freelancers',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#software` },
      description:
        'Create GST-ready invoices, convert quotes to invoices in one click, and accept UPI payments. The free billing tool built for Indian freelancers and consultants.',
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is Sheet2Bill free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, Sheet2Bill has a free forever Starter plan that includes 3 invoices per month, 2 saved clients, and PDF export. No credit card required.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I create GST invoices on Sheet2Bill?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Sheet2Bill supports GST-ready invoice templates. Add your GSTIN and generate professional GST-compliant invoices as downloadable PDFs.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Sheet2Bill support UPI payments?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Sheet2Bill automatically embeds a UPI QR code on your invoices so clients can pay instantly via GPay, PhonePe, Paytm, or any UPI app.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I convert a quote to an invoice?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Once a client approves your brief or quote, you can convert it to a final invoice in a single click — no re-entering data.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Sheet2Bill suitable for Indian freelancers and consultants?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Absolutely. Sheet2Bill is built specifically for the Indian market with INR pricing, GST invoice support, UPI QR codes, and Razorpay payment collection.',
          },
        },
      ],
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
    globalThis.requestAnimationFrame(() => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const totalScrollable = scrollHeight - clientHeight;

      if (totalScrollable > 0) {
        const scrolledPercent = Math.floor((scrollTop / totalScrollable) * 100);

        for (const threshold of SCROLL_THRESHOLDS) {
          if (scrolledPercent >= threshold && !firedRef.current.has(threshold)) {
            firedRef.current.add(threshold);
            (globalThis as any).gtag?.('event', 'scroll_depth', {
              value: threshold,
              page_path: globalThis.location.pathname,
            });
          }
        }
      }

      tickingRef.current = false;
    });
  }, []);

  useEffect(() => {
    globalThis.addEventListener('scroll', handleScroll, { passive: true });
    return () => globalThis.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
}

// ─── Product Promises Section ─────────────────────────────────────────────────

const PRODUCT_PROMISES = [
  {
    icon: Clock,
    title: 'Under 5 minutes',
    body: 'Create a professional quote or invoice from scratch — with line items, GST, and your branding.',
  },
  {
    icon: RefreshCw,
    title: 'Zero re-entry',
    body: 'Client approves your quote and it converts to a final invoice in one click. No copy-paste.',
  },
  {
    icon: CreditCard,
    title: 'Free forever plan',
    body: 'Start with no credit card. Upgrade to Pro only when your billing volume demands it.',
  },
];



function ProductPromisesSection() {
  return (
    <section
      aria-label="Product promises"
      className="relative overflow-hidden bg-zinc-50/50 py-12 border-t border-zinc-200/60"
    >
      {/* Structural Editorial Grid Lines */}
      <div className="absolute top-0 left-1/4 bottom-0 w-px bg-zinc-200/40 hidden lg:block pointer-events-none" />
      <div className="absolute top-0 left-3/4 bottom-0 w-px bg-zinc-200/40 hidden lg:block pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-start">

          {/* Left Column: Premium Minimalist Section Identity */}
          <div className="lg:col-span-5 lg:sticky lg:top-36 space-y-5">
            {/* Minimal Pure Border Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1">
              <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
                Guarantees
              </span>
            </div>

            <h2 className="text-3xl font-medium tracking-tight text-primary sm:text-5xl leading-[1.15]">
              Built for absolute <span className="font-serif italic text-zinc-500">peace of mind</span>.
            </h2>

            <p className="max-w-sm text-md leading-relaxed text-zinc-500">
              We stand behind the explicit engineering of our platform. No compromises on core architecture security, network speed, or direct independent utility.
            </p>
          </div>

          {/* Right Column: High-End Minimal Card Layout Stack */}
          <div className="lg:col-span-7 space-y-4">
            {PRODUCT_PROMISES.map(({ icon: Icon, title, body }, index) => (
              <div
                key={title}
                className="group relative flex flex-col sm:flex-row items-start gap-5 p-6 rounded-2xl border border-zinc-200/80 bg-white/90 backdrop-blur-md transition-all duration-300 hover:border-primary hover:shadow-[0_15px_35px_rgba(0,0,0,0.03)]"
              >
                {/* Monospace Visual Index Counter Accent */}
                <span className="absolute top-6 right-6 font-mono text-sm tracking-widest text-zinc-400 transition-colors duration-300 group-hover:text-primary">
                  // 0{index + 1}
                </span>

                {/* Refined Geometric Icon Capsule */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-200 transition-all duration-300 group-hover:bg-primary group-hover:border-primary">
                  <Icon className="h-4 w-4 text-zinc-600 transition-colors duration-300 group-hover:text-white" aria-hidden="true" />
                </div>

                {/* Typography Copy Canvas */}
                <div className="space-y-1 pt-1.5 max-w-xl">
                  <h3 className="text-lg font-medium ">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-500 transition-colors duration-300 group-hover:text-zinc-600">
                    {body}
                  </p>
                </div>
              </div>
            ))}
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
        <title>Sheet2Bill — Free Invoice Generator for Indian Freelancers | GST Invoice, UPI & PDF</title>
        <meta
          name="description"
          content="Free invoice generator for Indian freelancers & consultants. Create GST-ready quotes, collect client approvals, and send PDF invoices with UPI QR codes. No Excel. No credit card needed."
        />
        <meta
          name="keywords"
          content="free invoice generator India, GST invoice maker, freelance billing software India, quote to invoice, UPI invoice generator, PDF invoice maker, online billing software for freelancers, invoice generator for consultants, freelance invoice app India, billing software India"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="Sheet2Bill" />
        <link rel="canonical" href={`${SITE_URL}/`} />

        {/* ── Open Graph ── */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:site_name" content="Sheet2Bill" />
        <meta property="og:title" content="Sheet2Bill — Free Invoice Generator for Indian Freelancers" />
        <meta
          property="og:description"
          content="Create GST-ready invoices, convert quotes to invoices in one click, and accept UPI payments. The free billing tool built for Indian freelancers and consultants."
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
        <meta name="twitter:title" content="Sheet2Bill — Free Invoice Generator for Indian Freelancers" />
        <meta
          name="twitter:description"
          content="Create GST-ready invoices, collect client approvals, and accept UPI payments — all in one free tool built for Indian freelancers and consultants."
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

        <ProductPromisesSection />

        <ProblemSolutionBanner />

        <section aria-label="How Sheet2Bill works">
          <HowItWorks />
        </section>

        <FeatureList />

        <WhyChooseUs />

        <PricingSection />

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