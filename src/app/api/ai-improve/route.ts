'use server'

import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function POST(request: NextRequest) {
  try {
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const { type, content } = await request.json()

    let prompt = ''

    if (type === 'improve-summary') {
      prompt = `You are a professional CV writer. Improve and rewrite the following professional summary to be more impactful, concise, and professional. Keep it under 3-4 sentences:

"${content}"

Return only the improved summary, nothing else.`
    } else if (type === 'improve-experience') {
      prompt = `You are a professional CV writer. Improve this work experience description by making it more impactful, adding action verbs, and following best practices:

"${content}"

Return only the improved description with bullet points, nothing else.`
    } else if (type === 'check-grammar') {
      prompt = `You are a grammar and professional writing expert. Check the following text for grammar, spelling, and professional writing issues. Provide suggestions:

"${content}"

Return a JSON object with: { "original": text, "corrected": corrected_text, "suggestions": [array of improvements] }`
    }

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenRouter error:', error)
      return NextResponse.json(
        { error: 'Failed to generate content' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const result = data.choices[0]?.message?.content || ''

    return NextResponse.json({ result })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
