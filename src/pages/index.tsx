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

      <main className="flex-1 h-full w-full">
        {/* --- Hero Section --- */}
        <section className=" w-full h-dvh relative text-center flex items-center justify-center bg-gradient-to-b from-primary/10 to-primary/25 text-black  ">
          <div className='grid grid-cols-7 mx-5'>
            <div className='col-span-4 flex items-center flex-col justify-center'>
              <h1 className="text-4xl md:text-6xl font-extrabold ">
                <span className='relative mb-20 text-black px-4 ' >Your Professional</span>
              </h1>
              <p className='text-4xl md:text-6xl font-extrabold mt-8'><span className='bg-primary mt-40  text-white p-3 py-2 rounded-tl-4xl rounded-br-4xl rotate-2'>Billing</span> Hub.</p>
              <svg width="100" height="100" className='absolute top-3 left-20' viewBox="0 0 318 581" fill="#61ac0c" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.0268 580.046C65.7316 573.499 115.49 551.566 155.428 516.539C196.021 481.184 224.501 432.735 236.94 380.685C248.398 332.563 249.053 273.966 219.263 231.736C204.859 211.44 184.236 196.709 160.011 190.489C136.769 184.597 111.562 185.906 88.9741 194.09C41.507 211.44 10.0806 257.598 2.22393 306.374C-1.70438 331.253 -1.37702 358.424 11.0626 381.012C24.4843 405.564 51.6551 416.039 77.5165 421.277C126.293 431.098 178.67 421.932 221.554 396.725C265.093 371.191 296.192 328.962 309.941 280.513C323.363 232.718 319.435 180.996 296.847 136.802C275.241 94.2454 237.595 60.2001 193.729 41.5406C183.253 36.9576 172.123 33.6841 160.993 31.0652C150.845 28.7737 146.262 44.4869 156.737 46.7784C199.294 55.9444 237.922 81.1511 264.439 115.524C291.937 151.206 304.704 195.399 300.775 240.248C297.174 285.096 276.878 328.635 243.815 359.406C210.752 390.178 165.576 407.528 120.401 408.51C97.8128 408.837 73.9156 405.564 53.2919 396.725C42.4891 391.815 32.6683 384.94 26.4485 374.792C20.8834 365.299 17.9372 354.496 16.9551 343.366C13.0268 299.172 31.6862 250.723 67.3684 223.88C101.414 198.346 152.154 194.745 186.854 220.933C224.173 249.086 230.721 302.446 226.138 345.657C221.227 394.761 200.604 442.556 168.522 479.874C136.769 516.866 93.8845 543.709 46.7448 556.804C35.6146 559.75 24.157 562.369 12.6994 563.678C8.44375 564.333 4.51545 566.952 4.51545 571.862C4.8428 575.791 8.77111 580.374 13.0268 580.046Z" fill="#61ac0c" />
                <path d="M181.944 1.27542C174.415 5.85845 166.885 10.7688 160.011 15.6792C156.083 18.2981 152.482 21.2443 148.881 24.1906C145.28 26.8094 142.006 29.7557 140.369 34.0113C136.441 43.8321 145.935 52.6708 151.5 59.8727C157.065 67.0746 162.957 73.6218 169.177 80.169C176.706 87.6982 188.164 76.2407 180.635 68.7114C175.397 63.4737 170.486 57.9086 165.903 52.3435C163.612 49.7246 161.648 46.7784 159.356 44.1595C158.374 42.85 157.065 41.2132 156.083 39.9038C155.755 39.5764 155.428 38.9217 155.101 38.5943C155.101 38.9217 155.101 39.2491 155.428 39.5765C155.428 40.2312 155.101 40.5586 155.101 41.2133C155.428 40.5586 155.755 40.2312 155.428 40.5585C160.338 37.2849 165.903 32.3745 171.141 28.4462C177.361 24.1905 183.581 19.9349 190.128 16.0066C198.967 9.78676 190.783 -4.28968 181.944 1.27542Z" fill="#61ac0c" />
              </svg>

              <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                Manage clients, create professional briefs, get approvals, and track invoices—all in one place. Stop the chaos, start streamlining.
              </p>

              <div className="mt-8">
                <Link href="/signup" passHref><Button size="lg" className="h-12 text-lg ">Get Started - It's Free</Button></Link>
              </div>
            </div>
            <div className='col-span-3 hidden md:flex items-center justify-center relative'>
              <Image src={"/test.svg"} alt='test' height={1} width={1} className='h-[90%] z-10 w-full' />
              <svg className='absolute -top-14 scale-125' viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#61AC0C" d="M43.9,-72.1C56.2,-68.9,65,-55.8,71.1,-42.1C77.1,-28.4,80.3,-14.2,82,1C83.7,16.2,84,32.4,74.4,39.9C64.8,47.4,45.4,46.1,31.3,53.9C17.3,61.6,8.6,78.3,-3.8,84.9C-16.2,91.5,-32.5,87.9,-41.1,77C-49.6,66.1,-50.6,48,-58.5,33.9C-66.4,19.9,-81.2,9.9,-80.1,0.7C-79,-8.6,-61.9,-17.2,-54,-31.4C-46.2,-45.5,-47.5,-65.1,-40.1,-71.1C-32.6,-77.1,-16.3,-69.5,-0.3,-69C15.8,-68.6,31.6,-75.3,43.9,-72.1Z" transform="translate(100 100)" />
              </svg>
            </div>
          </div>
        </section>

        {/* --- Social Proof --- */}
        <section className="h-dvh  mx-auto px-6 py-24">
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
