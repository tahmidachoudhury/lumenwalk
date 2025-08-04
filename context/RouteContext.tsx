//this context ensures the steps and other important route metadata is
//callable across the whole codebase

"use client"

import React, { createContext, useContext, useState } from "react"
import {
  Step,
  getSteps,
  getDistance,
  getDuration,
  getOriginCoord,
  getDestinationCoord,
} from "../services/routeUtils"

type RouteContextType = {
  steps: Step[]
  distance: number
  duration: number
  origin: [number, number] | null
  destination: [number, number] | null
  setRouteEvent: (e: any) => void
}

const RouteContext = createContext<RouteContextType | undefined>(undefined)

export const RouteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [steps, setSteps] = useState<Step[]>([])
  const [distance, setDistance] = useState(0)
  const [duration, setDuration] = useState(0)
  const [origin, setOrigin] = useState<[number, number] | null>(null)
  const [destination, setDestination] = useState<[number, number] | null>(null)

  // Call this ONCE when you get a new route event
  const setRouteEvent = (e: any) => {
    setSteps(getSteps(e))
    setDistance(getDistance(e))
    setDuration(getDuration(e))
    setOrigin(getOriginCoord(e))
    setDestination(getDestinationCoord(e))
  }

  return (
    <RouteContext.Provider
      value={{ steps, distance, duration, origin, destination, setRouteEvent }}
    >
      {children}
    </RouteContext.Provider>
  )
}

export function useRoute() {
  const context = useContext(RouteContext)
  if (!context) throw new Error("useRoute must be used within a RouteProvider")
  return context
}
