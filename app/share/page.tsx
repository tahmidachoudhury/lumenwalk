"use client"

import { useSearchParams } from "next/navigation"
import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions"
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css"
import NavigationSteps from "@/components/ui/navigation-steps"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

type Step = {
  distance: number
  maneuver: { instruction: string }
}

export default function SharePage() {
  const searchParams = useSearchParams()
  const [steps, setSteps] = useState<Step[] | null>(null)
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    const fromParam = searchParams.get("from")
    const toParam = searchParams.get("to")
    if (!fromParam || !toParam) return

    const from = fromParam.split(",").map(Number) as [number, number]
    const to = toParam.split(",").map(Number) as [number, number]

    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v12",
      center: from,
      zoom: 14,
    })

    mapRef.current = map
    map.addControl(new mapboxgl.NavigationControl(), "top-right")

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: "metric",
      profile: "mapbox/walking",
      controls: {
        inputs: false,
        instructions: false,
        profileSwitcher: false,
      },
    })

    map.addControl(directions, "top-left")
    directions.setOrigin(from)
    directions.setDestination(to)

    directions.on("route", (e: any) => {
      const leg = e.route[0]?.legs?.[0]
      if (!leg) return
      setSteps(leg.steps)
    })

    return () => map.remove()
  }, [searchParams])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Shared Route</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          {steps ? (
            <>
              <div className="h-[60%] min-h-0 ">
                <NavigationSteps steps={steps} />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    localStorage.setItem("route-feedback", "safe")
                    alert("Feedback recorded: 👍 Looks fine")
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  👍 Looks fine
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem("route-feedback", "risky")
                    alert("Feedback recorded: ⚠️ Seems risky")
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  ⚠️ Seems risky
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Loading route...</p>
          )}
        </div>

        <div
          ref={mapContainer}
          className="lg:col-span-2 w-full h-[500px] rounded overflow-hidden border"
        />
      </div>
    </div>
  )
}
