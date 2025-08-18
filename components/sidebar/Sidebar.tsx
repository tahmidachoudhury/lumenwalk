"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, MoveLeft } from "lucide-react"
import AIAssessment from "./AIAssessment"
import PoliceAssessment from "./PoliceAssessment"
import RouteInstructions from "./RouteInstructions"
import { useRoute } from "@/context/RouteContext"

interface SidebarProps {
  routeData?: any
  routeSteps?: any[]
}

export default function Sidebar({ routeData, routeSteps = [] }: SidebarProps) {
  const { steps, distance, duration, origin, destination } = useRoute()
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  //this will allow me to track if the steps have changed
  const prevStepsLength = useRef<number>(0)

  //this will store the assessment result so users can
  //come back to it
  const assessmentRef = useRef<any>(null)

  useEffect(() => {
    // Only run if we have meaningful route data
    if (steps.length > 0 && origin && destination) {
      setCurrentStep(0)
      setIsOpen(true)
    }
  }, [steps.length, origin, destination])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Sidebar - width hardcoded to 400px */}
      <div
        className={`bg-black/20 rounded-xl backdrop-blur-sm border border-white/30 shadow-xl fixed top-0 left-0 h-full z-40 border-r flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0 w-[400px]" : "-translate-x-full w-[400px]"
        }`}
      >
        {isOpen && (
          <div>
            {/* AI and Police analysis Instructions Section */}
            {currentStep === 0 && (
              <div className="flex flex-col h-full overflow-y-auto">
                {/* AI Assessment Section */}
                <div className=" p-4">
                  <AIAssessment
                    prevStepsLength={prevStepsLength}
                    assessmentResult={assessmentRef}
                  />
                </div>

                {/* Police Assessment Section */}
                <div className=" p-4">
                  <PoliceAssessment routeData={routeData} />
                </div>

                {/* Call to Action */}
                <div className=" p-4">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    onClick={() => setCurrentStep(1)}
                  >
                    Start Route
                  </button>
                </div>
              </div>
            )}

            {/* Route Instructions Section */}
            {currentStep === 1 && (
              <div className="flex-1 p-4 min-h-0">
                <div
                  onClick={() => {
                    setCurrentStep(0)
                  }}
                  className="cursor-pointer text-black hover:text-blue-600 mb-4"
                >
                  <MoveLeft />
                </div>
                <RouteInstructions
                  steps={steps}
                  distance={distance}
                  duration={duration}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toggle Arrow - hardcoded to 400px */}

      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 transform -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-r-md p-2 shadow-md hover:bg-gray-50 transition-colors duration-200"
        style={{
          left: isOpen ? "400px" : "0%",
          transition: "left 0.3s ease-in-out",
        }}
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        )}
      </button>
    </>
  )
}
