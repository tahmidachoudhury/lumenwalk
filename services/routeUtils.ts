export type Step = {
  distance: number
  duration: number
  maneuver: { instruction: string; type: string }
  name: string
}

export type RouteSummary = {
  steps: Step[]
  distance: number
  duration: number
  origin?: [number, number]
  destination?: [number, number]
}

/**
 * Extracts steps, distance, duration, origin, and destination from a Mapbox Directions API route event.
 * @param e The event object from the Mapbox Directions 'route' event
 */

export function getSteps(e: any): Step[] {
  const firstRoute = e.route[0]
  const leg = firstRoute.legs?.[0]
  return leg?.steps ?? []
}

export function getDistance(e: any): number {
  const firstRoute = e.route[0]
  return firstRoute.distance
}

export function getDuration(e: any): number {
  const firstRoute = e.route[0]
  return firstRoute.duration
}

export function getOriginCoord(e: any): [number, number] {
  const firstRoute = e.route[0]
  const leg = firstRoute.legs?.[0]
  return leg?.steps[0]?.maneuver.location as [number, number]
}

export function getDestinationCoord(e: any): [number, number] {
  const firstRoute = e.route[0]
  const leg = firstRoute.legs?.[0]
  return leg?.steps[leg.steps.length - 1]?.maneuver.location as [number, number]
}
