/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/index.tsx
import { createClient } from '@supabase/supabase-js'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

export default function HomePage({ connectionStatus, errorMessage }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Sheet2bill</h1>
        <p className="text-2xl font-light">
          Connection Status:
          {connectionStatus === 'Successful' ?
            <span className="text-green-500 font-semibold ml-2">Successful</span> :
            <span className="text-red-500 font-semibold ml-2">Failed</span>
          }
        </p>
        {errorMessage && <p className="text-red-400 mt-4">Error: {errorMessage}</p>}
        <p className="text-gray-400 mt-8">Your journey to build a global SaaS from Jaipur starts now.</p>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // The CHANGE is here: we are now querying our new 'profiles' table.
    // This is a much better and more realistic test.
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      throw error;
    }

    console.log("Successfully connected to Supabase and queried the 'profiles' table!", { data });

    return {
      props: {
        connectionStatus: 'Successful',
        errorMessage: null,
      },
    };
  } catch (error: any) {
    console.error("Error connecting to Supabase:", error.message);
    return {
      props: {
        connectionStatus: 'Failed',
        errorMessage: error.message,
      },
    };
  }
}