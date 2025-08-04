"use client"

import AIAssessment from "./AIAssessment"
import PoliceAssessment from "./PoliceAssessment"
import RouteInstructions from "./RouteInstructions"
import { Clock, MapPin } from "lucide-react"
import { useRoute } from "../context/RouteContext"
import { Step } from "@/services/routeUtils"

interface RouteWrapperProps {
  steps: Step[]
  distance: number
  duration: number
  routeData?: any
}

function formatDistance(distance: number): string {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)} km`
  }
  return `${Math.round(distance)} m`
}

function formatDuration(duration: number): string {
  const minutes = Math.round(duration / 60)
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}

export default function RouteWrapper({
  steps,
  distance,
  duration,
  routeData,
}: RouteWrapperProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-3">Route Analysis</h1>

        {steps.length > 0 && (
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{formatDistance(distance)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(duration)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* AI Assessment Section */}
        <div className="border-b border-gray-200 p-4">
          <AIAssessment routeData={routeData} />
        </div>

        {/* Police Assessment Section */}
        <div className="border-b border-gray-200 p-4">
          <PoliceAssessment routeData={routeData} />
        </div>

        {/* Call to Action */}
        {steps.length > 0 && (
          <div className="border-b border-gray-200 p-4">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              onClick={() => console.log("Start Route clicked")}
            >
              Start Navigation
            </button>
          </div>
        )}

        {/* Route Instructions Section */}
        <div className="p-4">
          <RouteInstructions steps={steps} />
        </div>
      </div>
    </div>
  )
}
