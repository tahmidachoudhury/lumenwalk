export async function getAIAssessment(routeData: any): Promise<string> {
  try {
    const response = await fetch("/api/ai-assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        routeData,
        assessmentType: "general",
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.assessment
  } catch (error) {
    console.error("Failed to get AI assessment:", error)
    throw error
  }
}

export async function getPoliceAssessment(routeData: any): Promise<string> {
  try {
    const response = await fetch("/api/ai-assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        routeData,
        assessmentType: "police",
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.assessment
  } catch (error) {
    console.error("Failed to get police assessment:", error)
    throw error
  }
}
