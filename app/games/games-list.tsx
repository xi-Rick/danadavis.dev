'use client'

import { GameCard } from '~/components/cards/game'
import type { Game } from '~/types/data'

export function GamesList({ games }: { games: Game[] }) {
  return (
    <div className="space-y-6 md:space-y-10 px-4 sm:px-6 md:px-0 pt-4 md:pt-0">
      <ul className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:gap-x-10 lg:gap-y-12">
        {games.map((game) => (
          <li key={game.id}>
            <GameCard game={game} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GamesList
