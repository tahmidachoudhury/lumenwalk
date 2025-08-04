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

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-800" />
        <h3 className="text-lg font-semibold text-gray-900">
          Police Data Analysis
        </h3>
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
        <p className="text-sm text-gray-500">
          Select a route to get police data analysis
        </p>
      )}
    </div>
  )
}
