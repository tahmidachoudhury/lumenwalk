"use client"

import { useState, useEffect } from "react"
import {
  Brain,
  AlertTriangle,
  CheckCircle,
  Loader2,
  LoaderCircle,
} from "lucide-react"
import { getAIAssessment } from "@/services/ai-service"
import { useRoute } from "@/context/RouteContext"

export default function AIAssessment() {
  const { steps, distance, duration, origin, destination } = useRoute()
  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create route data object from context
  const routeData = {
    steps,
    distance,
    duration,
    origin,
    destination,
  }

  // Check if we have valid route data
  const hasRouteData = steps.length > 0 && origin && destination

  useEffect(() => {
    if (hasRouteData) {
      fetchAssessment()
    } else {
      // Clear assessment when no route data
      setAssessment(null)
    }
  }, [hasRouteData, steps, distance, duration, origin, destination])

  const fetchAssessment = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getAIAssessment(routeData)
      console.log(result)

      setAssessment(result)
    } catch (err) {
      setError("Failed to get AI assessment")
      console.error("AI Assessment error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
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

  return (
    <div className="bg-white rounded-lg h-full">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          AI Route Assessment
        </h2>
      </div>

      {assessment && !loading && (
        <div className="space-y-4">
          <div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {assessment.summary} {/* Changed from routeData.summary */}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">
                {assessment.safety}
              </span>{" "}
              {/* Changed from routeData.safety */}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Key Insights
            </h3>
            <ul className="space-y-1">
              {assessment.insights?.map((insight: string, i: number) => (
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
        </div>
      )}
      {!hasRouteData && !loading && (
        <p className="text-sm text-gray-500">
          Select a route to get AI analysis
        </p>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
