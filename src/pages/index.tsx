/* eslint-disable react/no-unescaped-entities */
// pages/index.tsx
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ReactElement } from 'react';
import { BarChart, Check, CheckCheck, Clock, FileDown, FilePlus, FileText, Settings, Users, Zap } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { CurrentTemplate } from '@/components/templates/CurrentTemplate';
import { sampleInvoiceData } from '@/lib/sample-data';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { FaqSection } from '@/components/landing/FaqSection';
import { Footer } from '@/components/landing/Footer';
import Laptop from '@/components/SVG/Laptop';
import Image from 'next/image';

const benefits = [
  { icon: Clock, title: 'Save Hours Every Month', description: 'Automate your entire billing process and get back to the work that matters.' },
  { icon: FileText, title: 'Look Professional', description: 'Impress your clients with beautiful, branded invoices from premium templates.' },
  { icon: Check, title: 'Get Paid Faster', description: 'Prevent disputes with our pre-invoice approval workflow, ensuring every invoice is correct.' },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* --- Header --- */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2"><Logo className="h-4 w-4" /><span className="font-bold text-xl">Sheet2Bill</span></Link>
          <nav className="space-x-2"><Link href="/login" passHref><Button variant="ghost">Login</Button></Link><Link href="/signup" passHref><Button>Start Free</Button></Link></nav>
        </div>
      </header>

      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section className="relative h-[95vh] min-h-[600px] flex items-center bg-gradient-to-b from-secondary  to-secondary/50 overflow-hidden">
          {/* Background Shape */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-pulse" />
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/10 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Text Content */}
              <div className="text-center md:text-left">
                <span className="inline-block px-4 py-1.5 bg-secondary text-black font-semibold rounded-full text-sm mb-4">
                  The Future of Freelance Invoicing is Here
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold ">
                  Effortless Billing, <br />
                  <span className="text-white bg-primary leading-relaxed px-2 rounded-b-2xl rounded-t-lg " style={{ rotate: "82deg" }}>Professional</span> Results.
                </h1>
                <p className="mt-6 max-w-xl mx-auto md:mx-0 text-lg text-muted-foreground">
                  Manage clients, create professional briefs, get approvals, and track invoices—all in one place. Stop the chaos, start streamlining.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/signup" passHref>
                    <Button size="lg" className="h-12 text-lg w-full sm:w-auto">Get Started - It's Free</Button>
                  </Link>
                  <Link href="#features" passHref>
                    <Button size="lg" variant="outline" className="h-12 text-lg w-full sm:w-auto">
                      Discover Features
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: Visual */}
              <div className="hidden md:block">
                <div className="relative p-4 bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl shadow-lg">
                  {/* Mockup of the app UI */}
                  <div className="aspect-video bg-background rounded-lg p-2 border border-border/10">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-xs text-muted-foreground">Dashboard</div>
                      <div></div>
                    </div>
                    <div className="bg-secondary/20 h-full rounded-sm p-4">
                      {/* Simplified UI elements */}
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="font-bold text-lg">Project Alpha</h3>
                        <div className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">Paid</div>
                      </div>
                      <Image src={"/landing.png"} alt='Landing' width={300} height={100} className='w-fit h-fi mx-auto scale-125' />
                      {/* <div className="space-y-2">
                        <div className="h-4 bg-primary/20 rounded-full w-3/4"></div>
                        <div className="h-4 bg-primary/10 rounded-full w-full"></div>
                        <div className="h-4 bg-primary/10 rounded-full w-5/6"></div>
                      </div> */}
                    </div>
                  </div>
                  <p className="text-center mt-4 text-sm text-black">A glimpse into your new command center.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section id="features" className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Complete Billing Command Center</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Packed with powerful features to save you time and make you look like a pro.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Cards */}
              {[
                { icon: Users, title: "Smart Client Hub", desc: "A full CRM to create, read, update, delete, and search all your clients. Keep every detail and billing history in one organized place." },
                { icon: CheckCheck, title: "Pre-Invoice Approval Flow", desc: "Eliminate invoice errors and disputes. Send a professional brief for client approval via a secure link before you ever send a bill." },
                { icon: FilePlus, title: "One-Click Invoice Conversion", desc: "Turn any approved brief into a final, sequentially-numbered invoice with a single click. No more re-typing data." },
                { icon: Zap, title: "Invoice Tracking Dashboard", desc: "See the status of all your invoices at a glance—from 'draft', to 'sent', to 'paid'. Never lose track of a payment again." },
                { icon: FileDown, title: "Premium PDF Exports", desc: "Download beautiful, branded PDF invoices that are ready to send to your clients, generated by a powerful server-side engine." },
                { icon: BarChart, title: "At-a-Glance Reporting", desc: "Your main dashboard gives you instant insights into your business with key metrics like Total Revenue and Outstanding Amount." },
                { icon: Settings, title: "Profile & Brand Customization", desc: "Add your company logo, full address, and a custom brand color to make every invoice and communication truly yours." }
              ].map((feature, index) => (
                <div key={index} className="p-6 bg-card border border-border/50 rounded-xl hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                  </div>
                  <p className="mt-4 text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <HowItWorks />
        </section>
        {/* --- Benefits Section --- */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((item, index) => (
                <div key={index} className="p-6 text-center bg-card border border-border/50 rounded-xl hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                  <div className="inline-block p-4 bg-primary/10 rounded-full">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* --- Testimonial --- */}
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <blockquote className="max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl font-medium">"The approval workflow is a game-changer. I've saved hours on back-and-forth emails and my clients love the professional briefs."</p>
              <footer className="mt-6">
                <div className="font-semibold">Priya S., Digital Marketer</div>
                <div className="text-muted-foreground">Jaipur, Rajasthan</div>
              </footer>
            </blockquote>
          </div>
        </section>

        <section>
          <FaqSection />
        </section>
        {/* --- Final CTA --- */}
        <section className="bg-gradient-to-t from-secondary/20  to-secondary/10 py-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to transform your billing?</h2>
            <div className="mt-8"><Link href="/signup" passHref><Button size="lg" className="h-12 text-lg">Sign Up Free & Create Your First Brief</Button></Link></div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <Footer />
    </div >
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
