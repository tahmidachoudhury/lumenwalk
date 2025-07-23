import { Step } from "./routeUtils"

interface MapboxDirectionsResponse {
  routes: Array<{
    legs: Array<{
      steps: Array<{
        maneuver: {
          instruction: string
          type: string
        }
        distance: number
        duration: number
      }>
    }>
    distance: number
    duration: number
  }>
}

const MAPBOX_API_URL = "https://api.mapbox.com/directions/v5/mapbox"

export async function getRouteInstructions(
  start: [number, number],
  end: [number, number],
  profile: "driving" | "walking" | "cycling" = "walking"
): Promise<{
  steps: Step[]
  totalDistance: number
  totalDuration: number
}> {
  const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`
  const url = `${MAPBOX_API_URL}/${profile}/${coordinates}?steps=true&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Mapbox API error: ${response.status}`)
  }

  const data: MapboxDirectionsResponse = await response.json()

  if (!data.routes || data.routes.length === 0) {
    throw new Error("No routes found")
  }

  const route = data.routes[0]
  const steps: Step[] = []

  // Flatten all steps from all legs
  route.legs.forEach((leg) => {
    leg.steps.forEach((step) => {
      steps.push({
        maneuver: {
          instruction: step.maneuver.instruction,
          type: step.maneuver.type,
        },
        distance: step.distance,
        duration: step.duration,
      })
    })
  })

  return {
    steps,
    totalDistance: route.distance,
    totalDuration: route.duration,
  }
}

export async function getRoute(
  start: [number, number],
  end: [number, number],
  profile: "driving" | "walking" | "cycling" = "walking"
) {
  const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`
  const url = `${MAPBOX_API_URL}/${profile}/${coordinates}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Mapbox API error: ${response.status}`)
  }

  const data = await response.json()
  return data.routes[0] || null
}
