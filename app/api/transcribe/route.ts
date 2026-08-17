import { type NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '~/lib/session'

const SILENCE_HALLUCINATIONS = new Set([
  'thank you',
  'thank you for watching',
  'you',
  'the',
])

function isDetectableSpeech(text: string) {
  if (!text) return false
  const normalized = text
    .toLowerCase()
    .replace(/[^\w\s]|_/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return normalized.length > 0 && !SILENCE_HALLUCINATIONS.has(normalized)
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file' }, { status: 400 })
    }

    // Call Groq Whisper API (free tier)
    const groqFormData = new FormData()
    groqFormData.append('file', audioFile)
    groqFormData.append('model', 'whisper-large-v3-turbo')

    const transcriptionResponse = await fetch(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: groqFormData,
      },
    )

    if (!transcriptionResponse.ok) {
      throw new Error('Transcription failed')
    }

    const transcriptionData = await transcriptionResponse.json()
    const transcription = (transcriptionData.text || '').trim()

    if (!isDetectableSpeech(transcription)) {
      return NextResponse.json(
        {
          error:
            'No speech detected. Make sure your microphone is on and selected as the input device, Captain.',
        },
        { status: 422 },
      )
    }

    // Analyze the transcription with Groq
    const analysisResponse = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
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
