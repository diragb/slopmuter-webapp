// Packages:
import { useState } from 'react'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { getOrganizationJSONLD, getWebSiteJSONLD } from '@/lib/json-ld'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Typescript:
import type { AppProps } from 'next/app'

// Assets:
import '@/styles/globals.css'

// Constants:
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

// Components:
import Navbar from '@/components/Navbar'
import JSONLD from '@/components/JSONLD'
import { Toaster } from '@/components/ui/sonner'
import { Analytics } from '@vercel/analytics/next'
import { ScrollArea } from '@/components/ui/scroll-area'

// Functions:
const App = ({ Component, pageProps }: AppProps) => {
  // Create a single QueryClient instance for the lifetime of the app.
  // This prevents React Query from re-initializing on every render.
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <>
        <Head>
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='mobile-web-app-capable' content='yes' />
          <JSONLD data={getOrganizationJSONLD()} />
          <JSONLD data={getWebSiteJSONLD()} />
          <script src='https://accounts.google.com/gsi/client' async defer></script>
        </Head>
        <ScrollArea className='h-screen'>
          <Navbar />
          <main className={`relative ${inter.className} font-sans`}>
            <Component {...pageProps} />
            <Toaster />
            <Analytics />
          </main>
        </ScrollArea>
      </>
    </QueryClientProvider>
  )
}

// Exports:
export default App
