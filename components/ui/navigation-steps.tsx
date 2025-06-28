import {
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowUpLeft,
} from "lucide-react"

interface Step {
  maneuver: {
    instruction: string
  }
  distance: number
}

interface Props {
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

function formatDistance(distance: number) {
  if (distance >= 100) {
    const km = distance / 1000
    return `${km.toFixed(2).replace(/\.?0+$/, "")}km`
  }
  return `${Math.round(distance)}m`
}

export default function NavigationSteps({ steps }: Props) {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4 flex-shrink-0">
        Route Instructions
      </h2>
      {steps.length === 0 ? (
        <p className="text-gray-500">Choose a route to view instructions.</p>
      ) : (
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-hide space-y-1 pr-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 py-2">
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mt-0.5">
                  {getManeuverIcon(step.maneuver.instruction)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium leading-tight">
                    {step.maneuver.instruction}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
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
