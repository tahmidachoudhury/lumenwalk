// app/api/metrics/route.ts
import register from "@/lib/metrics"

export async function GET() {
  const metrics = await register.metrics()

  return new Response(metrics, {
    status: 200,
    headers: {
      "Content-Type": register.contentType,
    },
  })
}
