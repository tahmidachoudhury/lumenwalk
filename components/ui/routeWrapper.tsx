"use client"

import { useEffect, useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import NavigationSteps from "./navigation-steps"
import RouteAssessment from "./route-assessment"

interface Step {
  maneuver: {
    instruction: string
  }
  distance: number
}

interface Assessment {
  summary: string
  insights: string[]
  difficulty: string
  estimatedTime: string
}

interface Props {
  steps: Step[]
  distance: number
  duration: number
}

export default function RouteWrapper({ steps, distance, duration }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getAssessment = async () => {
      setIsLoading(true)
      const res = await fetch("/api/route-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steps }),
      })
      const data = await res.json()
      setAssessment(data)
      setIsLoading(false)
    }

    getAssessment()
  }, [steps])

  return (
    <>
      {/* Desktop Layout - 30% width sidebar */}
      <div className="hidden lg:flex lg:w-[30%] lg:h-screen lg:fixed lg:left-0 lg:top-0 bg-gray-50 border-r border-gray-200 ">
        <div className="flex flex-col w-full p-4">
          <h1 className="text-xl font-bold text-gray-900 mb-4">
            Navigation & Analysis
          </h1>

          <div className="flex flex-col gap-4 h-full min-h-0">
            {/* Navigation Steps - Fixed height, scrollable */}
            <div className="h-[60%] min-h-0 ">
              <NavigationSteps
                steps={steps}
                distance={distance}
                duration={duration}
              />
            </div>

            {/* AI Assessment - Remaining space */}
            <div className="flex-1 min-h-0">
              <RouteAssessment
                steps={steps}
                assessment={assessment}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Slideable panel */}
      <div className="lg:hidden">
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="fixed bottom-4 left-4 z-50 bg-gray-900 text-white p-3 rounded-full shadow-lg"
        >
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronUp className="w-5 h-5" />
          )}
        </button>

        {/* Sliding Panel */}
        <div
          className={`fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 transition-transform duration-300 ease-in-out z-40 ${
            isExpanded ? "translate-y-0" : "translate-y-[calc(100%-4rem)]"
          }`}
          style={{ height: "70vh" }}
        >
          {/* Handle bar */}
          <div className="flex justify-center py-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <div className="flex flex-col h-full p-4 pb-20">
            <h1 className="text-lg font-bold text-gray-900 mb-4">
              Navigation & Analysis
            </h1>

            <div className="flex flex-col gap-4 h-full min-h-0">
              {/* Navigation Steps - Fixed height, scrollable */}
              <div className="h-1/2 min-h-0">
                <NavigationSteps steps={steps} />
              </div>

              {/* AI Assessment - Remaining space */}
              <div className="flex-1 min-h-0">
                <RouteAssessment
                  assessment={assessment}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map area placeholder - 70% width on desktop, full width on mobile */}
      <div className="lg:ml-[30%] lg:w-[70%] w-full h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="text-xl">Map Interface Goes Here</p>
          <p className="text-sm mt-2">
            This area takes up 70% on desktop, 100% on mobile
          </p>
        </div>
      </div>
    </>
  )
}
