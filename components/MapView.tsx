"use client"

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions"
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css"
import { useRef, useEffect, useState } from "react"
import RouteWrapper from "./RouteWrapper"
import { useRoute } from "../context/RouteContext"
import { Step } from "@/services/routeUtils"
import Sidebar from "./Sidebar"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const { steps, distance, duration, origin, destination, setRouteEvent } =
    useRoute()

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
      alternatives: true,
      controls: {
        instructions: false,
        profileSwitcher: false,
      },
    })

    map.addControl(directions, "top-left")

    directions.on("route", (e: any) => {
      setRouteEvent(e)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  const shareUrl =
    origin && destination
      ? `http://localhost:3000/share?from=${origin.join(
          ","
        )}&to=${destination.join(",")}`
      : ""

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <Sidebar />
      {/* <div className="w-[30%] bg-white overflow-y-auto border-r border-gray-200">
        <RouteWrapper steps={steps} distance={distance} duration={duration} />
        {origin && destination && (
          <a
            href={shareUrl}
            target="_blank"
            className="fixed bottom-6 right-6 z-20 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow-lg transition"
            rel="noreferrer"
          >
            🔗 Share Route
          </a>
        )}
      </div> */}
      {/* Map */}
      <div ref={mapContainer} className="w-[100%] h-full" />
    </div>
  )
}
