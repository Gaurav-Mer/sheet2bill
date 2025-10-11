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

      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className=" w-full pt-24 py-16 text-center bg-gradient-to-br from-primary/10 to-secondary/10 ">
          <h1 className="text-4xl md:text-6xl font-extrabold ">
            Your Professional <span className='bg-primary text-white p-3 py-2 rounded-tl-4xl rounded-br-4xl'>Billing</span> Hub.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Manage clients, create professional briefs, get approvals, and track invoices—all in one place. Stop the chaos, start streamlining.
          </p>
          <div className="mt-8">
            <Link href="/signup" passHref><Button size="lg" className="h-12 text-lg ">Get Started - It's Free</Button></Link>
          </div>
        </section>

        {/* --- Social Proof --- */}
        <section className="container mx-auto px-6 py-24">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold">Your Complete Billing Command Center</h2>
            <p className="mt-3 max-w-xl mx-auto text-muted-foreground">Packed with powerful features to save you time and make you look like a pro.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Client Management */}
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Users className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold pt-2">Smart Client Hub</h3>
              <p className="text-muted-foreground">A full CRM to create, read, update, delete, and search all your clients. Keep every detail and billing history in one organized place.</p>
            </div>

            {/* Feature 2: Brief Workflow */}
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CheckCheck className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold pt-2">Pre-Invoice Approval Flow</h3>
              <p className="text-muted-foreground">Eliminate invoice errors and disputes. Send a professional brief for client approval via a secure link before you ever send a bill.</p>
            </div>

            {/* Feature 3: Invoice Generation */}
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <FilePlus className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold pt-2">One-Click Invoice Conversion</h3>
              <p className="text-muted-foreground">Turn any approved brief into a final, sequentially-numbered invoice with a single click. No more re-typing data.</p>
            </div>

            {/* Feature 4: Invoice Management */}
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Zap className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold pt-2">Invoice Tracking Dashboard</h3>
              <p className="text-muted-foreground">See the status of all your invoices at a glance—from 'draft', to 'sent', to 'paid'. Never lose track of a payment again.</p>
            </div>

            {/* Feature 5: PDF Generation */}
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <FileDown className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold pt-2">Premium PDF Exports</h3>
              <p className="text-muted-foreground">Download beautiful, branded PDF invoices that are ready to send to your clients, generated by a powerful server-side engine.</p>
            </div>

            {/* Feature 6: Core Analytics */}
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <BarChart className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold pt-2">At-a-Glance Reporting</h3>
              <p className="text-muted-foreground">Your main dashboard gives you instant insights into your business with key metrics like Total Revenue and Outstanding Amount.</p>
            </div>

            {/* Feature 7: User Settings */}
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <Settings className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold pt-2">Profile & Brand Customization</h3>
              <p className="text-muted-foreground">Add your company logo, full address, and a custom brand color to make every invoice and communication truly yours.</p>
            </div>
          </div>
        </section>
        <section>
          <HowItWorks />
        </section>
        {/* --- Benefits Section --- */}
        <section className="bg-gradient-to-b from-secondary/50 to-secondary/20  py-24">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              {benefits.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="inline-block p-3 bg-primary/10 rounded-lg"><item.icon className="h-8 w-8 text-primary" /></div>
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
        <section className="bg-secondary/50 py-24">
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
