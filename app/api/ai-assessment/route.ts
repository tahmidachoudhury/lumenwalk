import { NextRequest, NextResponse } from "next/server"

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

async function callOpenAI(prompt: string): Promise<string> {
  // Add safety check first
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set")
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  })

  // Add error logging
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
  }

  const data: OpenAIResponse = await response.json()
  return data.choices[0]?.message?.content || "No response received"
}

export async function POST(request: NextRequest) {
  try {
    const { routeData, assessmentType } = await request.json()

    let prompt: string

    if (assessmentType === "general") {
      prompt = `
        You are a pedestrian navigation assistant. Your main focus is guiding the user on a safe path.

        Given the following step-by-step route:

        ${routeData}

        Respond strictly in this JSON format:
        {
          "summary": "Human-readable overview. Comment VERY briefly on the safety of the route",
          "insights": ["", "", "", ""],
          "safety": "Very Safe | Sketchy | Not Safe",
        }

      `
    } else if (assessmentType === "police") {
      prompt = `
        Based on Metropolitan Police data and this route information, provide a security assessment:
        
        Route Data: ${JSON.stringify(routeData)}
        
        Please analyze:
        1. Crime statistics for the area
        2. Time-of-day safety considerations
        3. Specific areas of concern along the route
        4. Safety recommendations
        
        Provide a practical, informative assessment.
      `
    } else {
      return NextResponse.json(
        { error: "Invalid assessment type" },
        { status: 400 }
      )
    }

    const assessment = await callOpenAI(prompt)
    return NextResponse.json({ assessment })
  } catch (error) {
    console.error("AI Assessment error:", error)
    return NextResponse.json(
      {
        error: "Failed to get AI assessment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
