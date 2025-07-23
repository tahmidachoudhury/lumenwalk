import RouteMap from "@/components/MapView"
import { RouteProvider } from "@/components/RouteContext"

export default function HomePage() {
  return (
    <main className="h-screen w-screen">
      <RouteProvider>
        <RouteMap />
      </RouteProvider>
    </main>
  )
}
