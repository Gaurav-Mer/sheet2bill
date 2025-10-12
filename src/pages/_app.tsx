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
        <Toaster // This component will render the toast notifications
          position="bottom-right"
          toastOptions={{
            duration: 5000,
          }}
        />
      </SessionContextProvider>
    </QueryClientProvider>
  )
}

export default MyApp