import { useEffect, useState } from "react"
import SunCalc from "suncalc"

export default function useLightPreset(lat: number, lon: number) {
  const [lightPreset, setLightPreset] = useState<"day" | "night">("day")

  useEffect(() => {
    const updatePreset = () => {
      const now = new Date()
      const times = SunCalc.getTimes(now, lat, lon)

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
