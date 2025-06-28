"use client"

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useRef, useEffect } from "react"
import { fetchRoutes } from "@/lib/fetchRoutes"
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions"
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-0.1276, 51.5072], // London
      zoom: 13,
    })

    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl(), "top-right")

    // map.on("load", () => {
    //   fetchRoutes(map, "-0.142,51.541", "-0.093,51.505")
    // })

    //mapbox built in ui for directions
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: "metric",
      profile: "mapbox/walking",
      alternatives: true,
      controls: {
        instructions: true,
        profileSwitcher: false,
      },
    })

    map.addControl(directions, "top-left")

    directions.on("route", (e: any) => {
      const firstRoute = e.route[0]
      console.log("Selected route:", firstRoute)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return <div ref={mapContainer} className="h-screen w-full" />
}
