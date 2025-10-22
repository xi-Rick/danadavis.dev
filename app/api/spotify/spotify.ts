import type { NowPlayingData, RecentlyPlayedData } from '~/types/data'

const CURRENTLY_PLAYING =
  'https://api.spotify.com/v1/me/player/currently-playing'
const RECENTLY_PLAYED = 'https://api.spotify.com/v1/me/player/recently-played'

const { SPOTIFY_API_KEY: api_key } = process.env

export async function getNowPlaying(): Promise<NowPlayingData> {
  try {
    const access_token = api_key
    const url = new URL(CURRENTLY_PLAYING)
    url.searchParams.append('additional_types', 'track,episode')

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-store',
    })

    if (response.status === 204) {
      return { ok: false, error: 'No content available.' }
    }
    if (response.status >= 400) {
      return { ok: false, error: `Bad request: ${response.status}` }
    }

    const data = await response.json()

    // Handle podcast episodes
    if (data?.currently_playing_type === 'episode') {
      return {
        ok: true,
        song: {
          title: data.item.name,
          artist: data.item.show?.name || 'Unknown Show',
          album: data.item.show?.name || 'Podcast',
          albumImageUrl:
            data.item.images?.[0]?.url || data.item.show?.images?.[0]?.url,
          songUrl: data.item.external_urls?.spotify || '',
        },
      }
    }

    // Handle tracks
    if (data?.item && data.item.type === 'track') {
      return {
        ok: true,
        song: {
          title: data.item.name,
          artist: data.item.artists
            .map((art: { name: string }) => art.name)
            .join(', '),
          album: data.item.album.name,
          albumImageUrl: data.item.album.images[0]?.url,
          songUrl: data.item.external_urls.spotify,
        },
      }
    }

    return { ok: false, error: 'No currently playing track found.' }
  } catch (error) {
    console.error('Error fetching currently playing track:', error)
    return {
      ok: false,
      error: error?.message || error?.toString() || 'Unknown error',
    }
  }
}

export async function getRecentlyPlayed(): Promise<RecentlyPlayedData> {
  try {
    const access_token = api_key
    const res = await fetch(RECENTLY_PLAYED, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    if (res.status === 204) {
      return { ok: false, error: 'No content available.' }
    }
    if (res.status >= 400) {
      return { ok: false, error: `Bad request: ${res.status}` }
    }

    const data = await res.json()
    if (Array.isArray(data.items) && data.items.length > 0) {
      const lastPlayed = data.items[0]
      return {
        ok: true,
        song: {
          playedAt: lastPlayed.played_at,
          title: lastPlayed.track.name,
          artist: lastPlayed.track.artists
            .map((art: { name: string }) => art.name)
            .join(', '),
          album: lastPlayed.track.album.name,
          albumImageUrl: lastPlayed.track.album.images[0]?.url,
          songUrl: lastPlayed.track.external_urls.spotify,
        },
      }
    }
    return { ok: false, error: 'No recently played tracks found.' }
  } catch (error) {
    console.error('Error fetching recently played tracks:', error)
    return {
      ok: false,
      error: error?.message || error?.toString() || 'Unknown error',
    }
  }
}
