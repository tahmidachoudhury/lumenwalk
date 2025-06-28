"use client"

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions"
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css"
import { useRef, useEffect, useState } from "react"
import NavigationSteps from "./ui/navigation-steps"
import RouteWrapper from "./ui/routeWrapper"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

type Step = {
  distance: number
  maneuver: { instruction: string }
}

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [steps, setSteps] = useState<Step[]>([])

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-0.1276, 51.5072],
      zoom: 13,
    })

    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl(), "top-right")

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: "metric",
      profile: "mapbox/walking",
      alternatives: false,
      controls: {
        instructions: false,
        profileSwitcher: false,
      },
    })

    map.addControl(directions, "top-left")

    directions.on("route", (e: any) => {
      const firstRoute = e.route[0]
      const legSteps = firstRoute.legs?.[0]?.steps ?? []
      setSteps(legSteps)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-[30%] bg-white overflow-y-auto border-r border-gray-200">
        <RouteWrapper steps={steps} />
      </div>

      {/* Map */}
      <div ref={mapContainer} className="w-[70%] h-full" />
    </div>
  )
}
