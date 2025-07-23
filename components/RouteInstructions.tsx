"use client"

import {
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowUpLeft,
  Navigation,
} from "lucide-react"

import { Step } from "@/services/routeUtils"

interface RouteInstructionsProps {
  steps: Step[]
}

function getManeuverIcon(instruction: string) {
  const lowerInstruction = instruction.toLowerCase()

  if (lowerInstruction.includes("turn left")) {
    return <ArrowLeft className="w-4 h-4" />
  } else if (lowerInstruction.includes("turn right")) {
    return <ArrowRight className="w-4 h-4" />
  } else if (lowerInstruction.includes("keep right")) {
    return <ArrowUpRight className="w-4 h-4" />
  } else if (lowerInstruction.includes("keep left")) {
    return <ArrowUpLeft className="w-4 h-4" />
  } else {
    return <ArrowUp className="w-4 h-4" />
  }
}

function formatDistance(distance: number): string {
  if (distance >= 100) {
    const km = distance / 1000
    return `${km.toFixed(2).replace(/\.?0+$/, "")}km`
  }
  return `${Math.round(distance)}m`
}

export default function RouteInstructions({ steps }: RouteInstructionsProps) {
  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex items-center gap-2">
        <Navigation className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Turn-by-Turn Directions
        </h3>
      </div>

      {steps.length === 0 ? (
        <p className="text-sm text-gray-500">
          Click on the map to set your starting point and destination to see
          turn-by-turn directions.
        </p>
      ) : (
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-hide space-y-2 pr-2">
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
