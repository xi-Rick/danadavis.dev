import { promises as fs } from 'node:fs'
import path from 'node:path'
import { GAMES } from '~/data/games'
import type { Game } from '~/types/data'

export async function loadGamesFromJson(): Promise<Game[]> {
  try {
    const filePath = path.join(process.cwd(), 'json', 'games.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const gamesData = JSON.parse(fileContents) as Game[]
    return gamesData.map((g) => ({
      ...g,
      imgSrc: g.images && g.images.length > 0 ? g.images[0] : g.imgSrc,
    }))
  } catch (error) {
    console.error('Error loading games from JSON:', error)
    return GAMES as Game[]
  }
}

export async function loadGameBySlugFromJson(
  slug: string,
): Promise<Game | null> {
  const games = await loadGamesFromJson()
  return games.find((g) => g.slug === slug) || null
}
