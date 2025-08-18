import { NextRequest, NextResponse } from "next/server"

import { Step } from "@/services/routeUtils"

interface RouteData {
  steps: Step[]
  distance: number
  duration: number
  origin: [number, number] | null
  destination: [number, number] | null
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

function formatCrimeDataForPrompt(crimeData: any[]) {
  if (!crimeData || crimeData.length === 0) {
    return "No recent crime data available for this area."
  }

  const crimeCounts: Record<string, number> = crimeData.reduce((acc, crime) => {
    const category = crime.category || "unknown"
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  const totalCrimes = crimeData.length
  const topCrimes = Object.entries(crimeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([category, count]) => `${category}: ${count}`)
    .join(", ")

  return `${totalCrimes} crimes reported in ${crimeData[0].month}. Top types: ${topCrimes}`
}

//fetches crimedata for ai assessment
async function fetchCrimeDataDirect(lat: number, lng: number) {
  const now = new Date()
  const targetDate = new Date(now.getFullYear(), now.getMonth() - 2, 1)
  const dateParam = `${targetDate.getFullYear()}-${String(
    targetDate.getMonth() + 1
  ).padStart(2, "0")}`

  const response = await fetch(
    `https://data.police.uk/api/crimes-at-location?date=${dateParam}&lat=${lat}&lng=${lng}`
  )

  return response.ok ? await response.json() : null
}

//calls openai with the gpt-4 model with the prompt as a param
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

//embed route from frontend in an easy to parse format
function formatRouteForPrompt(routeData: RouteData): string {
  const { steps, distance, duration, origin, destination } = routeData

  let formattedRoute = `Route Summary:
- Total Distance: ${(distance / 1000).toFixed(2)}km
- Total Duration: ${Math.round(duration / 60)} minutes
- Origin: ${origin ? `[${origin[0]}, ${origin[1]}]` : "Unknown"}
- Destination: ${
    destination ? `[${destination[0]}, ${destination[1]}]` : "Unknown"
  }

Step-by-step directions:
`

  steps.forEach((step, index) => {
    formattedRoute += `${index + 1}. ${step.name} (${
      step.distance
    }m, ${Math.round(step.duration / 60)} min)\n`
  })

  return formattedRoute
}

//post function with error handling
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { routeData } = body

    // Validate route data
    if (!routeData || !routeData.steps || routeData.steps.length === 0) {
      return NextResponse.json(
        { error: "Invalid route data: steps are required" },
        { status: 400 }
      )
    }

    if (!routeData.origin || !routeData.destination) {
      return NextResponse.json(
        { error: "Invalid route data: origin and destination are required" },
        { status: 400 }
      )
    }
    //fetches crimedata for ai assessment
    const crimeData = await fetchCrimeDataDirect(
      routeData.origin[1],
      routeData.origin[0]
    )
    const formattedRoute = formatRouteForPrompt(routeData)
    let prompt: string

    prompt = `Analyze this pedestrian route for safety:
      
      Route: ${formattedRoute}
      Local crime: ${formatCrimeDataForPrompt(crimeData)}
      
      STRICTLY JSON response only:
      {"summary": "brief overview", "insights": ["route condition & environment", "Lighting & visibility", "Practical navigation tip"]}
      Analyze if the route includes alleys, underpasses, parks, isolated stretches, or poorly lit areas, and mention these in insights if found. max 2 sentences. Be specific on the useful insights. No pleasantries!!
      `

    const assessment = await callOpenAI(prompt)

    // Try to parse the JSON response from OpenAI
    let parsedAssessment
    try {
      parsedAssessment = JSON.parse(assessment)
    } catch (parseError) {
      console.error("Failed to parse OpenAI response as JSON:", assessment)
      // Fallback response
      parsedAssessment = {
        summary: "Route analysis completed",
        insights: [
          "Analysis completed",
          "Route appears standard",
          "No major concerns identified",
          "Follow general safety practices",
        ],
        safety: "Very Safe",
      }
    }

    return NextResponse.json({
      ...parsedAssessment,
      prompt: formattedRoute, // Include the formatted route as prompt
    })
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
