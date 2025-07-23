"use client"

import { Suspense } from "react"
import SharePage from "./SharePageInner"

export default function SharePageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SharePage />
    </Suspense>
  )
}
