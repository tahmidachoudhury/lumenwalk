import { Brain, Clock, CheckCircle, LoaderCircle } from "lucide-react"

interface Props {
  steps: Step[]
  assessment: Assessment
  isLoading?: boolean
}

type Step = {
  distance: number
  maneuver: { instruction: string }
}

interface Assessment {
  summary: string
  insights: string[]
  safety: string
  estimatedTime: string
}

// Mock AI assessment - replace with actual OpenAI API call
// function generateRouteAssessment(steps: Step[]) {
//   const totalDistance = steps.reduce((sum, step) => sum + step.distance, 0)
//   const totalTurns = steps.filter((step) =>
//     step.maneuver.instruction.toLowerCase().includes("turn")
//   ).length

//   return {
//     summary:
//       "This route appears to be well-optimized for pedestrian navigation with clear waypoints.",
//     insights: [
//       `Total distance: ${
//         totalDistance >= 1000
//           ? `${(totalDistance / 1000).toFixed(1)}km`
//           : `${totalDistance}m`
//       }`,
//       `${totalTurns} turns required - moderate complexity`,
//       "Route uses established walkways and streets",
//       "Good visibility at most intersections",
//     ],
//     difficulty: "Easy",
//     estimatedTime: `${Math.ceil(totalDistance / 80)} minutes`, // ~80m per minute walking
//   }
// }

export default function RouteAssessment({
  steps,
  assessment,
  isLoading = false,
}: Props) {
  if (!assessment) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 h-full">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            AI Route Assessment
          </h2>
        </div>
        <p className="text-gray-500">
          Select a route to get AI insights and recommendations.
        </p>
      </div>
    )
  }
  const encoded = btoa(JSON.stringify(steps))
  const shareUrl = `http://localhost:3000/share?data=${encoded}`

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 h-full">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-blue-600 animate-pulse" />
          <h2 className="text-lg font-semibold text-gray-900">
            AI Route Assessment
          </h2>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
        <LoaderCircle className="w-4 h-4 animate-spin text-blue-600" />
        <span>Analyzing route...</span>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          AI Route Assessment
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {assessment.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">{assessment.safety}</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Key Insights
          </h3>
          <ul className="space-y-1">
            {assessment.insights.map((insight, i) => (
              <li
                key={i}
                className="text-xs text-gray-600 flex items-start gap-2"
              >
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                {insight}
              </li>
            ))}
          </ul>
        </div>

        <a
          href={shareUrl}
          target="_blank"
          className="text-blue-600 underline text-sm "
        >
          Share this route
        </a>
      </div>
    </div>
  )
}
