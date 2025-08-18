import { NextRequest, NextResponse } from "next/server"

interface CrimeDataParams {
  lat: number
  lng: number
}

export function formatCrimeDataForPrompt(crimeData: any[]) {
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
export async function fetchCrimeDataDirect(lat: number, lng: number) {
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

// Import existing helper functions
import { callOpenAI, formatRouteForPrompt } from "../ai-assessment/route"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { routeData } = body

    // Validate route data (same validation)
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

    // Fetch crime data
    const crimeData = await fetchCrimeDataDirect(
      routeData.origin[1],
      routeData.origin[0]
    )

    const formattedRoute = formatRouteForPrompt(routeData)

    // Police-specific prompt
    const prompt = `Police safety analysis for pedestrian route:
    
    Route: ${formattedRoute}
    Crime data: ${formatCrimeDataForPrompt(crimeData)}
    
    STRICTLY JSON response:
    {"summary": "police perspective safety overview", "insights": ["top crimes", "is it safe at night", "tip3"], "safety": 1-4}
    
    Be specific on the summary. return useful insights and include facts from the crime data including the month they are from. STRICTLY return an integer only for the safety index. STRICTLY stick to this JSON structure.`

    const assessment = await callOpenAI(prompt)

    console.log("police assessment:", assessment)

    // Parse JSON response (same logic)
    let parsedAssessment
    try {
      parsedAssessment = JSON.parse(assessment)
    } catch (parseError) {
      console.error("Failed to parse OpenAI response as JSON:", assessment)
      parsedAssessment = {
        summary: "Police assessment completed",
        insights: [
          "Standard patrol area",
          "Follow general safety protocols",
          "Report suspicious activity",
          "Use well-lit routes when possible",
        ],
        safety: 2,
      }
    }

    return NextResponse.json(parsedAssessment)
  } catch (error) {
    console.error("Police AI Assessment error:", error)
    return NextResponse.json(
      { error: "Failed to get police assessment" },
      { status: 500 }
    )
  }
}
