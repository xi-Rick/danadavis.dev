import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file' }, { status: 400 })
    }

    // Call OpenAI Whisper API
    const openaiFormData = new FormData()
    openaiFormData.append('file', audioFile)
    openaiFormData.append('model', 'whisper-1')

    const transcriptionResponse = await fetch(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: openaiFormData,
      },
    )

    if (!transcriptionResponse.ok) {
      throw new Error('Transcription failed')
    }

    const transcriptionData = await transcriptionResponse.json()
    const transcription = transcriptionData.text

    // Analyze the transcription with GPT
    const analysisResponse = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant analyzing voice notes for a developer's captain's log. Categorize the content, extract key information, and assess potential for blog posts or projects. Respond ONLY with valid JSON in this exact format:
{
  "contentType": "thought|idea|blog-draft|project-idea|note|other",
  "summary": "Brief 1-2 sentence summary",
  "tags": ["tag1", "tag2", "tag3"],
  "blogPotential": true|false,
  "projectPotential": true|false
}`,
            },
            {
              role: 'user',
              content: transcription,
            },
          ],
          temperature: 0.7,
        }),
      },
    )

    if (!analysisResponse.ok) {
      throw new Error('Analysis failed')
    }

    const analysisData = await analysisResponse.json()
    const analysisText = analysisData.choices[0].message.content

    // Parse the analysis
    let analysis: {
      contentType: string
      summary: string
      tags: string[]
      blogPotential: boolean
      projectPotential: boolean
    }
    try {
      analysis = JSON.parse(analysisText)
    } catch {
      // Fallback if parsing fails
      analysis = {
        contentType: 'note',
        summary: transcription.substring(0, 100),
        tags: [],
        blogPotential: false,
        projectPotential: false,
      }
    }

    return NextResponse.json({
      transcription,
      ...analysis,
    })
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 })
  }
}
