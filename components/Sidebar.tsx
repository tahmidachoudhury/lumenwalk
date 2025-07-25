"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import AIAssessment from "./AIAssessment"
import PoliceAssessment from "./PoliceAssessment"
import RouteInstructions from "./RouteInstructions"

interface SidebarProps {
  routeData?: any
  routeSteps?: any[]
}

export default function Sidebar({ routeData, routeSteps = [] }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-[30%]" : "w-0"
        } transition-all duration-300 ease-in-out bg-white border-r border-gray-200 flex flex-col overflow-hidden`}
      >
        {isOpen && (
          <div className="flex flex-col h-full overflow-y-auto">
            {/* AI Assessment Section */}
            <div className="border-b border-gray-200 p-4">
              <AIAssessment routeData={routeData} />
            </div>

            {/* Police Assessment Section */}
            <div className="border-b border-gray-200 p-4">
              <PoliceAssessment routeData={routeData} />
            </div>

            {/* Call to Action */}
            <div className="border-b border-gray-200 p-4">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                onClick={() => console.log("Start Route clicked")}
              >
                Start Route
              </button>
            </div>

            {/* Route Instructions Section */}
            <div className="flex-1 p-4 min-h-0">
              <RouteInstructions steps={routeSteps} />
            </div>
          </div>
        )}
      </div>

      {/* Toggle Arrow */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 transform -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-r-md p-2 shadow-md hover:bg-gray-50 transition-colors duration-200"
        style={{
          left: isOpen ? "30%" : "0%",
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
