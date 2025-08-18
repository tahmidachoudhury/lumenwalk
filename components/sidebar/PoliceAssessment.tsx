"use client"

import { useState, useEffect } from "react"
import { Shield, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { getPoliceAssessment } from "@/services/ai-service"

interface PoliceAssessmentProps {
  routeData?: any
}

export default function PoliceAssessment({ routeData }: PoliceAssessmentProps) {
  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (routeData) {
      fetchAssessment()
    }
  }, [routeData])

  const fetchAssessment = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getPoliceAssessment(routeData)
      setAssessment(result)
    } catch (err) {
      setError("Failed to get police data assessment")
      console.error("Police Assessment error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-black/60 rounded-lg p-4 h-full">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-white" />
          <h2 className="text-lg font-semibold text-white">
            Police Data Analysis
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
        <Shield className="w-5 h-5 text-white" />
        <h2 className="text-lg font-semibold text-white">
          Police Data Analysis
        </h2>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Analyzing police data...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {assessment && !loading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Analysis complete</span>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
            {assessment}
          </div>
        </div>
      )}

      {!routeData && !loading && (
        <p className="text-sm text-white">
          Select a route to get police data analysis
        </p>
      )}
    </div>
  )
}
