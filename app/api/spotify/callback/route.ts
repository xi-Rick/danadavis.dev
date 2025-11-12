import { type NextRequest, NextResponse } from 'next/server'

/**
 * Spotify OAuth Callback Route
 * Handles the authorization code returned from Spotify
 * Exchanges the code for a refresh token
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  // Handle authorization errors
  if (error) {
    return NextResponse.json(
      {
        error: 'Authorization failed',
        description: error,
        message:
          'Make sure you added the redirect URI to your Spotify app dashboard: https://danadavis.dev/api/spotify/callback',
      },
      { status: 400 },
    )
  }

  // No code provided
  if (!code) {
    return NextResponse.json(
      {
        error: 'Missing authorization code',
        message: 'No code parameter provided in callback',
      },
      { status: 400 },
    )
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      {
        error: 'Missing Spotify configuration',
        message:
          'SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, or SPOTIFY_REDIRECT_URI not set',
      },
      { status: 500 },
    )
  }

  try {
    // Exchange authorization code for access token and refresh token
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    )

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        {
          error: 'Token exchange failed',
          description: error.error_description || response.statusText,
        },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Return HTML page with the refresh token
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify Authorization Successful</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 2rem;
              background: #191414;
              color: #fff;
            }
            .container {
              background: #282828;
              padding: 2rem;
              border-radius: 8px;
              text-align: center;
            }
            h1 {
              color: #1DB954;
              margin-bottom: 1rem;
            }
            .token-box {
              background: #1DB954;
              padding: 1rem;
              border-radius: 8px;
              margin: 1rem 0;
              text-align: left;
              word-break: break-all;
              font-family: monospace;
              font-size: 0.9rem;
              color: #000;
            }
            .instructions {
              background: #404040;
              padding: 1rem;
              border-radius: 8px;
              margin-top: 1rem;
              text-align: left;
            }
            .instructions ol {
              margin: 0.5rem 0;
              padding-left: 1.5rem;
            }
            .instructions li {
              margin: 0.5rem 0;
            }
            code {
              background: #191414;
              padding: 0.2rem 0.4rem;
              border-radius: 4px;
              font-size: 0.9rem;
            }
            button {
              background: #1DB954;
              color: #000;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 24px;
              font-weight: bold;
              cursor: pointer;
              margin-top: 1rem;
            }
            button:hover {
              background: #1ed760;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Authorization Successful!</h1>
            
            <p>Your Spotify app has been authorized. Copy your refresh token below:</p>
            
            <div class="token-box">
              ${data.refresh_token}
            </div>
            
            <div class="instructions">
              <strong>Next Steps:</strong>
              <ol>
                <li>Copy the refresh token above (click to select all)</li>
                <li>Open your <code>.env.local</code> file</li>
                <li>Find the line: <code>SPOTIFY_REFRESH_TOKEN="your_refresh_token_here"</code></li>
                <li>Replace it with: <code>SPOTIFY_REFRESH_TOKEN="${data.refresh_token}"</code></li>
                <li>Save the file</li>
                <li>Restart your dev server</li>
              </ol>
            </div>
            
            <p style="margin-top: 2rem; color: #b3b3b3; font-size: 0.9rem;">
              Your footer will now display your currently playing Spotify track!
            </p>
            
            <button onclick="navigator.clipboard.writeText('${data.refresh_token}').then(() => alert('Copied to clipboard!'))">
              📋 Copy Token to Clipboard
            </button>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      },
    )
  } catch (error) {
    console.error('Error during Spotify authorization:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
