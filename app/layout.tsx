import type { Metadata } from "next"
import "./globals.css"
import "mapbox-gl/dist/mapbox-gl.css"
import { Gabarito } from "next/font/google"

const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "LumenWalk",
  icons: {
    icon: "/lumenwalk_favicon.png",
    shortcut: "/lumenwalk_favicon.png",
    apple: "/lumenwalk_favicon.png",
  },
  description:
    "LumenWalk guides walkers with turn-by-turn directions, real-time distance and time tracking, making every journey simpler and safer.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="59b5e23e-fd6e-4201-9ae5-59a0bc2bedeb"
        ></script>
      </head>
      <body className={gabarito.className}>{children}</body>
    </html>
  )
}
