import { useEffect, useState } from "react"
import SunCalc from "suncalc"

export default function useLightPreset() {
  const lat = 51.5074 // London latitude
  const lon = -0.1278 // London longitude

  const [lightPreset, setLightPreset] = useState<"day" | "night">("day")

  useEffect(() => {
    const updatePreset = () => {
      const now = new Date()
      const times = SunCalc.getTimes(now, lat, lon)
      console.log("Now:", now.toString())
      console.log("Sunrise:", times.sunrise.toString())
      console.log("Sunset:", times.sunset.toString())

      if (now > times.sunset || now < times.sunrise) {
        setLightPreset("night")
      } else {
        setLightPreset("day")
      }
    }

    updatePreset()
    const interval = setInterval(updatePreset, 60 * 1000)

    return () => clearInterval(interval)
  }, [lat, lon])

  return lightPreset
}
