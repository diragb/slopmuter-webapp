// Packages:
import { useMutation } from '@tanstack/react-query'
import { LoaderCircleIcon } from 'lucide-react'
import Link from 'next/link'

// Components:
import { Button } from '@/components/ui/button'

// Constants:
import env from '@/config/env'

const REDIRECT_URI = `${env.baseUrl}/auth/google/callback`
const SCOPES = ['openid', 'email', 'profile'].join(' ')

// Functions:
const buildGoogleAuthUrl = () => {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')

  url.searchParams.set('client_id', env.googleClientID)
  url.searchParams.set('redirect_uri', REDIRECT_URI)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', SCOPES)
  url.searchParams.set('access_type', 'offline')
  url.searchParams.set('prompt', 'consent')
  url.searchParams.set('include_granted_scopes', 'true')

  return url.toString()
}

const AuthGoogleStart = () => {
  // Functions:
  const { mutate: signIn, isPending } = useMutation({
    mutationFn: async () => {
      window.location.href = buildGoogleAuthUrl()
      return new Promise<never>(() => {})
    },
  })

  // Return:
  return (
    <section className='relative flex min-h-dvh w-full flex-col items-center justify-center px-6 pb-24'>
      <div
        className='pointer-events-none absolute inset-0 z-0'
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.035) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        className='pointer-events-none absolute inset-0 z-0'
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, white 100%)',
        }}
      />

      <div className='relative z-10 mx-auto flex w-full max-w-sm flex-col items-center rounded-2xl border border-neutral-200 bg-white px-8 py-12 shadow-sm'>
        <div className='flex size-14 items-center justify-center rounded-xl bg-neutral-950 shadow-sm'>
          <svg className='size-7 text-white' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M3.064 7.51A9.996 9.996 0 0 1 12 2c2.695 0 4.959.991 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123-.2.6-.314 1.24-.314 1.9 0 .66.114 1.3.314 1.9.786 2.364 2.99 4.123 5.595 4.123 1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045 0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49Z' />
          </svg>
        </div>

        <h1 className='mt-6 text-2xl font-bold tracking-tight text-neutral-950'>
          Sign in
        </h1>
        <p className='mt-2 text-center text-sm leading-relaxed text-neutral-500'>
          Continue with Google to connect the SlopMuter extension to your account.
        </p>

        <Button
          size='lg'
          className='mt-8 w-full rounded-full bg-neutral-950 text-sm font-semibold text-white shadow-md hover:bg-neutral-800'
          disabled={isPending}
          onClick={() => signIn()}
        >
          {isPending ? (
            <>
              <LoaderCircleIcon className='size-4 animate-spin' />
              Redirecting&hellip;
            </>
          ) : (
            'Sign in with Google'
          )}
        </Button>

        <p className='mt-6 text-center text-xs leading-relaxed text-neutral-400'>
          By signing in you agree to our{' '}
          <Link href='/privacy' className='underline underline-offset-2 transition-colors hover:text-neutral-600'>
            Privacy Policy
          </Link>
        </p>
      </div>
    </section>
  )
}

// Exports:
export default AuthGoogleStart
