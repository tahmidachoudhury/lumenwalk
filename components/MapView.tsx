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
  const [duration, setDuration] = useState<number>(0)
  const [distance, setDistance] = useState<number>(0)
  const [from, setFrom] = useState<[number, number] | null>(null)
  const [to, setTo] = useState<[number, number] | null>(null)

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
      const leg = firstRoute.legs?.[0]

      const legSteps = leg?.steps ?? []
      setSteps(legSteps)
      setDistance(firstRoute.distance)
      setDuration(firstRoute.duration)

      // ✅ Set origin and destination
      const originCoord = leg?.steps[0]?.maneuver.location
      const destinationCoord =
        leg?.steps[leg.steps.length - 1]?.maneuver.location

      if (originCoord && destinationCoord) {
        setFrom(originCoord as [number, number])
        setTo(destinationCoord as [number, number])
      }

      console.log({ from: originCoord, to: destinationCoord })
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  const shareUrl =
    from && to
      ? `http://localhost:3000/share?from=${from.join(",")}&to=${to.join(",")}`
      : ""

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-[30%] bg-white overflow-y-auto border-r border-gray-200">
        <RouteWrapper steps={steps} distance={distance} duration={duration} />

        {from && to && (
          <a
            href={shareUrl}
            target="_blank"
            className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow-lg transition"
          >
            🔗 Share Route
          </a>
        )}
      </div>

      {/* Map */}
      <div ref={mapContainer} className="w-[70%] h-full" />
    </div>
  )
}
