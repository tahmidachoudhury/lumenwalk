"use client"

import { useState, useEffect, useRef, RefObject } from "react"
import {
  Brain,
  AlertTriangle,
  CheckCircle,
  Loader2,
  LoaderCircle,
} from "lucide-react"
import { getAIAssessment } from "@/services/ai-service"
import { useRoute } from "@/context/RouteContext"

interface AssessmentProps {
  prevStepsLength: RefObject<number>
  assessmentResult: RefObject<any>
}

export default function AIAssessment({
  prevStepsLength,
  assessmentResult,
}: AssessmentProps) {
  const { steps, distance, duration, origin, destination } = useRoute()
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

  useEffect(() => {
    //when it is the first change, prevsteps is 0 (falsy) and steps.length
    //will be truthy -> afterwards it will keep checking if the number of steps
    //changed
    const stepsChanged = prevStepsLength.current !== steps.length
    if (stepsChanged) {
      prevStepsLength.current = steps.length
      assessmentResult.current = null
      fetchAssessment()
    }
  }, [steps, distance, duration, origin, destination])

  const fetchAssessment = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getAIAssessment(routeData)

      assessmentResult.current = result
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
    <div className="bg-white border border-gray-200 rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          AI Route Assessment
        </h2>
      </div>

      {assessmentResult.current && !loading && (
        <div className="space-y-4">
          <div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {assessmentResult.current.summary}{" "}
              {/* Changed from routeData.summary */}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">
                {assessmentResult.current.safety}
              </span>{" "}
              {/* Changed from routeData.safety */}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Key Insights
            </h3>
            <ul className="space-y-1">
              {assessmentResult.current.insights?.map(
                (insight: string, i: number) => (
                  <li
                    key={i}
                    className="text-xs text-gray-600 flex items-start gap-2"
                  >
                    <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    {insight}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}
      {!assessmentResult.current && !loading && (
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
