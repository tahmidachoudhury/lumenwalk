interface AIAssessment {
  summary: string
  insights: string[]
  safety: string
}

export async function getAIAssessment(routeData: any): Promise<AIAssessment> {
  try {
    const response = await fetch("/api/ai-assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        routeData,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      summary: data.summary,
      insights: data.insights,
      safety: data.safety,
    }
  } catch (error) {
    console.error("Failed to get AI assessment:", error)
    throw error
  }
}

export async function getPoliceAssessment(
  routeData: any
): Promise<AIAssessment> {
  try {
    const response = await fetch("/api/crime-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        routeData,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      summary: data.summary,
      insights: data.insights,
      safety: data.safety,
    }
  } catch (error) {
    console.error("Failed to get police assessment:", error)
    throw error
  }
}
