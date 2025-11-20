import { genPageMetadata } from '~/app/seo'
import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'
import type { Game } from '~/types/data'
import { GamesList } from './games-list'
import { loadGamesFromJson } from './load-games'

import { GAMES } from '~/data/games'

export const metadata = genPageMetadata({
  title: 'Games',
  description:
    'A curated list of video games I enjoy and recommend — spanning tight indie platformers, music rhythm games, and sprawling RPGs. I look for thoughtful design, strong mechanics, and memorable experiences; this is where I keep track of what I’m currently playing and what I’d recommend.',
})

// use the centralized loader to read games from JSON

export default async function GamesPage() {
  const games = await loadGamesFromJson()

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Games"
        description=<p>
          I maintain a curated list of video games I enjoy and recommend — from
          tight indie platformers and music rhythm games to sprawling RPGs and
          narrative-driven experiences. I’m drawn to thoughtful design,
          satisfying mechanics, and memorable moments; this is where I keep
          track of what I’m currently playing and what I’d recommend.
        </p>
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="py-8 md:py-12">
        <GamesList games={games} />
      </div>
    </Container>
  )
}
