// lib/metrics.ts
import client from "prom-client"

const register = new client.Registry()

// Prevent duplicate metric registration on hot reload
if (!global.promRegistry) {
  client.collectDefaultMetrics({ register })
  global.promRegistry = register
}

export default global.promRegistry as client.Registry
