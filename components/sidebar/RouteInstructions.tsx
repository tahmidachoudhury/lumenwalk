"use client"

import {
  Navigation,
  MapPin,
  Footprints,
  CornerLeftUp,
  CornerRightUp,
  MoveUpRight,
  MoveUpLeft,
  MoveUp,
  CornerUpRightIcon,
  CornerUpLeft,
  Clock,
} from "lucide-react"

import { Step } from "@/services/routeUtils"

interface RouteInstructionsProps {
  steps: Step[]
  distance: number
  duration: number
}

function getManeuverIcon(instruction: string) {
  const lowerInstruction = instruction.toLowerCase()

  if (lowerInstruction.includes("turn left")) {
    return <CornerUpLeft className="w-4 h-4 text-blue-900" />
  } else if (lowerInstruction.includes("turn right")) {
    return <CornerUpRightIcon className="w-4 h-4 text-blue-900" />
  } else if (lowerInstruction.includes("keep right")) {
    return <MoveUpRight className="w-4 h-4 text-blue-900" />
  } else if (lowerInstruction.includes("keep left")) {
    return <MoveUpLeft className="w-4 h-4 text-blue-900" />
  } else {
    return <MoveUp className="w-4 h-4 text-blue-900" />
  }
}

function formatDistance(distance: number): string {
  if (distance >= 100) {
    const km = distance / 1000
    return `${km.toFixed(2).replace(/\.?0+$/, "")}km`
  }
  return `${Math.round(distance)}m`
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

export default function RouteInstructions({
  steps,
  distance,
  duration,
}: RouteInstructionsProps) {
  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Icon and Title */}
        <div className="flex flex-[4] items-center gap-2">
          <Navigation className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Turn-by-Turn Directions
          </h3>
        </div>

        {/* Right side - Distance and Duration */}
        {steps.length > 0 && (
          <div className="ml-auto flex flex-col items-end gap-1 text-sm text-black text-right">
            <div className="flex items-center gap-1">
              <span>{formatDistance(distance)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{formatDuration(duration)}</span>
            </div>
          </div>
        )}
      </div>

      {steps.length === 0 ? (
        <p className="text-sm text-gray-500">
          Click on the map to set your starting point and destination to see
          turn-by-turn directions.
        </p>
      ) : (
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto space-y-2 pr-2 max-h-200 ">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mt-0.5">
                  {getManeuverIcon(step.maneuver.instruction)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 leading-tight">
                    {step.maneuver.instruction}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {formatDistance(step.distance)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
