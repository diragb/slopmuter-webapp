// Packages:
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'

// Typescript:
interface GoogleAuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: {
    id: string
    email: string
    name: string
    avatarUrl: string
  }
}

// Constants:
import env from '@/config/env'

// Functions:
const AuthGoogleCallback = () => {
  // Constants:
  const router = useRouter()
  const codeParam = router.query.code
  const code = Array.isArray(codeParam) ? codeParam[0] : codeParam

  // Ref:
  const didRequestRef = useRef(false)

  // Functions:
  const authGoogleWithCode = async (input: { code: string; redirectUri: string }) => {
    const response = await fetch(`${env.backendUrl}/v1/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: input.code,
        redirectUri: input.redirectUri,
      }),
    })
  
    if (!response.ok) {
      const body = await response.text().catch(() => '')
      throw new Error(body ? `Google Auth failed: ${body}` : 'Google Auth failed')
    }
  
    return (await response.json()) as GoogleAuthResponse
  }

  const { mutate, data, error, isPending } = useMutation({
    mutationFn: authGoogleWithCode,
  })

  // Effects:
  useEffect(() => {
    if (!router.isReady) return
    if (!code || typeof code !== 'string') return
    if (didRequestRef.current) return

    didRequestRef.current = true

    const redirectUri = `${window.location.origin}/auth/google/callback`
    mutate({ code, redirectUri })
  }, [router.isReady, code, mutate])

  useEffect(() => {
    if (data) {
      window.opener.postMessage(
        {
          type: 'auth_success',
          payload: data,
        },
        env.extensionPageOrigin,
      )
    }
  }, [data])

  if (!router.isReady) {
    return <div>Loading...</div>
  }

  if (!code || typeof code !== 'string') {
    return <div>Missing Google auth code</div>
  }

  if (isPending) {
    return <div>Signing you in...</div>
  }

  if (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return <div>Google sign-in failed: {message}</div>
  }

  return <div>Auth complete. You can close this tab.</div>
}

// Exports:
export default AuthGoogleCallback
