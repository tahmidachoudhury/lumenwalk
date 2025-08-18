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

export interface AssessmentProps {
  trigger: number
  assessmentResult: RefObject<any>
}

export default function AIAssessment({
  trigger,
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
    if (!trigger) return // skip on initial 0
    assessmentResult.current = null

    fetchAssessment()
  }, [trigger, steps, distance, duration, origin, destination])

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
      <div className="bg-black/60 rounded-lg p-4 h-full">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-white animate-pulse" />
          <h2 className="text-lg font-semibold text-white">
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
    <div className="bg-black/60 rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-white" />
        <h2 className="text-lg font-semibold text-white">
          AI Route Assessment
        </h2>
      </div>

      {assessmentResult.current && !loading && (
        <div className="space-y-4 overflow-y-auto">
          <div>
            <p className="text-white text-sm leading-relaxed">
              {assessmentResult.current.summary}{" "}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white mb-2">
              Key Insights
            </h3>
            <ul className="space-y-1">
              {assessmentResult.current.insights?.map(
                (insight: string, i: number) => (
                  <li
                    key={i}
                    className="text-xs text-white flex items-start gap-2"
                  >
                    <span className="w-1 h-1 bg-white rounded-full mt-2 flex-shrink-0"></span>
                    {insight}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}
      {!assessmentResult.current && !loading && (
        <p className="text-sm text-white">Select a route to get AI analysis</p>
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
