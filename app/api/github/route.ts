import type { NextRequest } from 'next/server'
import { fetchRepoData } from '~/utils/github'

export async function GET(request: NextRequest) {
  const { searchParams: params } = new URL(request.url)
  const repo = params.get('repo')
  if (!repo) {
    return Response.json(
      { message: 'Missing repo parameter' },
      {
        status: 400,
      },
    )
  }
  if (repo === 'undefined' || repo === 'null') {
    return Response.json(null)
  }
  const data = await fetchRepoData({ repo, includeLastCommit: true })
  return Response.json(data)
}
