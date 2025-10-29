/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/_app.tsx
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { AppProps } from 'next/app'
import { ReactElement, ReactNode, useState } from 'react'
import '../styles/globals.css' // Assuming your global styles are here
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { Layout } from '@/components/Layout'
import { NextPage } from 'next'
import Head from 'next/head'
import { FeedbackLink } from '@/components/landing/FeedbackLink'
import CookieConsent from "react-cookie-consent"; // <-- 1. Import the component
import { Analytics } from "@vercel/analytics/next"


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

  return (
    <QueryClientProvider client={queryClient}>
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
      <Analytics />
    </QueryClientProvider>
  )
}

export default MyApp