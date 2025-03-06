import { NextResponse } from "next/server"

const GEMINI_API_KEY = "AIzaSyDpbfPlYz_liS9yMP6wX_V5C1y1MwaNgOw"
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    })

    const data = await response.json()

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 })
    }

    const textResponse = data.candidates[0].content.parts[0].text
    return NextResponse.json({ response: textResponse })
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

