"use client"

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions"
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css"
import { useRef, useEffect, useState } from "react"
import { useRoute } from "../context/RouteContext"
import { Step } from "@/services/routeUtils"
import Sidebar from "./sidebar/Sidebar"
import useLightPreset from "@/services/suncalc"

//I decided to hardcode this
//additionally the risk level is very low and I have restricted the token to my domain and set usage limits
// export const mapboxToken =
//   "pk.eyJ1IjoidGFobWlkMDEiLCJhIjoiY21laDJlb2V1MDNjYjJqcXR1bDVsOWk0ciJ9.g9SK74J7CjcAruee18L7YA"
export const mapboxToken =
  "pk.eyJ1IjoidGFobWlkMDEiLCJhIjoiY21laDJkMnJjMDM0bjJrcDZucm1ubDZ5cCJ9.p85LMck0PSQRKa_obWk68w"

mapboxgl.accessToken = mapboxToken

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const { steps, distance, duration, origin, destination, setRouteEvent } =
    useRoute()
  const lightPreset = useLightPreset(-0.1276, 51.5072)

  // useEffect(() => {
  //   if (mapRef.current) {
  //     mapRef.current.setConfigProperty("basemap", "lightPreset", lightPreset)
  //   }
  // }, [lightPreset])

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/standard", // must be Standard
      center: [-0.1276, 51.5072],
      zoom: 13,
    })

    mapRef.current = map

    map.once("style.load", () => {
      map.setConfigProperty("basemap", "lightPreset", lightPreset)
    })

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right")

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: "metric",
      profile: "mapbox/walking",
      walkway_bias: 1,
      alternatives: true,
      controls: {
        instructions: false,
        profileSwitcher: false,
      },
    })

    map.addControl(directions, "top-right")

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
      {/* This is the shareroute funcitonality which i decided to not include */}
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
