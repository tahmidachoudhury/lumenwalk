import { NextResponse } from "next/server"
import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { steps } = await req.json()

    if (!steps || !Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json(
        {
          summary: "No pedestrian route information available.",
          insights: ["No data", "No data", "No data", "No data"],
          difficulty: "Unknown",
          estimatedTime: "N/A",
        },
        { status: 400 }
      )
    }

    // Convert steps to readable format
    const stepDescriptions = steps
      .map(
        (step: any, i: number) =>
          `${i + 1}. ${step.maneuver?.instruction} (${step.distance}m)`
      )
      .join("\n")

    const prompt = `
You are a pedestrian navigation assistant. Your main focus is guiding the user on a safe path.

Given the following step-by-step route:

${stepDescriptions}

Respond strictly in this JSON format:
{
  "summary": "Human-readable overview. Comment VERY briefly on the safety of the route",
  "insights": ["", "", "", ""],
  "safety": "Very Safe | Sketchy | Not Safe",
}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    })

    const raw = completion.choices[0].message.content ?? ""

    console.log("[OpenAI Raw Output]", raw)

    // Try to parse the response
    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch (err) {
      console.error("Failed to parse OpenAI response:", err)
      return NextResponse.json(
        {
          summary: "Could not parse OpenAI response.",
          insights: ["Error", "Error", "Error", "Error"],
          difficulty: "Unknown",
          estimatedTime: "N/A",
        },
        { status: 500 }
      )
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error("[Route Assessment Error]", err)
    return NextResponse.json(
      {
        summary: "Server error while generating assessment.",
        insights: ["Error", "Error", "Error", "Error"],
        difficulty: "Unknown",
        estimatedTime: "N/A",
      },
      { status: 500 }
    )
  }
}
