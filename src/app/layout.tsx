import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter as FontSans } from "next/font/google"

import { cn } from "../lib/utils"
import LayoutClient from "./layout-client"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Effi Rental Dashboard",
  description: "Effi Rental Dashboard - Manage your rental operations with ease and efficiency.",
  manifest: "/web.manifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Effi Rental",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
      { url: "/apple-icon-180.png", sizes: "180x180" },
    ],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#0ea5e9" }],
  },
}

export const viewport: Viewport = {
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
