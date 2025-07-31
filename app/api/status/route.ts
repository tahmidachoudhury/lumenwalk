import { NextResponse } from "next/server"
import { GIT_COMMIT } from "@/commit"

export async function GET() {
  return NextResponse.json({
    ok: true,
    status: "healthy",
    gitCommit: GIT_COMMIT,
    timestamp: new Date().toISOString(),
  })
}
