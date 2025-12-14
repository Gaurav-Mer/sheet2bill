/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/_app.tsx
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { AppProps } from 'next/app'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import '../styles/globals.css' // Assuming your global styles are here
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { Layout } from '@/components/Layout'
import { NextPage } from 'next'
import Head from 'next/head'
import { FeedbackLink } from '@/components/landing/FeedbackLink'
import CookieConsent from "react-cookie-consent"; // <-- 1. Import the component
import { Analytics } from "@vercel/analytics/next"
import { useRouter } from 'next/router'
import { pageview } from "@/lib/gtag"
import { UpgradeModalProvider } from '@/components/providers/UpgradeModalProvider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
      refetchOnMount: false,
    },
  },
});

export type NextPageWithLayout<P = any, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ initialSession: Session }> & {
  Component: NextPageWithLayout;
  pageProps?: any
};


function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);
  const router = useRouter(); // 1. Get the router

  // --- THIS IS THE NEW PART ---
  useEffect(() => {
    // This function will be called every time a route changes
    const handleRouteChange = (url: string) => {
      pageview(url);
    };

    // Listen for the 'routeChangeComplete' event
    router.events.on('routeChangeComplete', handleRouteChange);

    // Clean up the listener when the component unmounts
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  // --- END OF NEW PART ---


  return (
    <QueryClientProvider client={queryClient}>
      <UpgradeModalProvider>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        >
          <Head>
            <title>Sheet2Bill</title>
            <meta name="description" content="The ultimate tool for freelancers to manage clients, create professional briefs, and automate invoicing." />
          </Head>
          {getLayout(<Component {...pageProps} />)}
          {/* --- ADD THESE TWO LINES --- */}
          {pageProps.user && <FeedbackLink />}
          {/* --------------------------- */}

          {/* --- 2. ADD THE COOKIE CONSENT COMPONENT --- */}
          <CookieConsent
            location="bottom"
            buttonText="I understand"
            cookieName="sheet2bill-cookie-consent"
            style={{ background: "#2B373B" }}
            buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
            expires={150}
          >
            This website uses cookies to ensure you get the best experience on our website.
          </CookieConsent>
          {/* ------------------------------------------- */}


          <Toaster // This component will render the toast notifications
            position="bottom-right"
            toastOptions={{
              duration: 5000,
            }}
          />
        </SessionContextProvider>
      </UpgradeModalProvider >
      <Analytics />
    </QueryClientProvider>
  )
}

export default MyApp