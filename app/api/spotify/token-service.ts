/**
 * Spotify OAuth2 Token Service
 * Handles getting and caching access tokens using two approaches:
 * 1. Client Credentials flow (public data only)
 * 2. Authorization Code flow with Refresh Token (user-specific data)
 */

interface SpotifyTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
}

interface CachedToken {
  token: string
  expiresAt: number
}

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
let cachedToken: CachedToken | null = null

/**
 * Get a valid Spotify access token
 * Tries to use refresh token first (if available) for user-authorized access
 * Falls back to Client Credentials flow for public data only
 */
export async function getSpotifyAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing Spotify credentials. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.',
    )
  }

  // Return cached token if still valid
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token
  }

  // Try to use refresh token for user-authorized access (preferred)
  if (refreshToken) {
    try {
      return await getTokenUsingRefreshToken(
        clientId,
        clientSecret,
        refreshToken,
      )
    } catch (error) {
      console.warn(
        'Refresh token flow failed, falling back to Client Credentials:',
        error,
      )
      // Fall through to Client Credentials flow
    }
  }

  // Fall back to Client Credentials flow (public data only)
  return await getTokenUsingClientCredentials(clientId, clientSecret)
}

/**
 * Get access token using Authorization Code flow with Refresh Token
 * This provides access to user-specific data like currently playing track
 */
async function getTokenUsingRefreshToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string,
): Promise<string> {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64',
  )

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
    cache: 'no-store',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(
      `Spotify refresh token failed: ${error.error_description || response.statusText}`,
    )
  }

  const data: SpotifyTokenResponse = await response.json()

  // Cache token with 60 second buffer before expiration
  const expiresAt = Date.now() + (data.expires_in - 60) * 1000
  cachedToken = {
    token: data.access_token,
    expiresAt,
  }

  console.log('[Spotify] Access token refreshed (user-authorized)')
  return data.access_token
}

/**
 * Get access token using Client Credentials flow
 * Only provides access to public Spotify data, not user-specific data
 */
async function getTokenUsingClientCredentials(
  clientId: string,
  clientSecret: string,
): Promise<string> {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64',
  )

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(
      `Spotify authentication failed: ${error.error_description || response.statusText}`,
    )
  }

  const data: SpotifyTokenResponse = await response.json()

  // Cache token with 60 second buffer before expiration
  const expiresAt = Date.now() + (data.expires_in - 60) * 1000
  cachedToken = {
    token: data.access_token,
    expiresAt,
  }

  console.log('[Spotify] Access token generated (public data only)')
  return data.access_token
}

/**
 * Clear the cached token (useful for testing or forced refresh)
 */
export function clearSpotifyTokenCache(): void {
  cachedToken = null
}
