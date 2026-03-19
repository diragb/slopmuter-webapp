// Constants:
const env = {
  googleClientID: process.env['NEXT_PUBLIC_GOOGLE_CLIENT_ID'] || '',
  baseUrl: process.env['NEXT_PUBLIC_BASE_URL'] || 'http://localhost:3000',
} as const

if (!env.googleClientID) throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set')

// Exports:
export default env
